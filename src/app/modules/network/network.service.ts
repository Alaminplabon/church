import { Types } from 'mongoose';

import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import Network from './network.models';
import Message from '../messages/messages.models';

const sendFriendRequest = async (
  sender: Types.ObjectId,
  receiver: Types.ObjectId,
) => {
  let updateRes = 'pending';
  let response;
  const existingRequest = await Network.findOne({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  });

  if (existingRequest) {
    if (existingRequest?.status === 'rejected') {
      updateRes = 'pending';
      response = await Network.updateOne(
        {
          sender: existingRequest?.sender,
          receiver: existingRequest?.receiver,
        },
        { sender, receiver, status: updateRes },
        { upsert: true },
      );
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Friend request already exists.',
      );
    }
  }

  const request = await Network.updateOne(
    { sender: existingRequest?.sender, receiver: existingRequest?.receiver },
    { sender, receiver, status: updateRes },
    { upsert: true },
  );
  return request;
};

const acceptFriendRequest = async (
  sender: string,
  receiver: Types.ObjectId,
) => {
  const request = await Network.findOneAndUpdate(
    { sender, receiver, status: 'pending' },
    { status: 'accepted' },
    { new: true },
  );

  if (!request) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Friend request not found or already processed.',
    );
  }

  return request;
};

const rejectFriendRequest = async (
  sender: string,
  receiver: Types.ObjectId,
) => {
  const request = await Network.findOneAndUpdate(
    { sender, receiver, status: 'pending' },
    { status: 'rejected' },
    { new: true },
  );

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, 'Friend request not found.');
  }

  return request;
};

// const sendMessage = async (
//   sender: Types.ObjectId,
//   receiver: Types.ObjectId,
//   message: string,
// ) => {
//   const connection = await Network.findOne({
//     $or: [
//       { sender, receiver, status: 'accepted' },
//       { sender: receiver, receiver: sender, status: 'accepted' },
//     ],
//   });

//   if (!connection) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'You must be friends to send a message.',
//     );
//   }

//   const msg = await Message.create({ sender, receiver, message });
//   connection.messages.push(msg._id);
//   await connection.save();

//   return msg;
// };

const getSentRequests = async (userId: Types.ObjectId) => {
  const requests = await Network.find({ sender: userId })
    .populate('sender')
    .populate('receiver');
  return requests;
};

const getPendingRequests = async (userId: Types.ObjectId) => {
  const requests = await Network.find({
    receiver: userId,
    status: 'pending',
  })
    .populate('sender')
    .populate('receiver');
  return requests;
};

const getFriendsList = async (userId: Types.ObjectId) => {
  const friends = await Network.find({
    $or: [
      { sender: userId, status: 'accepted' },
      { receiver: userId, status: 'accepted' },
    ],
  })
    .populate('sender', '-password -email') // Exclude sensitive details
    .populate('receiver', '-password -email');

  // Return only the list of friends
  return friends.map(friend => {
    return friend.sender._id.equals(userId) ? friend.receiver : friend.sender;
  });
};

const cancelFriendRequest = async (
  sender: Types.ObjectId,
  receiver: string,
) => {
  const request = await Network.findOneAndDelete({
    sender,
    receiver,
    status: 'pending',
  });

  if (!request) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Friend request not found or already processed.',
    );
  }

  return request;
};

export const networkService = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  // sendMessage,
  getSentRequests,
  getPendingRequests,
  getFriendsList,
  cancelFriendRequest,
};
