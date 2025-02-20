import httpStatus from 'http-status';

import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import Sponsor from './sponsor.models';
import Payment from '../payments/payments.models';
import mongoose from 'mongoose';
import Church from '../church/church.models';
import { modeType } from '../notification/notification.interface';
import { notificationServices } from '../notification/notification.service';

// const createSponsor = async (payload: {
//   churchId: string;
//   amount: number;
//   userId: string;
// }) => {
//   // Create sponsor with isPaid set to false
//   const sponsor = await Sponsor.create({
//     ...payload,
//     isPaid: false, // Sponsor is unpaid initially
//   });

//   if (!sponsor) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create sponsorship');
//   }

//   return sponsor;
// };

const createSponsor = async (payload: {
  churchId: string;
  amount: number;
  userId: string;
}) => {
  // Create sponsor with isPaid set to false
  const sponsor = await Sponsor.create({
    ...payload,
    isPaid: false, // Sponsor is unpaid initially
  });

  if (!sponsor) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create sponsorship');
  }

  // Find the church and update its balance
  const church = await Church.findById(payload.churchId);
  if (!church) {
    throw new AppError(httpStatus.NOT_FOUND, 'Church not found');
  }

  // Add sponsor amount to church balance
  church.churchBalance += payload.amount;
  await church.save();
  // Send notification for sponsorship creation
  await notificationServices.insertNotificationIntoDb({
    receiver: payload.userId, // Notify the user who created the sponsorship
    message: 'Sponsorship Created Successfully',
    description: `You have successfully created a sponsorship of amount $${payload.amount} for the church ${church.churchName}.`,
    refference: sponsor._id, // Reference the created sponsor
    model_type: modeType.Sponsor,
  });

  return sponsor;
};

const calculateAmountByChurch = async (churchId: string) => {
  const sponsors = await Sponsor.find({ churchId }).populate('paymentId');
  let totalChurchAmount = 0;
  sponsors.forEach(sponsor => {
    totalChurchAmount += sponsor.amount;
  });

  const totalAmount = await Sponsor.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalWithoutChurch = totalAmount[0]?.total || 0;

  const totalExcludingChurch = totalWithoutChurch - totalChurchAmount;

  return {
    totalAmount: totalWithoutChurch,
    churchAmount: totalChurchAmount,
    totalExcludingChurch,
  };
};

const getAllSponsors = async (query: Record<string, any>, id: string) => {
  // console.log('Fetching sponsors for user:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID');
  }

  const sponsorModel = new QueryBuilder(
    Sponsor.find({
      userId: new mongoose.Types.ObjectId(id),
      isDeleted: false,
    })
      .populate('churchId')
      .populate('paymentId'),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await sponsorModel.modelQuery;
  const meta = await sponsorModel.countTotal();

  const sponsorsWithCalculatedAmounts = await Promise.all(
    data.map(async sponsor => {
      let churchAmount = null;

      if (
        sponsor.churchId &&
        mongoose.Types.ObjectId.isValid(sponsor.churchId._id)
      ) {
        churchAmount = await calculateAmountByChurch(
          sponsor.churchId._id.toString(),
        );
      }

      return {
        ...sponsor.toObject(),
        churchAmount,
      };
    }),
  );

  return {
    data: sponsorsWithCalculatedAmounts,
    meta,
  };
};

const getSponsorById = async (id: string) => {
  const sponsor = await Sponsor.findById(id).populate('tranId churchId userId');
  if (!sponsor || sponsor.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sponsorship not found');
  }
  return sponsor;
};

const deleteSponsor = async (id: string) => {
  const sponsor = await Sponsor.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!sponsor) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete sponsorship');
  }
  return sponsor;
};

const confirmPayment = async (paymentConfirmation: {
  tranId: string;
  userId: string;
}) => {
  const payment = await Payment.findOne({ tranId: paymentConfirmation.tranId });
  if (!payment) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment not found');
  }

  if (payment.user.toString() !== paymentConfirmation.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Payment does not belong to the user',
    );
  }

  payment.isPaid = true;
  await payment.save();

  const sponsor = await Sponsor.findOneAndUpdate(
    { tranId: paymentConfirmation.tranId },
    { $set: { isDeleted: false } },
    { new: true },
  );

  return sponsor;
};

const getTotalSpentByUser = async (userId: string) => {
  // Fetch all sponsorship records for the user where the sponsorship is not deleted
  const sponsors = await Sponsor.find({ userId, isDeleted: false });

  // Calculate the total amount spent by summing the `amount` fields
  const totalSpent = sponsors.reduce((acc, sponsor) => acc + sponsor.amount, 0);

  return { totalSpent };
};

const getSponsorsWithChurchId = async (query: Record<string, any>) => {
  const sponsorModel = new QueryBuilder(
    Sponsor.find({
      churchId: { $exists: true, $ne: null }, // Checks if churchId exists and is not null
      isDeleted: false,
    })
      .populate('churchId')
      .populate('userId')
      .populate('paymentId'),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await sponsorModel.modelQuery;
  const meta = await sponsorModel.countTotal();

  return {
    data,
    meta,
  };
};

const getSponsorsWithNoChurch = async (query: Record<string, any>) => {
  const sponsorModel = new QueryBuilder(
    Sponsor.find({
      churchId: { $exists: false }, // Filtering for sponsors with no churchId
      isDeleted: false,
    }).populate('userId'),
    query,
  )
    .search(['userId.name'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await sponsorModel.modelQuery;
  const meta = await sponsorModel.countTotal();

  return {
    data,
    meta,
  };
};

export const sponsorService = {
  createSponsor,
  getAllSponsors,
  getSponsorById,
  deleteSponsor,
  calculateAmountByChurch,
  confirmPayment,
  getTotalSpentByUser,
  getSponsorsWithNoChurch,
  getSponsorsWithChurchId,
};
