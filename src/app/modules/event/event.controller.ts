// Event Controller
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { eventService } from './event.service';
import sendResponse from '../../utils/sendResponse';

const createEvent = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'User not authenticated.',
      data: {},
    });
  }

  const result = await eventService.createEvent(req.body, userId, req.files);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Event created successfully',
    data: result,
  });
});

const getAllChurchEvents = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await eventService.getAllChurchEvents(userId, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All events fetched successfully',
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await eventService.getAllEvents(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All events fetched successfully',
    data: result,
  });
});

const getEventById = catchAsync(async (req: Request, res: Response) => {
  const result = await eventService.getEventById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Event fetched successfully',
    data: result,
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await eventService.updateEvent(
    req.params.id,
    req.body,
    req.files,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Event updated successfully',
    data: result,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await eventService.deleteEvent(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Event deleted successfully',
    data: result,
  });
});

const getEventbyChurchId = catchAsync(async (req: Request, res: Response) => {
  const result = await eventService.getEventbyChurchId(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All Event fetched',
    data: result,
  });
});

export const eventController = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventbyChurchId,
  getAllChurchEvents,
};
