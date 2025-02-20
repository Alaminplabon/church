import httpStatus from 'http-status';
import { IWork } from './work.interface';

import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { UploadedFiles } from '../../interface/common.interface';
import { uploadManyToS3 } from '../../utils/s3';
import Work from './work.models';

const createWork = async (payload: IWork, files: any): Promise<IWork> => {
  if (files) {
    const { images } = files as UploadedFiles;
    payload.images = [{ url: '', key: '' }];

    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images?.map(async image => {
        imgsArray.push({
          file: image,
          path: `images/work/images/${Math.floor(100000 + Math.random() * 900000)}`,
        });
      });
      console.log('imagearray', imgsArray);

      payload.images = await uploadManyToS3(imgsArray);
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Upload minimum 1 image');
    }
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'Upload minimum 1 image');
  }

  const result = await Work.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create work');
  }
  return result;
};

const getAllWork = async (query: Record<string, any>) => {
  const workModel = new QueryBuilder(
    Work.find({ isDeleted: false }).populate('userId'),
    query,
  )
    .search(['workName', 'description'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await workModel.modelQuery;
  const meta = await workModel.countTotal();

  return {
    data,
    meta,
  };
};

const getWorkById = async (id: string) => {
  const result = await Work.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Work not found!');
  }
  return result;
};

const getWorkByMemberId = async (id: string, query: Record<string, any>) => {
  const workModel = new QueryBuilder(
    Work.find({ userId: id, isDeleted: false }),
    query,
  )
    .search(['title', 'description'])
    .filter()
    .paginate()
    .sort()
    .fields();

  // Apply default sorting if no custom sorting is specified
  if (!query.sort) {
    workModel.modelQuery.sort('-createdAt'); // Default sorting by createdAt (descending)
  }

  const data = await workModel.modelQuery;
  const meta = await workModel.countTotal();

  if (!data.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'Work not found!');
  }

  return {
    data,
    meta,
  };
};

const updateWork = async (id: string, files: any, payload: Partial<IWork>) => {
  if (files) {
    const { images } = files as UploadedFiles;
    if (images?.length) {
      const imgsArray = images.map(image => ({
        file: image,
        path: `images/event/images/${Math.floor(100000 + Math.random() * 900000)}`,
      }));

      // Upload new images to S3
      payload.images = await uploadManyToS3(imgsArray);
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Upload at least one image');
    }
  }
  const result = await Work.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update work');
  }
  return result;
};

const deleteWork = async (id: string) => {
  const result = await Work.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete work');
  }
  return result;
};

export const workService = {
  createWork,
  getAllWork,
  getWorkById,
  updateWork,
  deleteWork,
  getWorkByMemberId,
};
