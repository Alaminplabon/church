import { z } from 'zod';
import { Role, USER_ROLE } from './user.constants';

const guestValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const userValidation = {
  guestValidationSchema,
};
