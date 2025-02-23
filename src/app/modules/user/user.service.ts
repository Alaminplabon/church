/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { IUser } from './user.interface';
import { User } from './user.models';
import QueryBuilder from '../../builder/QueryBuilder';
import codeGenerator from '../codeGenerator/codeGenerator.models';
import Church from '../church/church.models';
import { notificationServices } from '../notification/notification.service';
import { Types } from 'mongoose';
import { modeType } from '../notification/notification.interface';
import { ChecksumAlgorithm } from '@aws-sdk/client-s3';
export type IFilter = {
  searchTerm?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
const createUser = async (payload: IUser) => {
  // Check if user with the given email already exists
  const isExist = await User.isUserExist(payload.email as string);

  if (isExist) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User already exists with this email',
    );
  }

  // let user: IUser | null = null; // Declare user before using it

  if (payload.role === 'member') {
    if (!payload.registrationCode) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Registration code is required for members',
      );
    }

    // Find the registration code entry that is not yet used
    const codeEntry = await codeGenerator.findOne({
      code: payload.registrationCode,
      isUsed: false, // Ensure the code hasn't been used yet
    });

    if (!codeEntry) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid or used registration code',
      );
    }

    // Create the user if the code is valid
    const user = await User.create({
      ...payload,
      churchId: codeEntry.churchId, // Save churchId if it exists, otherwise save null
    });
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
    }

    codeEntry.memberId = user._id as any;
    codeEntry.isUsed = true;
    await codeEntry.save();

    const church = await Church.findById(codeEntry.churchId); // Fetch church using churchId from codeGenerator
    if (!church) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Church not found');
    }
    church.memberCount += 1;
    await church.save();

    // Send notification to the user who generated the code
    await sendNotificationToUser(codeEntry.userId, user);
    return user;
  }

  const user = await User.create(payload);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
  }
  // Send notification to admins when a new administrator is created
  if (payload.role === 'administrator') {
    await sendNotificationToAdmins(user);
    console.log('==================', user);
  }
  return user;

  // Function to send notification to userId (the one who generated the registration code)
  async function sendNotificationToUser(userId: any, member: IUser) {
    await notificationServices.insertNotificationIntoDb({
      receiver: userId,
      message: `A new member, ${member.name}, has joined using your registration code!`,
      description: `User ${member.name} has successfully registered.`,
      refference: member._id,
      model_type: modeType.User,
    });
  }

  // Function to send notification to all administrators
  async function sendNotificationToAdmins(admin: IUser) {
    console.log('new', admin);
    const admins = await User.find({ role: 'admin' }); // Fetch all admins
    for (const adminUser of admins) {
      await notificationServices.insertNotificationIntoDb({
        receiver: adminUser._id,
        message: `A new administrator, ${admin.name}, has been created!`,
        description: `User ${admin.name} has been added as an administrator.`,
        refference: admin._id,
        model_type: modeType.User,
      });
    }
  }
};

const getAllUser = async (query: Record<string, any>) => {
  const userModel = new QueryBuilder(User.find({ isDeleted: false }), query)
    .search(['name', 'email', 'phoneNumber', 'status'])
    .filter()
    .paginate()
    .sort();
  const data: any = await userModel.modelQuery;
  const meta = await userModel.countTotal();
  return {
    data,
    meta,
  };
};

const geUserById = async (id: string) => {
  const result = await User.findById(id).populate('churchId');
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const getAllUserByYearandmonth = async (year: string) => {
  const startOfYear = new Date(`${year}-01-01`);
  const endOfYear = new Date(`${year}-12-31T23:59:59`);

  // Initialize an object to hold counts for each month
  const userCountsByMonth: Record<string, number> = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };
  await User.countDocuments({ isDeleted: false });
  // Query to get all users within the year
  const users = await User.find({
    createdAt: {
      $gte: startOfYear,
      $lte: endOfYear,
    },
  });

  // Loop through the users and count them by month
  users.forEach(user => {
    const month = new Date(user.createdAt as Date).toLocaleString('default', {
      month: 'long',
    });
    if (userCountsByMonth[month] !== undefined) {
      userCountsByMonth[month]++;
    }
  });

  return userCountsByMonth;
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  // Check if the user exists
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  // Update the user
  const updatedUser = await User.findByIdAndUpdate(id, payload, {
    new: true, // Return the updated document
    runValidators: true, // Apply schema validation
  });

  if (!updatedUser) {
    return 'user not updates available';
  }

  // Remove the password from the response
  (updatedUser.password as any) = undefined;

  return updatedUser;
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user deleting failed');
  }

  return user;
};

export const userService = {
  createUser,
  getAllUser,
  geUserById,
  updateUser,
  deleteUser,
  getAllUserByYearandmonth,
};
