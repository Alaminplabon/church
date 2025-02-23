import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { paymentsService } from './payments.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../error/AppError';

const checkout = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user?.userId;
  const result = await paymentsService.checkout(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'payment link get successful',
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.confirmPayment(req?.query);
  if (!result?.subscription && !result?.sponsorId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No valid subscription or sponsor found for payment confirmation',
    );
  }

  let subscriptionredirectUrl = `${config.success_url}?paymentId=${result?._id}`;
  let sponsorredirectUrl = `${config.success_sponsor_url}?paymentId=${result?._id}`;

  if (result?.subscription) {
    subscriptionredirectUrl += `&subscriptionId=${result.subscription}`;
    res.redirect(subscriptionredirectUrl);
  }

  if (result?.sponsorId) {
    sponsorredirectUrl += `&sponsorId=${result.sponsorId}`;
    res.redirect(sponsorredirectUrl);
  }
});

const dashboardData = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.dashboardData(req?.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'dashboard data successful',
  });
});
const getEarnings = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.getEarnings();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'earnings data successful',
  });
});

export const paymentsController = {
  confirmPayment,
  checkout,
  dashboardData,
  getEarnings,
};
