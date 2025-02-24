import Stripe from 'stripe';
import config from '../../config';
import { IPayment } from './payments.interface';
import { ISubscriptions } from '../subscription/subscription.interface';
import Subscription from '../subscription/subscription.models';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import Payment from './payments.models';
import { User } from '../user/user.models';
import { createCheckoutSession } from './payments.utils';
import { now, startSession, Types } from 'mongoose';
import { IPackage } from '../packages/packages.interface';
import { notificationServices } from '../notification/notification.service';
import { modeType } from '../notification/notification.interface';
import { USER_ROLE } from '../user/user.constants';
import moment from 'moment';
import { IUser } from '../user/user.interface';
import { Notification } from '../notification/notification.model';
import { subscribe } from 'diagnostics_channel';
import Package from '../packages/packages.models';
import generateRandomString from '../../utils/generateRandomString';
import Sponsor from '../sponsor/sponsor.models';

const stripe = new Stripe(config.stripe?.stripe_api_secret as string, {
  apiVersion: '2024-06-20',
  typescript: true,
});

const checkout = async (payload: IPayment) => {
  const tranId = generateRandomString(10);
  let paymentData: IPayment;

  const subscription = await Subscription.findById(
    payload?.subscription,
  ).populate('package');

  const isExistPayment: IPayment | null = await Payment.findOne({
    subscription: payload?.subscription,
    sponsorId: payload?.sponsorId,
    isPaid: false,
    user: payload?.user,
  });

  const user = await User.findById(payload.user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found!');
  }

  const isAdmin = user.role === USER_ROLE.administrator;

  if (isAdmin && payload.subscription) {
    const subscription = await Subscription.findOne({
      user: payload?.user,
    }).populate('package');

    if (!subscription) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Administrator must have an active subscription!',
      );
    }

    const subscriptionWithId = subscription as ISubscriptions & { _id: any };

    const isExistPayment: IPayment | null = await Payment.findOne({
      subscription: subscriptionWithId._id,
      isPaid: false,
      user: payload?.user,
    });

    if (isExistPayment) {
      const payment = await Payment.findByIdAndUpdate(
        isExistPayment?._id,
        { tranId },
        { new: true },
      );

      paymentData = payment as IPayment;
    } else {
      payload.tranId = tranId;
      payload.amount = subscription?.amount;
      payload.subscription = subscriptionWithId._id;

      const createdPayment = await Payment.create(payload);

      if (!createdPayment) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Failed to create payment',
        );
      }
      paymentData = createdPayment;
    }
  } else {
    payload.tranId = tranId;

    if (payload.sponsorId) {
      const sponsor = await Sponsor.findById(payload.sponsorId);
      if (!sponsor) {
        throw new AppError(httpStatus.NOT_FOUND, 'Sponsor not found');
      }

      payload.amount = sponsor.amount;

      const createdPayment = await Payment.create(payload);

      if (!createdPayment) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Failed to create payment',
        );
      }

      paymentData = createdPayment;

      (sponsor.paymentId as any) = paymentData._id;
      sponsor.isPaid = true;
      await sponsor.save();
    } else {
      const createdPayment = await Payment.create(payload);

      if (!createdPayment) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Failed to create payment',
        );
      }

      paymentData = createdPayment;
    }
  }

  if (!paymentData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment not found');
  }
  const checkoutSession = await createCheckoutSession({
    product: {
      amount: paymentData?.amount,
      name: paymentData?.tranId,
      quantity: 1,
    },
    //@ts-ignore
    paymentId: paymentData?._id,
  });

  return checkoutSession?.url;
};

const confirmPayment = async (query: Record<string, any>) => {
  const { sessionId, paymentId } = query;
  console.log('testtttttttt', query);
  const session = await startSession();
  const PaymentSession = await stripe.checkout.sessions.retrieve(sessionId);
  const paymentIntentId = PaymentSession.payment_intent as string;

  if (PaymentSession.status !== 'complete') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment session is not completed',
    );
  }

  try {
    session.startTransaction();

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { isPaid: true, paymentIntentId: paymentIntentId },
      { new: true, session },
    ).populate('user');

    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found!');
    }

    const oldSubscription = await Subscription.findOneAndUpdate(
      {
        user: payment?.user,
        isPaid: true,
        isExpired: false,
      },
      {
        isExpired: true,
      },
      { upsert: false, session },
    );

    const subscription: ISubscriptions | null = await Subscription.findById(
      payment?.subscription,
    )
      .populate('package')
      .session(session);

    let expiredAt = moment();

    if (
      oldSubscription?.expiredAt &&
      moment(oldSubscription.expiredAt).isAfter(moment())
    ) {
      const remainingTime = moment(oldSubscription.expiredAt).diff(moment());
      expiredAt = moment().add(remainingTime, 'milliseconds');
    }

    if (subscription?.durationType) {
      const durationDay =
        subscription.durationType === 'monthly'
          ? 30
          : subscription.durationType === 'yearly'
            ? 365
            : 0;
      expiredAt = expiredAt.add(durationDay, 'days');
    }

    await Subscription.findByIdAndUpdate(
      payment?.subscription,
      {
        isPaid: true,
        trnId: payment?.tranId,
        expiredAt: expiredAt.toDate(),
      },
      { session },
    ).populate('package');

    const user = await User.findById(payment?.user).session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    const packageDetails = subscription?.package as IPackage;
    const newUser: any = {};
    if (packageDetails) {
      newUser['codeGenetarelimit'] =
        (user.codeGenetarelimit || 0) + (packageDetails.codeGenetarelimit || 0);
      // Update user with the codeGenetarelimit from the package

      // Determine the duration in days based on the subscription's durationType
      let additionalDays = 0;
      if (subscription?.durationType === 'monthly') {
        additionalDays = 30;
      } else if (subscription?.durationType === 'yearly') {
        additionalDays = 365;
      }

      // Update the user's durationDay with the additional days based on the subscription durationType
      newUser['durationDay'] = user.durationDay + additionalDays;

      // Save the updated user document
      await User.findByIdAndUpdate(user?._id, newUser, {
        timestamps: false,
        session,
      });
    }

    await Package.findByIdAndUpdate(
      packageDetails?._id,
      { $inc: { popularity: 1 } },
      { upsert: false, new: true, session },
    );

    const admin = await User.findOne({ role: USER_ROLE.admin });
    const subs = await Payment.findOne({ paymentId: payment._id });
    if (subs?.subscription) {
      await notificationServices.insertNotificationIntoDb({
        receiver: admin?._id,
        message: 'A new subscription payment has been made.',
        description: `User ${(payment.user as IUser)?.email} has successfully made a payment for their subscription. Payment ID: ${payment._id}.`,
        refference: payment?._id,
        model_type: modeType?.Payment,
      });
    } else {
      await notificationServices.insertNotificationIntoDb({
        receiver: admin?._id,
        message: 'A new sponsor payment has been made.',
        description: `User ${(payment.user as IUser)?.email} has successfully made a payment for their sponsor. Payment ID: ${payment._id}.`,
        refference: payment?._id,
        model_type: modeType?.Payment,
      });
    }
    await session.commitTransaction();
    return payment;
  } catch (error: any) {
    await session.abortTransaction();

    if (paymentIntentId) {
      try {
        await stripe.refunds.create({ payment_intent: paymentIntentId });
      } catch (refundError: any) {
        console.error('Error processing refund:', refundError.message);
      }
    }

    throw new AppError(httpStatus.BAD_GATEWAY, error.message);
  } finally {
    session.endSession();
  }
};

const getEarnings = async () => {
  const today = moment().startOf('day');

  const earnings = await Payment.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $facet: {
        totalEarnings: [
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
            },
          },
        ],
        todayEarnings: [
          {
            $match: {
              isDeleted: false,
              createdAt: {
                $gte: today.toDate(),
                $lte: today.endOf('day').toDate(),
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }, // Sum of today's earnings
            },
          },
        ],
        allData: [
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'userDetails',
            },
          },
          {
            $lookup: {
              from: 'subscriptions',
              localField: 'subscription',
              foreignField: '_id',
              as: 'subscriptionDetails',
            },
          },
          {
            $unwind: {
              path: '$subscriptionDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'packages', // Name of the package collection
              localField: 'subscriptionDetails.package', // Field in the subscription referring to package
              foreignField: '_id', // Field in the package collection
              as: 'packageDetails',
            },
          },
          {
            $project: {
              user: { $arrayElemAt: ['$userDetails', 0] }, // Extract first user if multiple exist
              subscription: '$subscriptionDetails', // Already an object, no need for $arrayElemAt
              package: { $arrayElemAt: ['$packageDetails', 0] }, // Extract first package
              amount: 1,
              tranId: 1,
              status: 1,
              isPaid: 1,
              id: 1,
              _id: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
        ],
      },
    },
  ]);

  const totalEarnings =
    (earnings?.length > 0 &&
      earnings[0]?.totalEarnings?.length > 0 &&
      earnings[0]?.totalEarnings[0]?.total) ||
    0;
  const todayEarnings =
    (earnings?.length > 0 &&
      earnings[0]?.todayEarnings?.length > 0 &&
      earnings[0]?.todayEarnings[0]?.total) ||
    0;

  const allData = earnings[0]?.allData || [];

  return { totalEarnings, todayEarnings, allData };
};

const dashboardData = async (query: Record<string, any>) => {
  const usersData = await User.aggregate([
    {
      $facet: {
        totalUsers: [
          { $match: { 'verification.status': true } },
          { $count: 'count' },
        ],
        userDetails: [
          { $match: { role: { $ne: USER_ROLE.admin } } },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              coin: 1,
              role: 1,
              referenceId: 1,
              createdAt: 1,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 15,
          },
        ],
      },
    },
  ]);

  // const today = moment().startOf('day');

  // Calculate today's income
  const earnings = await Payment.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $facet: {
        totalEarnings: [
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
            },
          },
        ],
        allData: [
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'userDetails',
            },
          },
          {
            $lookup: {
              from: 'subscription',
              localField: 'subscription',
              foreignField: '_id',
              as: 'subscription',
            },
          },
          {
            $project: {
              user: { $arrayElemAt: ['$userDetails', 0] },
              subscription: { $arrayElemAt: ['$subscription', 0] },
              amount: 1,
              tranId: 1,
              status: 1,
              id: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 10,
          },
        ],
      },
    },
  ]);

  const totalEarnings =
    (earnings?.length > 0 &&
      earnings[0]?.totalEarnings?.length > 0 &&
      earnings[0]?.totalEarnings[0]?.total) ||
    0;

  const totalMember = await User.countDocuments({ role: USER_ROLE?.member });
  const totalAdministrator = await User.countDocuments({
    role: USER_ROLE?.administrator,
  });

  const transitionData = earnings[0]?.allData || [];

  // Calculate monthly income
  const year = query.incomeYear ? query.incomeYear : moment().year();
  const startOfYear = moment().year(year).startOf('year');
  const endOfYear = moment().year(year).endOf('year');

  const monthlyIncome = await Payment.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: {
          $gte: startOfYear.toDate(),
          $lte: endOfYear.toDate(),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        income: { $sum: '$amount' },
      },
    },
    {
      $sort: { '_id.month': 1 },
    },
  ]);

  // Format monthly income to have an entry for each month
  const formattedMonthlyIncome = Array.from({ length: 12 }, (_, index) => ({
    month: moment().month(index).format('MMM'),
    income: 0,
  }));

  monthlyIncome.forEach(entry => {
    formattedMonthlyIncome[entry._id.month - 1].income = Math.round(
      entry.income,
    );
  });

  // Calculate monthly income
  // JoinYear: '2022', role: ''
  const userYear = query?.JoinYear ? query?.JoinYear : moment().year();
  const startOfUserYear = moment().year(userYear).startOf('year');
  const endOfUserYear = moment().year(userYear).endOf('year');

  const roleFilter = query.role
    ? { role: query.role }
    : { role: { $in: [USER_ROLE.member, USER_ROLE.administrator] } };

  const monthlyUser = await User.aggregate([
    {
      $match: {
        'verification.status': true,
        ...roleFilter, // Include both 'member' and 'administrator'
        createdAt: {
          $gte: startOfUserYear.toDate(),
          $lte: endOfUserYear.toDate(),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } }, // Group by month
        total: { $sum: 1 }, // Count users
      },
    },
    {
      $sort: { '_id.month': 1 }, // Ensure sorting from Jan-Dec
    },
  ]);
  // return monthlyUser;
  // Format monthly income to have an entry for each month
  const formattedMonthlyUsers = Array.from({ length: 12 }, (_, index) => ({
    month: moment().month(index).format('MMM'),
    total: 0,
  }));

  monthlyUser.forEach(entry => {
    formattedMonthlyUsers[entry._id.month - 1].total = Math.round(entry.total);
  });

  return {
    totalUsers: usersData[0]?.totalUsers[0]?.count || 0,
    totalMember,
    totalAdministrator,
    transitionData,
    totalIncome: totalEarnings,

    // toDayIncome: todayEarnings,

    monthlyIncome: formattedMonthlyIncome,
    monthlyUsers: formattedMonthlyUsers,
    userDetails: usersData[0]?.userDetails,
  };
};

export const paymentsService = {
  checkout,
  confirmPayment,
  dashboardData,
  getEarnings,
};
