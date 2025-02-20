import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { codeService } from './codeGenerator.service';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';

const createCodes = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming `userId` is added to the request object after authentication
  const { numOfCodes } = req.body;
  if (!userId || !numOfCodes || numOfCodes <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid');
  }
  const codes = await codeService.createCodes(userId, numOfCodes);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: `${numOfCodes} codes generated successfully`,
    data: codes,
  });
});

const validateCode = async (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Invalid input',
      data: {},
    });
  }

  const isValid = await codeService.validateCode(code);

  if (isValid) {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Code validated successfully',
      data: {},
    });
  } else {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Invalid or already used code',
      data: {},
    });
  }
};

const getAllCodes = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await codeService.getAllCodes(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All codes fetched',
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await codeService.getAllUser(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All user fetched',
    data: result,
  });
});

const getMemberbyChurchId = catchAsync(async (req: Request, res: Response) => {
  const result = await codeService.getMemberbyChurchId(
    req.params.id,
    req.query,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All user fetched',
    data: result.data,
    meta: result.meta,
  });
});

export const codeController = {
  createCodes,
  validateCode,
  getAllUser,
  getAllCodes,
  getMemberbyChurchId,
};
