import mongoose, { ObjectId } from 'mongoose';

export interface Ireview {
  creatorId: ObjectId;
  description: string;
  reciverId: ObjectId;
}
