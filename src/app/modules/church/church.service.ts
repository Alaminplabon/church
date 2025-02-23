import httpStatus from 'http-status';
import { IChurch } from './church.interface';
import Church from './church.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import mongoose, { Types } from 'mongoose';
import { UploadedFiles } from '../../interface/common.interface';
import { deleteManyFromS3, uploadManyToS3 } from '../../utils/s3';
import Sponsor from '../sponsor/sponsor.models';
import moment from 'moment';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import { paginationFields } from '../../constants/pagination';
import { USER_ROLE } from '../user/user.constants';
import { churchSearchableFields } from './church.constants';
import { paginationHelper } from '../../helpers/pagination.helpers';

const createChurch = async (payload: IChurch, files: any): Promise<IChurch> => {
  if (!mongoose.Types.ObjectId.isValid(payload.administrator as any)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid administrator ID');
  }
  // Check if the administrator already manages a church
  const existingChurch = await Church.findOne({
    administrator: payload.administrator,
  });
  if (existingChurch) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Administrator already manages a church',
    );
  }

  if (files) {
    const { images } = files as UploadedFiles;
    payload.images = [{ url: '', key: '' }];

    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images?.map(async image => {
        imgsArray.push({
          file: image,
          path: `images/church/images/${Math.floor(100000 + Math.random() * 900000)}`,
        });
      });

      payload.images = await uploadManyToS3(imgsArray);
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Upload minimum 1 image');
    }
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'Upload minimum 1 image');
  }

  const result = await Church.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create church');
  }
  return result;
};

const getAllChurch = async (query: Record<string, any>) => {
  const { lg, la, maxDistance = 10, ...restQuery } = query;
  const churchModel = new QueryBuilder(
    Church.find({ isDeleted: false }),
    restQuery,
  )
    .search(['churchName', 'description']) // Search by churchName or description
    .filter()
    .paginate()
    .sort()
    .fields();

  if (lg && la) {
    const longitude = parseFloat(lg);
    const latitude = parseFloat(la);
    const maxDistanceInMeters = maxDistance * 1609.34; // Convert miles to meters

    if (isNaN(longitude) || isNaN(latitude)) {
      return {
        success: false,
        message:
          'Invalid coordinates format. Please provide valid longitude and latitude.',
        data: [],
      };
    }

    churchModel.modelQuery = churchModel.modelQuery.find({
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistanceInMeters,
        },
      },
    });
  }
  const churches = await churchModel.modelQuery.exec();

  return {
    success: true,
    message: 'Churches retrieved successfully',
    data: churches,
  };
};

const getAll = async (query: Record<string, any>) => {
  const paginationOptions = pick(query, paginationFields);
  const filters = Object.fromEntries(
    Object.entries(query).filter(
      ([key, value]) =>
        !paginationFields.includes(key) && value != null && value !== '',
    ),
  );

  const { searchTerm, latitude, longitude, ...filtersData } = filters;

  const pipeline: any[] = [];

  if (latitude && longitude) {
    pipeline.push({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        key: 'address',
        maxDistance: parseFloat(5 as unknown as string) * 1609, 
        distanceField: 'dist.calculated',
        spherical: true,
      },
    });
  }

  // Add a match to exclude deleted documents
  pipeline.push({
    $match: {
      isDeleted: false,
    },
  });

  // If searchTerm is provided, add a search condition
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: churchSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      },
    });
  }

  // Add custom filters (filtersData) to the aggregation pipeline
  if (Object.entries(filtersData).length) {
    Object.entries(filtersData).map(([field, value]) => {
      if (/^\[.*?\]$/.test(value)) {
        const match = value.match(/\[(.*?)\]/);
        const queryValue = match ? match[1] : value;
        pipeline.push({
          $match: {
            [field]: { $in: [new Types.ObjectId(queryValue)] },
          },
        });
        delete filtersData[field];
      }
    });

    if (Object.entries(filtersData).length) {
      pipeline.push({
        $match: {
          $and: Object.entries(filtersData).map(([field, value]) => ({
            isDeleted: false,
            [field]: value,
          })),
        },
      });
    }
  }

  // Sorting condition
  const { page, limit, skip, sort } =
    paginationHelper.calculatePagination(paginationOptions);

  if (sort) {
    const sortArray = sort.split(',').map(field => {
      const trimmedField = field.trim();
      if (trimmedField.startsWith('-')) {
        return { [trimmedField.slice(1)]: -1 };
      }
      return { [trimmedField]: 1 };
    });

    pipeline.push({ $sort: Object.assign({}, ...sortArray) });
  }

  pipeline.push({
    $facet: {
      totalData: [{ $count: 'total' }], // Count total documents after filters
      paginatedData: [{ $skip: skip }, { $limit: limit }],
    },
  });

  const [result] = await Church.aggregate(pipeline);

  const total = result?.totalData?.[0]?.total || 0; // Get total count
  const data = result?.paginatedData || []; // Get paginated data

  return {
    data,
    meta: { page, limit, total },
  };
};

const getChurchById = async (id: string) => {
  const result = await Church.find({ administrator: id });
  if (!result) {
    throw new Error('Church not found!');
  }
  return result;
};

const getChurchSopnsor = async (id: string, query: Record<string, any>) => {
  const { date } = query;
  let dateFilter = {};

  if (date) {
    const [day, month, year] = date.split('/');
    if (year && month && day) {
      const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        dateFilter = {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        };
      } else {
        console.log('Invalid Date Conversion:', date);
      }
    }
  }

  const finalQuery = { churchId: id, ...dateFilter, isPaid: true };

  const testData = await Sponsor.find(finalQuery)
    .populate('userId')
    .populate('paymentId');

  const sponsorModel = new QueryBuilder(
    Sponsor.find(finalQuery).populate('userId').populate('paymentId'),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = testData;
  const meta = await sponsorModel.countTotal();

  const totalAmount = data.reduce(
    (acc, sponsor) => acc + (sponsor.amount || 0),
    0,
  );

  return {
    data,
    meta,
    totalAmount,
  };
};

const getSingleById = async (id: any) => {
  const result = await Church.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Church not found');
  }
  return result;
};

const updateChurch = async (
  id: string,
  payload: Partial<IChurch>,
  files: any,
) => {
  const existingChurch = await Church.findById(id);
  if (!existingChurch) {
    throw new AppError(httpStatus.NOT_FOUND, 'Church not found');
  }
  const { deleteKey, ...updateData } = payload;

  const update: any = { ...updateData };

  // Handle regular images
  if (files) {
    const { images } = files as UploadedFiles;

    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images.map(b =>
        imgsArray.push({
          file: b,
          path: `images/church`,
        }),
      );

      payload.images = await uploadManyToS3(imgsArray);
    }
  }

  if (deleteKey && deleteKey.length > 0) {
    const newKey: string[] = [];
    deleteKey.map((key: any) => newKey.push(`images/church${key}`));
    if (newKey?.length > 0) {
      await deleteManyFromS3(newKey);
    }

    await Church.findByIdAndUpdate(id, {
      $pull: { images: { key: { $in: deleteKey } } },
    });
  }

  if (payload?.images && payload.images.length > 0) {
    await Church.findByIdAndUpdate(id, {
      $push: { images: { $each: payload.images } },
    });
  }

  const result = await Church.findByIdAndUpdate(id, update, {
    new: true,
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'church update failed');
  }

  return result;
};

const deleteChurch = async (id: string) => {
  const result = await Church.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete church');
  }
  return result;
};

export const churchService = {
  createChurch,
  getAllChurch,
  getChurchById,
  updateChurch,
  deleteChurch,
  getSingleById,
  getChurchSopnsor,
  getAll,
};
