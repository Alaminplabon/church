import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { prayerRequestService } from './prayerrequest.service';

const createPrayerRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  req.body.userId = userId;
  const result = await prayerRequestService.createPrayerRequest(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Prayer request created successfully',
    data: result,
  });
});

const getAllPrayerRequests = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await prayerRequestService.getAllPrayerRequests(req.query);
    return res.status(200).json({
      success: true,
      data: result.data,
      noChurchRequests: result.noChurchRequests,
      meta: result.meta,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching prayer requests.',
    });
  }
});

const getPrayerRequestById = catchAsync(async (req: Request, res: Response) => {
  const result = await prayerRequestService.getPrayerRequestById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Prayer request fetched successfully',
    data: result,
  });
});

const getPrayerRequestByMemberId = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    console.log(userId);
    const result = await prayerRequestService.getPrayerRequestByUserId(
      userId,
      req.query,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Prayer request fetched successfully',
      data: result,
    });
  },
);

const getPrayerRequestByChurchId = catchAsync(
  async (req: Request, res: Response) => {
    const result = await prayerRequestService.getPrayerRequestByChurchId(
      req.params.churchId,
      req.query,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Prayer request fetched successfully',
      data: result,
    });
  },
);

const deletePrayerRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await prayerRequestService.deletePrayerRequest(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Prayer request deleted successfully',
    data: result,
  });
});

export const prayerRequestController = {
  createPrayerRequest,
  getAllPrayerRequests,
  getPrayerRequestById,
  deletePrayerRequest,
  getPrayerRequestByMemberId,
  getPrayerRequestByChurchId,
};
