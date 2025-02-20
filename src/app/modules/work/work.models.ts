import { model, Schema } from 'mongoose';
import { IWork } from './work.interface';

const workSchema = new Schema<IWork>(
  {
    workName: {
      type: String,
      required: [true, 'Work name is required'],
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

workSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Work = model<IWork>('Work', workSchema);
export default Work;
