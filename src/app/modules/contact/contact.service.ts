import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { Icontact } from './contact.interface';
import { contactController } from './contact.controller';
import contact from './contact.models';
import path from 'path';
import { sendEmail } from '../../utils/mailSender';
import { User } from '../user/user.models';
import fs from 'fs';

const createContact = async (payload: Icontact) => {
  const contacts = await contact.create(payload);

  if (!contacts) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create contact',
    );
  }

  const admin = await User.findOne({ role: 'admin' });
  if (!admin || !admin.email) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Admin email not found',
    );
  }

  const emailTemplatePath = path.join(
    __dirname,
    '../../../../public/view/contact_mail.html',
  );

  if (!fs.existsSync(emailTemplatePath)) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Email template not found',
    );
  }

  const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');

  const emailContent = emailTemplate
    .replace('{{firstName}}', payload.firstName)
    .replace('{{lastName}}', payload.lastName)
    .replace('{{email}}', payload.email)
    .replace('{{description}}', payload.description);

  await sendEmail(admin.email, 'A new contact has been added', emailContent);

  return contacts;
};

const getAllcontact = async () => {
  const contacts = await contact.find();
  if (!contacts) {
    throw new AppError(httpStatus.NOT_FOUND, 'No contacts found');
  }
  return contacts;
};

const getcontactById = async (id: string) => {
  const contactById = await contact.findById(id);
  if (!contactById) {
    throw new AppError(httpStatus.NOT_FOUND, 'Contact not found');
  }
  return contactById;
};

const updatecontact = async (id: string, payload: Partial<Icontact>) => {
  const updatedContact = await contact.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedContact) {
    throw new AppError(httpStatus.NOT_FOUND, 'Contact not found to update');
  }
  return updatedContact;
};

const deletecontact = async (id: string) => {
  const deletedContact = await contact.findByIdAndDelete(id);
  if (!deletedContact) {
    throw new AppError(httpStatus.NOT_FOUND, 'Contact not found to delete');
  }
  return deletedContact;
};

export const contactService = {
  createContact,
  getAllcontact,
  getcontactById,
  updatecontact,
  deletecontact,
};
