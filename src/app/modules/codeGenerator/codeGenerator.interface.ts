import { Model, ObjectId, Types } from 'mongoose';

export interface ICodeGenerator {
  code: string;
  userId: ObjectId;
  churchId: ObjectId;
  memberId?: ObjectId; // Make memberId optional here
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ICodeGeneratorModules = Model<
  ICodeGenerator,
  Record<string, unknown>
>;
