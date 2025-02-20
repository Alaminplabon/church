import { model, Schema, Types } from 'mongoose';

export interface INetwork {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}
