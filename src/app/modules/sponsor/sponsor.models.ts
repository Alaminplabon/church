import { model, Schema } from 'mongoose';
import { ISponsor } from './sponsor.interface';

const sponsorSchema = new Schema<ISponsor>(
  {
    tranId: {
      type: String,
      ref: 'Payment',
    },
    churchId: {
      type: Schema.Types.ObjectId,
      ref: 'Church',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

sponsorSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Sponsor = model<ISponsor>('Sponsor', sponsorSchema);
export default Sponsor;
