import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import BookEvent from './bookevent.models';
import { notificationServices } from '../notification/notification.service';
import { modeType } from '../notification/notification.interface';
import Event from '../event/event.models';

const createBookEvent = async (payload: {
  userId: string;
  eventId: string;
}) => {
  // Validate if the user has already booked the event
  const existingBooking = await BookEvent.findOne({
    userId: payload.userId,
    eventId: payload.eventId,
    isDeleted: false,
  });

  if (existingBooking) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Event is already booked by this user',
    );
  }

  const result = await BookEvent.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to book event');
  }

  const event = await Event.findById(payload.eventId);
  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
  }

  // Send notification to the user
  await notificationServices.insertNotificationIntoDb({
    receiver: event.userId,
    message: 'New Event Booking',
    description: `A member has booked the event "${event.title}". You can review the details in the admin panel.`,
    refference: result._id,
    model_type: modeType.BookEvent,
  });

  return result;
};

const getAllBookedEvents = async (query: Record<string, any>) => {
  const bookEventModel = new QueryBuilder(
    BookEvent.find({ isDeleted: false }),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();
  const data = await bookEventModel.modelQuery;
  const meta = await bookEventModel.countTotal();

  return {
    data,
    meta,
  };
};

const getBookedEventById = async (id: string) => {
  const result = await BookEvent.findById(id).populate('userId', 'name email');
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booked event not found');
  }
  return result;
};

const getBookedEventByMemderId = async (
  query: Record<string, any>,
  id: string,
) => {
  const bookEventModel = new QueryBuilder(
    BookEvent.find({ userId: id })
      .populate({
        path: 'eventId',
        // populate: {
        //   path: 'churchId',
        //   model: 'Church',
        // },
      })
      .sort({ createdAt: -1 }),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await bookEventModel.modelQuery;
  const meta = await bookEventModel.countTotal();

  return {
    data,
    meta,
  };
};

const deleteBookedEvent = async (id: string) => {
  const result = await BookEvent.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete booked event');
  }
  return result;
};

const getAllUserByEvents = async (query: Record<string, any>, id: any) => {
  // console.log('test', id);
  const bookEventModel = new QueryBuilder(
    BookEvent.find({ eventId: id }).populate('userId'),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await bookEventModel.modelQuery;
  const meta = await bookEventModel.countTotal();

  return {
    data,
    meta,
  };
};

export const bookEventService = {
  createBookEvent,
  getAllBookedEvents,
  getBookedEventById,
  deleteBookedEvent,
  getBookedEventByMemderId,
  getAllUserByEvents,
};
