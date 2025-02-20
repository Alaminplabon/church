import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import PrayerRequest from './prayerrequest.models';
import { IPrayerRequest } from './prayerrequest.interface';

const createPrayerRequest = async (payload: IPrayerRequest) => {
  const result = await PrayerRequest.create(payload);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create prayer request',
    );
  }
  return result;
};

const getAllPrayerRequests = async (query: Record<string, any>) => {
  const prayerRequestModel = new QueryBuilder(
    PrayerRequest.find({ isDeleted: false })
      .populate('churchId')
      .populate('userId'),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await prayerRequestModel.modelQuery;

  const noChurchRequests = data.filter(
    (prayerRequest: any) => !prayerRequest.churchId,
  );

  const meta = await prayerRequestModel.countTotal();

  return {
    data,
    noChurchRequests,
    meta,
  };
};

const getPrayerRequestById = async (id: string) => {
  const result = await PrayerRequest.findById(id)
    .populate('churchId')
    .populate('userId');
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Prayer request not found');
  }
  return result;
};

const getPrayerRequestByChurchId = async (
  id: string,
  query: Record<string, any>,
) => {
  const prayerRequestModel = new QueryBuilder(
    PrayerRequest.find({ churchId: id })
      .populate('userId')
      .populate('churchId'),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await prayerRequestModel.modelQuery;

  // if (!data || data.length === 0) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'Prayer request not found');
  // }

  const noChurchRequests = data.filter(
    (prayerRequest: any) => !prayerRequest.churchId,
  );

  const meta = await prayerRequestModel.countTotal();

  return {
    data,
    noChurchRequests,
    meta,
  };
};

const getPrayerRequestByUserId = async (
  id: string,
  query: Record<string, any>,
) => {
  const prayerRequestModel = new QueryBuilder(
    PrayerRequest.find({ userId: id, isDeleted: false })
      .populate('userId')
      .populate('churchId'),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await prayerRequestModel.modelQuery;

  // if (!data || data.length === 0) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'Prayer request not found');
  // }

  const noChurchRequests = data.filter(
    (prayerRequest: any) => !prayerRequest.churchId,
  );

  const meta = await prayerRequestModel.countTotal();

  return {
    data,
    noChurchRequests,
    meta,
  };
};

const deletePrayerRequest = async (id: string) => {
  const result = await PrayerRequest.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete prayer request',
    );
  }
  return result;
};

export const prayerRequestService = {
  createPrayerRequest,
  getAllPrayerRequests,
  getPrayerRequestById,
  deletePrayerRequest,
  getPrayerRequestByUserId,
  getPrayerRequestByChurchId,
};
