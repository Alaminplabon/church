"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberValidationSchema = exports.UserValidationSchema = void 0;
// zod.validation.ts
const zod_1 = require("zod");
const LocationSchema = zod_1.z.object({
    country: zod_1.z.string(),
    state: zod_1.z.string(),
    city: zod_1.z.string(),
    streetAddress: zod_1.z.string(),
    zipCode: zod_1.z.number(),
});
exports.UserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().optional(),
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
        registrationCode: zod_1.z.string().optional(),
        servicesType: zod_1.z
            .union([
            zod_1.z.literal('Travel & Hospitality'),
            zod_1.z.literal('Teaching & Education'),
            zod_1.z.literal('Digital Services'),
            zod_1.z.literal('Health & Wellness'),
            zod_1.z.literal('Art & Music'),
            zod_1.z.literal('Technology Assistance'),
            zod_1.z.literal('Hobbies & Passions'),
            zod_1.z.literal('Consulting Services'),
        ])
            .optional(),
        servicesTags: zod_1.z.array(zod_1.z.string()).optional(),
        hobbies: zod_1.z.array(zod_1.z.string()).optional(),
        title: zod_1.z.string().optional(),
        phoneNumber: zod_1.z.string().optional(),
        password: zod_1.z.string(),
        confirmPassword: zod_1.z.string(),
        gender: zod_1.z
            .union([zod_1.z.literal('Male'), zod_1.z.literal('Female'), zod_1.z.literal('Others')])
            .optional(),
        dateOfBirth: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        role: zod_1.z.string(),
        isGoogleLogin: zod_1.z.boolean().optional(),
        address: LocationSchema.optional(),
        passwordChangedAt: zod_1.z.date().optional(),
    }),
});
exports.memberValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
        confirmPassword: zod_1.z.string(),
        title: zod_1.z.string(),
        gender: zod_1.z.union([
            zod_1.z.literal('Male'),
            zod_1.z.literal('Female'),
            zod_1.z.literal('Others'),
        ]),
        role: zod_1.z.string(),
        dateOfBirth: zod_1.z.string(),
        phoneNumber: zod_1.z.string(),
        address: LocationSchema,
        registrationCode: zod_1.z.string(),
        servicesType: zod_1.z.union([
            zod_1.z.literal('Travel & Hospitality'),
            zod_1.z.literal('Teaching & Education'),
            zod_1.z.literal('Digital Services'),
            zod_1.z.literal('Health & Wellness'),
            zod_1.z.literal('Art & Music'),
            zod_1.z.literal('Technology Assistance'),
            zod_1.z.literal('Hobbies & Passions'),
            zod_1.z.literal('Consulting Services'),
        ]),
        servicesTags: zod_1.z.array(zod_1.z.string()),
        hobbies: zod_1.z.array(zod_1.z.string()),
    }),
});
