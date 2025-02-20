import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { activityService } from './activity.service';

const createActivity = catchAsync(async (req: Request, res: Response) => {
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

  const result = await activityService.createActivity(req.body, req.files);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Activity created successfully',
    data: result,
  });
});

const getAllActivities = catchAsync(async (req: Request, res: Response) => {
  const result = await activityService.getAllActivities(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All activities fetched successfully',
    data: result,
  });
});

const getActivityById = catchAsync(async (req: Request, res: Response) => {
  const result = await activityService.getActivityById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Activity fetched successfully',
    data: result,
  });
});

const updateActivity = catchAsync(async (req: Request, res: Response) => {
  const result = await activityService.updateActivity(
    req.params.id,
    req.files,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Activity updated successfully',
    data: result,
  });
});

const deleteActivity = catchAsync(async (req: Request, res: Response) => {
  const result = await activityService.deleteActivity(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Activity deleted successfully',
    data: result,
  });
});

const getActivitiesByMemberId = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const result = await activityService.getActivitiesByMemberId(
      userId,
      req.query,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Activities fetched successfully',
      data: result,
    });
  },
);

const getByMemberId = catchAsync(async (req: Request, res: Response) => {
  const result = await activityService.getActivitiesByMemberId(
    req.params.id,
    req.query,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Activities fetched successfully',
    data: result,
  });
});

export const activityController = {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getActivitiesByMemberId,
  getByMemberId,
};
