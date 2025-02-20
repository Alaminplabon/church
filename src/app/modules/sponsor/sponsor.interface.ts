import { ObjectId } from 'mongoose';

export interface ISponsor {
  tranId: string; // Refers to Payment.tranId
  churchId?: ObjectId;
  amount: number;
  userId: ObjectId;
  paymentId: ObjectId;
  isDeleted: boolean;
  isPaid: boolean;
}
