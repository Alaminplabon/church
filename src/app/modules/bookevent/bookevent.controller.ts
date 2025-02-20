import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { bookEventService } from './bookevent.service';

const createBookEvent = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  req.body.userId = userId;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'User not authenticated.',
      data: {},
    });
  }

  const result = await bookEventService.createBookEvent(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Event booked successfully',
    data: result,
  });
});

const getAllBookedEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await bookEventService.getAllBookedEvents(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All booked events fetched successfully',
    data: result,
  });
});

const getBookedEventById = catchAsync(async (req: Request, res: Response) => {
  const result = await bookEventService.getBookedEventById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booked event fetched successfully',
    data: result,
  });
});

const getBookedEventByMemderId = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const result = await bookEventService.getBookedEventByMemderId(req.query,userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Booked event fetched successfully',
      data: result,
    });
  },
);

const deleteBookedEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await bookEventService.deleteBookedEvent(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booked event deleted successfully',
    data: result,
  });
});

const getAllUserByEvents = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.eventId as any;
  // console.log(eventId);
  const result = await bookEventService.getAllUserByEvents(req.query, eventId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All booked events fetched successfully',
    data: result,
  });
});

export const bookEventController = {
  createBookEvent,
  getAllBookedEvents,
  getBookedEventById,
  deleteBookedEvent,
  getBookedEventByMemderId,
  getAllUserByEvents,
};
