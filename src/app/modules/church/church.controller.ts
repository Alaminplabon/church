import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { churchService } from './church.service';
import sendResponse from '../../utils/sendResponse';

const createChurch = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  req.body.administrator = userId;
  if (!userId) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'User not authenticated.',
      data: {},
    });
  }

  const result = await churchService.createChurch(req.body, req.files);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Church created successfully',
    data: result,
  });
});

const getAllChurch = catchAsync(async (req: Request, res: Response) => {
  const result = await churchService.getAll(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All church fetched successfully',
    data: result,
  });
});


// const getAllChurch = catchAsync(async (req: Request, res: Response) => {
//   const result = await churchService.getAllChurch(req.query);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'All church fetched successfully',
//     data: result,
//   });
// });

const getChurchById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await churchService.getChurchById(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Church fetched successfully',
    data: result,
  });
});

const getChurchSponsor = catchAsync(async (req: Request, res: Response) => {
  const churchId = req.params.id;
  const result = await churchService.getChurchSopnsor(churchId, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Church fetched successfully',
    data: result,
  });
});

const getSingleChurch = catchAsync(async (req: Request, res: Response) => {
  const result = await churchService.getSingleById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Church fetched successfully',
    data: result,
  });
});

const updateChurch = catchAsync(async (req: Request, res: Response) => {
  const result = await churchService.updateChurch(
    req.params.id,
    req.body,
    req.files,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Church updated successfully',
    data: result,
  });
});

const deleteChurch = catchAsync(async (req: Request, res: Response) => {
  const result = await churchService.deleteChurch(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Church deleted successfully',
    data: result,
  });
});

export const churchController = {
  createChurch,
  getAllChurch,
  getChurchById,
  updateChurch,
  deleteChurch,
  getSingleChurch,
  getChurchSponsor,
};
