import { model, Schema } from 'mongoose';
import { IActivity } from './activity.interface';

const activitySchema = new Schema<IActivity>(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      unique: true,
    },
    description: {
      type: String,
      default: null,
    },
    images: {
      type: [
        {
          url: { type: String },
          key: { type: String },
        },
      ],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

activitySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Activity = model<IActivity>('Activity', activitySchema);
export default Activity;
