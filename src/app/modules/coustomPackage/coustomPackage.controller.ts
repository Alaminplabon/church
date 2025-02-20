import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { customPackageService } from './coustomPackage.service';

const createCustomPackage = catchAsync(async (req: Request, res: Response) => {
  req.body.userId = req?.user?.userId;
  const result = await customPackageService.createCustomPackage(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Custom package created successfully',
    data: result,
  });
});

const getAllCustomPackages = catchAsync(async (req: Request, res: Response) => {
  const result = await customPackageService.getAllCustomPackages(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All custom packages fetched successfully',
    data: result,
  });
});

const getCustomPackageById = catchAsync(async (req: Request, res: Response) => {
  const result = await customPackageService.getCustomPackageById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Custom package fetched successfully',
    data: result,
  });
});

const updateCustomPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await customPackageService.updateCustomPackage(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Custom package updated successfully',
    data: result,
  });
});

const deleteCustomPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await customPackageService.deleteCustomPackage(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Custom package deleted successfully',
    data: result,
  });
});

export const customPackageController = {
  createCustomPackage,
  getAllCustomPackages,
  getCustomPackageById,
  updateCustomPackage,
  deleteCustomPackage,
};
