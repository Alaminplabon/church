import { Types } from 'mongoose';
import codeGenerator from './codeGenerator.models';
import { ICodeGenerator } from './codeGenerator.interface';
import Church from '../church/church.models';

import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.models';
import AppError from '../../error/AppError';
import { notificationServices } from '../notification/notification.service';
import { modeType } from '../notification/notification.interface';

const generateCode = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const createCodes = async (
  userId: string,
  numOfCodes: number,
): Promise<ICodeGenerator[]> => {
  // Fetch the church associated with the user
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    }
    const durationDay = user.durationDay || 0;
    let codeGenetarelimit = user.codeGenetarelimit || 0;

    // If the user has no duration or no limit, deny code generation
    if (durationDay === 0 || codeGenetarelimit === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Your subscription has expired. Please purchase a new subscription to continue generating codes.',
      );
    }
    // Check if the user has enough remaining code generation limit
    if (numOfCodes > codeGenetarelimit) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Not enough code generation limit',
      );
    }
    const church = await Church.findOne({ administrator: userId });

    const churchId = church?._id;
    const codes = [];

    for (let i = 0; i < numOfCodes; i++) {
      const code = generateCode(8); // Generate a 8-character code
      // Ensure the code is unique
      const existingCode = await codeGenerator.findOne({ code });
      if (existingCode) {
        i--; // Retry if the code already exists
        continue;
      }

      const newCode = new codeGenerator({
        code,
        userId: new Types.ObjectId(userId),
        churchId: new Types.ObjectId(churchId),
        isUsed: false,
      });
      await newCode.save();
      codes.push(newCode);
    }

    // **Update the user's codeGenerateLimit**
    codeGenetarelimit -= numOfCodes;
    await User.findByIdAndUpdate(userId, { codeGenetarelimit });

    return codes;
  } catch (error) {
    console.error('Error in createCodes:', error);
    await notificationServices.insertNotificationIntoDb({
      receiver: userId,
      message: 'Code Generation Failed',
      description: `An error occurred while trying to generate ${numOfCodes}`,
      reference: [],
      model_type: modeType.codeGenerator,
    });

    throw error; // Re-throwing to be handled by global error middleware
  }
};

const validateCode = async (code: string): Promise<boolean> => {
  const existingCode = await codeGenerator.findOne({
    code,
    isUsed: false,
  });
  if (existingCode) {
    existingCode.isUsed = true;
    await existingCode.save();
    return true;
  }
  return false;
};

const getAllUser = async (userId: string) => {
  const results = await codeGenerator
    .find({ userId })
    .populate('memberId') // Populating memberId with its 'name'
    .populate('userId', 'name') // Populating userId with 'name'
    .populate('churchId', 'name'); // Populating churchId with 'name'

  const documentsWithMemberId = results.filter(doc => doc.memberId);

  if (documentsWithMemberId.length > 0) {
    return documentsWithMemberId;
  } else {
    return {};
  }
};

const getAllCodes = async (userId: string) => {
  const result = await codeGenerator.find({ userId });
  return result;
};

const getMemberbyChurchId = async (id: string, query: Record<string, any>) => {
  const memberModel = new QueryBuilder(
    codeGenerator.find({ churchId: id, isUsed: true }).populate('memberId'),
    query,
  )
    .search(['memberId.name'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await memberModel.modelQuery;
  const meta = await memberModel.countTotal();

  return {
    data,
    meta,
  };
};

export const codeService = {
  createCodes,
  validateCode,
  getAllUser,
  getAllCodes,
  getMemberbyChurchId,
};
