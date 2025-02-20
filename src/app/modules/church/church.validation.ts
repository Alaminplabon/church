import { z } from 'zod';

const churchValidationSchema = z.object({
  churchName: z.string().min(1, 'Church name is required'),
  description: z.string().nullable().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url('Invalid URL format'),
        key: z.string(),
      }),
    )
    .default([]),
  administrator: z
    .string()
    .refine(val => /^[a-fA-F0-9]{24}$/.test(val), {
      message: 'Administrator ID must be a valid ObjectId',
    })
    .optional(),
  regCode: z
    .string()
    .refine(val => /^[a-fA-F0-9]{24}$/.test(val), {
      message: 'Registration Code must be a valid ObjectId',
    })
    .optional(),
  location: z
    .object({
      coordinates: z
        .array(z.number())
        .length(2, 'Coordinates must have two values (longitude, latitude)'),
      type: z.literal('Point'),
    })
    .optional(),
  isDeleted: z.boolean().default(false),
});

export default churchValidationSchema;
