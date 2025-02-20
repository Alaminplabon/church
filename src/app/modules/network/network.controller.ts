import { Request, Response } from 'express';
import { networkService } from './network.service';
import sendResponse from '../../utils/sendResponse';
// import catchAsync from '../../utils/catchAsync';
import catchAsync from '../../utils/catchAsync';

const sendFriendRequest = catchAsync(async (req: Request, res: Response) => {
  const { receiver } = req.body;
  const sender = req.user?.userId;

  if (!sender) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'User not authenticated',
      data: {},
    });
  }

  const result = await networkService.sendFriendRequest(sender, receiver);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Friend request sent',
    data: result,
  });
});

const acceptFriendRequest = catchAsync(async (req: Request, res: Response) => {
  const sender = req.params.sender;
  const receiver = req.user?.userId;

  if (!receiver) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'User not authenticated',
      data: {},
    });
  }

  const result = await networkService.acceptFriendRequest(sender, receiver);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Friend request accepted',
    data: result,
  });
});

const rejectFriendRequest = catchAsync(async (req: Request, res: Response) => {
  const sender = req.params.sender;
  const receiver = req.user?.userId;

  if (!receiver) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'User not authenticated',
      data: {},
    });
  }

  const result = await networkService.rejectFriendRequest(sender, receiver);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Friend request rejected',
    data: result,
  });
});

// const sendMessage = async (req: Request, res: Response) => {
//   const { receiver, message } = req.body;
//   const sender = req.user?.userId;

//   if (!sender) {
//     return sendResponse(res, {
//       statusCode: 400,
//       success: false,
//       message: 'User not authenticated',
//       data: {},
//     });
//   }

//   const result = await networkService.sendMessage(sender, receiver, message);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Message sent',
//     data: result,
//   });
// };

const getSentRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await networkService.getSentRequests(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Sent requests fetched',
    data: result,
  });
});

const getPendingRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await networkService.getPendingRequests(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pending requests fetched',
    data: result,
  });
});

const getFriendsList = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await networkService.getFriendsList(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Friends list fetched',
    data: result,
  });
};

const cancelFriendRequest = catchAsync(async (req: Request, res: Response) => {
  const receiver = req.params.receiver;
  const sender = req.user?.userId;

  if (!sender) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'User not authenticated',
      data: {},
    });
  }

  const result = await networkService.cancelFriendRequest(sender, receiver);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Friend request canceled',
    data: result,
  });
});

export const networkController = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  // sendMessage,
  getSentRequests,
  getPendingRequests,
  getFriendsList,
  cancelFriendRequest,
};
