// import { Server as HttpServer } from 'http';
// import { Server, Socket } from 'socket.io';
// import httpStatus from 'http-status';
// import AppError from './app/error/AppError';
// import getUserDetailsFromToken from './app/helpers/getUserDetailsFromToken';
// import { messageService } from './app/modules/messages/messages.service';
// import Message from './app/modules/messages/messages.models';

// const initializeSocketIO = (server: HttpServer) => {
//   const io = new Server(server, {
//     cors: {
//       origin: '*',
//     },
//   });

//   // Online users set
//   const onlineUsers = new Set<string>();

//   io.on('connection', async (socket: Socket) => {
//     console.log('Client connected:', socket?.id);

//     try {
//       const token =
//         socket.handshake.auth?.token || socket.handshake.headers?.token;

//       // Authenticate user
//       const user: any = await getUserDetailsFromToken(token);
//       if (!user) {
//         throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
//       }

//       const userId = user._id.toString();

//       // Add user to online users list
//       socket.join(userId);
//       onlineUsers.add(userId);
//       io.emit('onlineUsers', Array.from(onlineUsers));

//       console.log(`User ${userId} connected.`);

//       // Send message event
//       socket.on('sendMessage', async (data, callback) => {
//         const { receiver, message } = data;

//         try {
//           const result = await messageService.sendMessage(
//             userId,
//             receiver,
//             message,
//           );

//           // Emit the message to the receiver
//           io.to(receiver).emit('message::received', result);

//           // Acknowledge success to the sender
//           callback({ success: true, message: result });
//         } catch (error) {
//           console.error('Error in sendMessage:', error);
//           callback({ success: false, message: 'Message sending failed' });
//         }
//       });

//       // Fetch messages for a specific chat
//       socket.on('getChatById', async (data, callback) => {
//         const { chatId } = data;

//         try {
//           const chat = await messageService.getChatById(chatId, userId);
//           callback({ success: true, chat });
//         } catch (error) {
//           console.error('Error fetching chat:', error);
//           callback({ success: false, message: 'Failed to fetch chat' });
//         }
//       });

//       // Get user's chat list
//       socket.on('getMyChatList', async callback => {
//         try {
//           const chatList = await messageService.getMyChatList(userId);
//           callback({ success: true, chatList });
//         } catch (error) {
//           console.error('Error fetching chat list:', error);
//           callback({ success: false, message: 'Failed to fetch chat list' });
//         }
//       });

//       socket.on('message-page', async (data, callback) => {
//         const { receiverId } = data;
//         if (!receiverId) {
//           return callback({
//             success: false,
//             message: 'receiver id is required',
//           });
//         }
//         const messages = await Message.find({
//           $or: [
//             { sender: receiverId, receiver: user?._id },
//             { sender: user?._id, receiver: receiverId },
//           ],
//         });
//         socket.to(user?._id).emit('messages', messages);
//         callback({ success: true, messages });

//         console.log(messages);
//       });

//       // Update chat list (e.g., edit a message)
//       socket.on('updateChatList', async (data, callback) => {
//         const { messageId, newMessage } = data;

//         try {
//           const updatedMessage = await messageService.updateChatList(
//             messageId,
//             userId,
//             newMessage,
//           );

//           // Emit the updated message to both sender and receiver
//           io.to(updatedMessage.sender.toString()).emit(
//             'message::updated',
//             updatedMessage,
//           );
//           io.to(updatedMessage.receiver.toString()).emit(
//             'message::updated',
//             updatedMessage,
//           );

//           callback({ success: true, message: updatedMessage });
//         } catch (error) {
//           console.error('Error updating chat:', error);
//           callback({ success: false, message: 'Failed to update chat' });
//         }
//       });

//       // Delete a message
//       socket.on('deleteChatList', async (data, callback) => {
//         const { messageId } = data;

//         try {
//           const deletedMessage = await messageService.deleteChatList(
//             messageId,
//             userId,
//           );

//           // Notify both sender and receiver about the deletion
//           io.to(deletedMessage.sender.toString()).emit(
//             'message::deleted',
//             deletedMessage,
//           );
//           io.to(deletedMessage.receiver.toString()).emit(
//             'message::deleted',
//             deletedMessage,
//           );

//           callback({ success: true, message: deletedMessage });
//         } catch (error) {
//           console.error('Error deleting chat:', error);
//           callback({ success: false, message: 'Failed to delete chat' });
//         }
//       });

//       // Mark messages as read
//       socket.on('markMessagesAsRead', async (data, callback) => {
//         const { sender } = data;

//         try {
//           await messageService.markMessagesAsRead(userId, sender);
//           callback({ success: true, message: 'Messages marked as read' });
//         } catch (error) {
//           console.error('Error marking messages as read:', error);
//           callback({
//             success: false,
//             message: 'Failed to mark messages as read',
//           });
//         }
//       });

//       // Search messages
//       socket.on('searchMessages', async (data, callback) => {
//         const { query, chatUserId } = data;

//         try {
//           const messages = await messageService.searchMessages(
//             userId,
//             chatUserId,
//             query,
//           );
//           callback({ success: true, messages });
//         } catch (error) {
//           console.error('Error searching messages:', error);
//           callback({ success: false, message: 'Failed to search messages' });
//         }
//       });

//       // Typing indicator event
//       socket.on('typing', data => {
//         const { receiver } = data;
//         if (receiver) {
//           socket.to(receiver).emit('typing', { sender: userId });
//         }
//       });

//       // Stop typing indicator event
//       socket.on('stopTyping', data => {
//         const { receiver } = data;
//         if (receiver) {
//           socket.to(receiver).emit('stopTyping', { sender: userId });
//         }
//       });

//       // Disconnect event
//       socket.on('disconnect', () => {
//         onlineUsers.delete(userId);
//         io.emit('onlineUsers', Array.from(onlineUsers));
//         console.log(`User ${userId} disconnected.`);
//       });
//     } catch (error) {
//       console.error('Socket connection error:', error);
//       socket.emit('error', { message: 'Authentication failed' });
//     }
//   });

//   return io;
// };

// export default initializeSocketIO;

/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// socketIO.js
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import getUserDetailsFromToken from './app/helpers/getUserDetailsFromToken';
import AppError from './app/error/AppError';
import httpStatus from 'http-status';
import { Schema, Types } from 'mongoose';
import { IUser } from './app/modules/user/user.interface';
import { User } from './app/modules/user/user.models';
import Message from './app/modules/messages/messages.models';
import { chatService } from './app/modules/chat/chat.service';
import { IChat } from './app/modules/chat/chat.interface';
import Chat from './app/modules/chat/chat.models';
import { callbackFn } from './app/utils/CallbackFn';
import * as socket from './socket';

const initializeSocketIO = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  // Online users
  const onlineUser = new Set();

  io.on('connection', async socket => {
    console.log('connected', socket?.id);

    try {
      //----------------------user token get from front end-------------------------//
      const token =
        socket.handshake.auth?.token || socket.handshake.headers?.token;
      //----------------------check Token and return user details-------------------------//
      const user: any = await getUserDetailsFromToken(token);
      if (!user) {
        // io.emit('io-error', {success:false, message:'invalid Token'});
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
      }

      socket.join(user?._id?.toString());

      //----------------------user id set in online array-------------------------//
      onlineUser.add(user?._id?.toString());

      socket.on('check', (data, callback) => {
        console.log(data);

        callbackFn(callback, { success: true });
      });

      //----------------------online array send for front end------------------------//
      io.emit('onlineUser', Array.from(onlineUser));

      //----------------------user details and messages send for front end -->(as need to use)------------------------//
      socket.on('message-page', async (userId, callback) => {
        if (!userId) {
          callbackFn(callback, {
            success: false,
            message: 'userId is required',
          });
        }

        try {
          const receiverDetails: IUser | null = await User.findById(
            userId,
          ).select('_id email role image name');

          if (!receiverDetails) {
            callbackFn(callback, {
              success: false,
              message: 'user is not found!',
            });
            io.emit('io-error', {
              success: false,
              message: 'user is not found!',
            });
          }
          const payload = {
            _id: receiverDetails?._id,
            email: receiverDetails?.email,
            image: receiverDetails?.image,
            role: receiverDetails?.role,
            name: receiverDetails?.name,
          };

          socket.emit('user-details', payload);

          const getPreMessage = await Message.find({
            $or: [
              { sender: user?._id, receiver: userId },
              { sender: userId, receiver: user?._id },
            ],
          }).sort({ updatedAt: 1 });

          socket.emit('message', getPreMessage || []);

          // Notification
          // const allUnReaddMessage = await Message.countDocuments({
          //   receiver: user?._id,
          //   seen: false,
          // });
          // const variable = 'new-notifications::' + user?._id;
          // io.emit(variable, allUnReaddMessage);

          // const allUnReaddMessage2 = await Message.countDocuments({
          //   receiver: userId,
          //   seen: false,
          // });
          // const variable2 = 'new-notifications::' + userId;
          // io.emit(variable2, allUnReaddMessage2);

          //end Notification//
        } catch (error: any) {
          callbackFn(callback, {
            success: false,
            message: error.message,
          });
          io.emit('io-error', { success: false, message: error });
          console.error('Error in message-page event:', error);
        }
      });

      //----------------------chat list------------------------//
      socket.on('my-chat-list', async (data, callback) => {
        try {
          const chatList = await chatService.getMyChatList(user?._id);
          const myChat = 'chat-list::' + user?._id;

          io.emit(myChat, chatList);

          callbackFn(callback, { success: true, message: chatList });
        } catch (error: any) {
          callbackFn(callback, {
            success: false,
            message: error.message,
          });
          io.emit('io-error', { success: false, message: error.message });
        }
      });

      //----------------------seen message-----------------------//
      socket.on('seen', async ({ chatId }, callback) => {
        if (!chatId) {
          callbackFn(callback, {
            success: false,
            message: 'chatId id is required',
          });
          io.emit('io-error', {
            success: false,
            message: 'chatId id is required',
          });
        }

        try {
          const chatList: IChat | null = await Chat.findById(chatId);
          if (!chatList) {
            callbackFn(callback, {
              success: false,
              message: 'chat id is not valid',
            });
            io.emit('io-error', {
              success: false,
              message: 'chat id is not valid',
            });
            throw new AppError(httpStatus.BAD_REQUEST, 'chat id is not valid');
          }

          const messageIdList = await Message.aggregate([
            {
              $match: {
                chat: new Types.ObjectId(chatId),
                seen: false,
                sender: { $ne: new Types.ObjectId(user?._id) },
              },
            },
            { $group: { _id: null, ids: { $push: '$_id' } } },
            { $project: { _id: 0, ids: 1 } },
          ]);
          const unseenMessageIdList =
            messageIdList.length > 0 ? messageIdList[0].ids : [];

          const updateMessages = await Message.updateMany(
            { _id: { $in: unseenMessageIdList } },
            { $set: { seen: true } },
          );

          const user1 = chatList.participants[0];
          const user2 = chatList.participants[1];
          // //----------------------ChatList------------------------//
          const ChatListUser1 = await chatService.getMyChatList(
            user1.toString(),
          );

          const ChatListUser2 = await chatService.getMyChatList(
            user2.toString(),
          );

          const user1Chat = 'chat-list::' + user1;

          const user2Chat = 'chat-list::' + user2;

          const allUnReaddMessage = await Message.countDocuments({
            receiver: user1,
            seen: false,
          });
          const variable = 'new-notifications::' + user1;
          io.emit(variable, allUnReaddMessage);

          const allUnReaddMessage2 = await Message.countDocuments({
            receiver: user2,
            seen: false,
          });
          const variable2 = 'new-notifications::' + user2;
          io.emit(variable2, allUnReaddMessage2);

          const getPreMessage = await Message.find({
            $or: [
              { sender: user1, receiver: user2 },
              { sender: user2, receiver: user1 },
            ],
          }).sort({ updatedAt: 1 });

          socket.emit('message', getPreMessage || []);

          io.emit(user1Chat, ChatListUser1);
          io.emit(user2Chat, ChatListUser2);
        } catch (error: any) {
          callbackFn(callback, {
            success: false,
            message: error.message,
          });
          console.error('Error in seen event:', error);
          socket.emit('error', { message: error.message });
        }
      });
      //----------------------send message-----------------------//
      socket.on('send-message', async (payload, callback) => {
        payload.sender = user?._id;

        const alreadyExists = await Chat.findOne({
          participants: { $all: [payload.sender, payload.receiver] },
        }).populate(['participants']);

        if (!alreadyExists) {
          const chatList = await Chat.create({
            participants: [payload.sender, payload.receiver],
          });

          payload.chat = chatList?._id;
        } else {
          payload.chat = alreadyExists?._id;
        }

        const result = await Message.create(payload);

        if (!result) {
          callbackFn(callback, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: 'Message sent failed',
          });
        }

        const senderMessage = 'new-message::' + result.chat.toString();

        io.emit(senderMessage, result);

        // //----------------------ChatList------------------------//
        const ChatListSender = await chatService.getMyChatList(
          result?.sender.toString(),
        );
        const senderChat = 'chat-list::' + result.sender.toString();
        io.emit(senderChat, ChatListSender);

        const ChatListReceiver = await chatService.getMyChatList(
          result?.receiver.toString(),
        );

        const receiverChat = 'chat-list::' + result.receiver.toString();

        io.emit(receiverChat, ChatListReceiver);

        // Notification
        const allUnReaddMessage = await Message.countDocuments({
          receiver: result.sender,
          seen: false,
        });
        const variable = 'new-notifications::' + result.sender;
        io.emit(variable, allUnReaddMessage);
        const allUnReaddMessage2 = await Message.countDocuments({
          receiver: result.receiver,
          seen: false,
        });
        const variable2 = 'new-notifications::' + result.receiver;
        io.emit(variable2, allUnReaddMessage2);

        //end Notification//
        callbackFn(callback, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Message sent successfully!',
          data: result,
        });
      });

      //-----------------------Typing------------------------//
      socket.on('typing', function (data) {
        const chat = 'typing::' + data.chatId.toString();
        const message = user?.name + ' is typing...';
        socket.emit(chat, { message: message });
      });
      socket.on('stopTyping', function (data) {
        const chat = 'stopTyping::' + data.chatId.toString();
        const message = user?.name + ' is stop typing...';
        socket.emit(chat, { message: message });
      });

      //-----------------------Seen All------------------------//
      socket.on('message-notification', async ({}, callback) => {
        try {
          const allUnReaddMessage = await Message.countDocuments({
            receiver: user?._id,
            seen: false,
          });
          const variable = 'new-notifications::' + user?._id;
          io.emit(variable, allUnReaddMessage);
          callbackFn(callback, { success: true, message: allUnReaddMessage });
        } catch (error) {
          callbackFn(callback, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: 'Failed to retrieve notifications',
          });
        }
      });

      //-----------------------Disconnect------------------------//
      socket.on('disconnect', () => {
        onlineUser.delete(user?._id?.toString());
        io.emit('onlineUser', Array.from(onlineUser));
        console.log('disconnect user ', socket.id);
      });
    } catch (error) {
      console.error('-- socket.io connection error --', error);
    }
  });

  return io;
};

export default initializeSocketIO;
