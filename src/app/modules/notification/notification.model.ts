import { Schema, model } from 'mongoose';
import { modeType, TNotification } from './notification.interface';

const NotificationSchema = new Schema<TNotification>(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver id is required'],
    },
    refference: {
      type: Schema.Types.ObjectId,
      //   dynamic refference
      refPath: 'model_type',
      required: [true, 'refference id is required'],
    },
    model_type: {
      type: String,
      enum: Object.values(modeType),
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    description: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Notification = model<TNotification>(
  'Notification',
  NotificationSchema,
);
