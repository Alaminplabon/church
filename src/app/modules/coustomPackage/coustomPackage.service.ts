import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import CustomPackage from './coustomPackage.models';
import { ICustomPackage } from './coustomPackage.interface';
import { User } from '../user/user.models';
import path from 'path';
import { sendEmail } from '../../utils/mailSender';

import fs from 'fs';

const createCustomPackage = async (payload: ICustomPackage) => {
  const customPackage = await CustomPackage.create(payload);
  if (!customPackage) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create custom package.',
    );
  }
  // Find the admin to notify.
  const admin = await User.findOne({ role: 'admin' });
  if (!admin || !admin.email) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Admin email not found',
    );
  }

  // Build the path to the email template.
  const emailTemplatePath = path.join(
    __dirname,
    '../../../../public/view/custom_package_mail.html',
  );

  if (!fs.existsSync(emailTemplatePath)) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Email template not found',
    );
  }

  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');

  // Replace placeholders with the corresponding values from the payload.
  // Make sure your email template contains placeholders like:
  // {{price}}, {{member}}, {{contactNumber}}, {{duration}}, and {{description}}
  const emailContent = emailTemplate
    .replace('{{price}}', payload.price)
    .replace('{{member}}', payload.member.toString())
    .replace('{{contactNumber}}', payload.contactNumber)
    .replace('{{duration}}', payload.duration)
    .replace('{{description}}', payload.description || '');

  // Send email notification to the admin.
  await sendEmail(
    admin.email,
    'A new custom package request has been submitted',
    emailContent,
  );

  return customPackage;
};

const getAllCustomPackages = async (query: Record<string, any>) => {
  const customPackageModel = new QueryBuilder(
    CustomPackage.find({ isVerified: false }),
    query,
  )
    .search(['description']) // Update search field if needed
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await customPackageModel.modelQuery;
  const meta = await customPackageModel.countTotal();
  return { data, meta };
};

const getCustomPackageById = async (id: string) => {
  const result = await CustomPackage.findOne({ _id: id, isVerified: false });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Custom package not found');
  }
  return result;
};

const updateCustomPackage = async (
  id: string,
  payload: Partial<ICustomPackage>,
) => {
  const customPackage = await CustomPackage.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!customPackage) {
    throw new AppError(httpStatus.NOT_FOUND, 'Custom package not found');
  }

  // If isVerified is updated to true
  if (payload.isVerified === true) {
    // Update the user schema with member count (codeGenetarelimit)
    await User.findOneAndUpdate(
      { _id: customPackage.userId }, // Assuming userId is available in the custom package
      { $inc: { codeGenetarelimit: customPackage.member } },
      { new: true },
    );

    // Set durationDay based on the duration (Monthly or Yearly)
    const durationDay = customPackage.duration === 'Monthly' ? 30 : 365;
    await User.findOneAndUpdate(
      { _id: customPackage.userId },
      { durationDay },
      { new: true },
    );
  }

  return customPackage;
};

const deleteCustomPackage = async (id: string) => {
  const result = await CustomPackage.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Custom package delete failed');
  }
  return result;
};

export const customPackageService = {
  createCustomPackage,
  getAllCustomPackages,
  getCustomPackageById,
  updateCustomPackage,
  deleteCustomPackage,
};
