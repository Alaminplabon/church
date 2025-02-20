// Event Service
import httpStatus from 'http-status';
import { IEvent } from './event.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import Event from './event.models';
import { UploadedFiles } from '../../interface/common.interface';
import { uploadManyToS3 } from '../../utils/s3';
import { eventController } from './event.controller';
import Church from '../church/church.models';
import { notificationServices } from '../notification/notification.service';
import { modeType } from '../notification/notification.interface';
import codeGenerator from '../codeGenerator/codeGenerator.models';

const createEvent = async (payload: IEvent, userId: string, files: any) => {
  const church = await Church.findOne({ administrator: userId });
  if (!church) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Church not found for the given user',
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
          path: `images/event/images/${Math.floor(100000 + Math.random() * 900000)}`,
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
  payload.churchId = church._id;
  const result = await Event.create({ ...payload, userId });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create event');
  }
  console.log(result._id);
  // return result;
  const tests = await codeGenerator.find({ userId: userId });
  const memberIds = tests
    .filter(test => test?.memberId !== undefined)
    ?.map(test => test.memberId);

  async function sendNotification(memberId: any) {
    await notificationServices.insertNotificationIntoDb({
      receiver: memberId,
      message: 'Test 2!',
      description: `User ${userId} has successfully created an event titled "${payload.title}".`,
      refference: result._id,
      model_type: modeType.Event,
    });
  }
  memberIds.forEach(memberId => {
    sendNotification(memberId);
  });

  return result;
};

const getAllChurchEvents = async (
  userId: string,
  query: Record<string, any>,
) => {
  const eventModel = new QueryBuilder(
    Event.find({ userId, isDeleted: false }),
    query,
  )
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await eventModel.modelQuery;
  const meta = await eventModel.countTotal();

  return {
    data,
    meta,
  };
};

const getAllEvents = async (query: Record<string, any>) => {
  const eventModel = new QueryBuilder(Event.find({ isDeleted: false }), query)
    .search(['title', 'location'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await eventModel.modelQuery;
  const meta = await eventModel.countTotal();

  return {
    data,
    meta,
  };
};

const getEventById = async (id: string) => {
  const result = await Event.findById(id);
  if (!result || result.isDeleted) {
    throw new Error('Event not found!');
  }
  return result;
};

const updateEvent = async (
  id: string,
  payload: Partial<IEvent>,
  files: any,
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
  const result = await Event.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Failed to update event');
  }
  return result;
};

const deleteEvent = async (id: string) => {
  const result = await Event.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete event');
  }
  return result;
};

const getEventbyChurchId = async (id: string) => {
  const result = await Event.find({ churchId: id });
  return result;
};

export const eventService = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventbyChurchId,
  getAllChurchEvents,
};
