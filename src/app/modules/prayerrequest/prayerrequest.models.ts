import { model, Schema } from 'mongoose';
import { IPrayerRequest } from './prayerrequest.interface';

const prayerRequestSchema = new Schema<IPrayerRequest>(
  {
    payerName: {
      type: String,
      required: [true, 'Payer name is required'],
    },
    churchId: {
      type: Schema.Types.ObjectId,
      ref: 'Church',
      required: [true, 'User ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      // match: [/^\d{2}:\d{2}:\d{2}$/, 'Invalid time format (HH:mm:ss)'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      // match: [/^\d{2}:\d{2}:\d{2}$/, 'Invalid time format (HH:mm:ss)'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

prayerRequestSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const PrayerRequest = model<IPrayerRequest>(
  'PrayerRequest',
  prayerRequestSchema,
);
export default PrayerRequest;
