import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { workService } from './work.service';

const createWork = catchAsync(async (req: Request, res: Response) => {
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

  const result = await workService.createWork(req.body, req.files);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Work created successfully',
    data: result,
  });
});

const getAllWork = catchAsync(async (req: Request, res: Response) => {
  const result = await workService.getAllWork(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All works fetched successfully',
    data: result,
  });
});

const getWorkById = catchAsync(async (req: Request, res: Response) => {
  const result = await workService.getWorkById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Work fetched successfully',
    data: result,
  });
});

const getMyWorkById = catchAsync(async (req: Request, res: Response) => {
  const result = await workService.getWorkByMemberId(req.params.id, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Work fetched successfully',
    data: result,
  });
});

const updateWork = catchAsync(async (req: Request, res: Response) => {
  const result = await workService.updateWork(
    req.params.id,
    req.files,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Work updated successfully',
    data: result,
  });
});

const deleteWork = catchAsync(async (req: Request, res: Response) => {
  const result = await workService.deleteWork(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Work deleted successfully',
    data: result,
  });
});

const getWorkByMemberId = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await workService.getWorkByMemberId(userId, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Work fetched successfully',
    data: result,
  });
});

export const workController = {
  createWork,
  getAllWork,
  getWorkById,
  updateWork,
  deleteWork,
  getWorkByMemberId,
  getMyWorkById,
};
