import mongoose, { Schema } from 'mongoose';
import { Ireview } from './review.interface';

// import { Schema } from 'zod';

const ReviewSchema: Schema<Ireview> = new Schema(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reciverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Review = mongoose.model<Ireview>('Review', ReviewSchema);
export default Review;
