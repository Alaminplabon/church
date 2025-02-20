import { z } from 'zod';

const bookEventValidationSchema = z.object({
  userId: z
    .string()
    .uuid('Invalid User ID format')
    .refine(val => /^[a-fA-F0-9]{24}$/.test(val), {
      message: 'User ID must be a valid ObjectId',
    }),
  eventId: z
    .string()
    .uuid('Invalid Event ID format')
    .refine(val => /^[a-fA-F0-9]{24}$/.test(val), {
      message: 'Event ID must be a valid ObjectId',
    }),
  isDeleted: z.boolean().optional(),
});

export default bookEventValidationSchema;
