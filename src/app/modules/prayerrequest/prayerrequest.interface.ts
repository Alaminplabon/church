import { ObjectId } from 'mongoose';

export interface IPrayerRequest {
  payerName: string;
  churchId: ObjectId;
  userId: ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  description: string;
  isDeleted: boolean;
}
