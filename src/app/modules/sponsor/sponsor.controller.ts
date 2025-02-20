import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { sponsorService } from './sponsor.service';

const createSponsor = catchAsync(async (req: Request, res: Response) => {
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

  const result = await sponsorService.createSponsor(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Sponsorship created successfully',
    data: result,
  });
});

const getAllSponsors = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'User not authenticated.',
      data: {},
    });
  }
  const result = await sponsorService.getAllSponsors(req.query, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All sponsorships fetched successfully',
    data: result,
  });
});

const getSponsorById = catchAsync(async (req: Request, res: Response) => {
  const result = await sponsorService.getSponsorById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Sponsorship fetched successfully',
    data: result,
  });
});

const deleteSponsor = catchAsync(async (req: Request, res: Response) => {
  const result = await sponsorService.deleteSponsor(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Sponsorship deleted successfully',
    data: result,
  });
});

const calculateSponsorAmount = catchAsync(
  async (req: Request, res: Response) => {
    const churchId = req.params.churchId;
    const result = await sponsorService.calculateAmountByChurch(churchId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Amount calculated successfully',
      data: result,
    });
  },
);

const getTotalSpent = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming the userId is available in the request via token

  if (!userId) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'User not authenticated.',
      data: {},
    });
  }

  // Call the service method to calculate the total amount spent
  const result = await sponsorService.getTotalSpentByUser(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Total amount spent fetched successfully',
    data: result,
  });
});

const confirmSponsorPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { tranId, userId } = req.body;
    const result = await sponsorService.confirmPayment({ tranId, userId });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Payment confirmed successfully',
      data: result,
    });
  },
);

const getSponsorsWithNoChurch = catchAsync(
  async (req: Request, res: Response) => {
    const result = await sponsorService.getSponsorsWithNoChurch(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All sponsorships fetched successfully',
      data: result,
    });
  },
);
const getSponsorsWithChurchId = catchAsync(
  async (req: Request, res: Response) => {
    const result = await sponsorService.getSponsorsWithChurchId(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All sponsorships fetched successfully',
      data: result,
    });
  },
);

export const sponsorController = {
  createSponsor,
  getAllSponsors,
  getSponsorById,
  deleteSponsor,
  calculateSponsorAmount,
  confirmSponsorPayment,
  getTotalSpent,
  getSponsorsWithChurchId,
  getSponsorsWithNoChurch,
};
