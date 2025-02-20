import { ObjectId } from 'mongoose';

export interface IBookEvent {
  userId: ObjectId;
  eventId: ObjectId;
  isDeleted: boolean;
}
