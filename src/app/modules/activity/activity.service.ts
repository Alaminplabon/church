import httpStatus from 'http-status';
import { IActivity } from './activity.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { UploadedFiles } from '../../interface/common.interface';
import { uploadManyToS3 } from '../../utils/s3';
import Activity from './activity.models';

const createActivity = async (
  payload: IActivity,
  files: any,
): Promise<IActivity> => {
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

  const result = await Activity.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create activity');
  }
  return result;
};

const getAllActivities = async (query: Record<string, any>) => {
  const activityModel = new QueryBuilder(
    Activity.find({ isDeleted: false }),
    query,
  )
    .search(['title', 'description'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await activityModel.modelQuery;
  const meta = await activityModel.countTotal();

  return {
    data,
    meta,
  };
};

const getActivityById = async (id: string) => {
  const result = await Activity.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Activity not found!');
  }
  return result;
};

const updateActivity = async (
  id: string,
  files: any,
  payload: Partial<IActivity>,
) => {
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
  const result = await Activity.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update activity');
  }
  return result;
};

const deleteActivity = async (id: string) => {
  const result = await Activity.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete activity');
  }
  return result;
};

const getActivitiesByMemberId = async (
  id: string,
  query: Record<string, any>,
) => {
  const activityModel = new QueryBuilder(
    Activity.find({ userId: id, isDeleted: false }),
    query,
  )
    .search(['title', 'description'])
    .filter()
    .paginate()
    .sort()
    .fields();

  // Apply default sorting if no custom sorting is specified
  if (!query.sort) {
    activityModel.modelQuery.sort('-createdAt'); // Default sorting by createdAt (descending)
  }

  const data = await activityModel.modelQuery;
  const meta = await activityModel.countTotal();

  if (!data.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'Work not found!');
  }

  return {
    data,
    meta,
  };
};

export const activityService = {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getActivitiesByMemberId,
};
