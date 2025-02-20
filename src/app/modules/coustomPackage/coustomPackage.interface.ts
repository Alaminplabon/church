import { Model, ObjectId } from 'mongoose';

export interface ICustomPackage {
  price: string;
  member: number;
  contactNumber: string;
  duration: 'Monthly' | 'Yearly';
  description?: string;
  isVerified?: boolean;
  userId: ObjectId;
}

export type ICustomPackageModel = Model<
  ICustomPackage,
  Record<string, unknown>
>;
