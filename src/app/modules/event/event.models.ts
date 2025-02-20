// Event Schema
import { model, Schema } from 'mongoose';
import { IEvent } from './event.interface';

// const locationSchema = new Schema({
//   latitude: { type: Number, required: true },
//   longitude: { type: Number, required: true },
//   address: { type: String, required: true },
// });

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      // required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    images: {
      type: [
        {
          url: { type: String },
          key: { type: String },
        },
      ],
      default: [],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    churchId: {
      type: Schema.Types.ObjectId,
      ref: 'Church',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

eventSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Event = model<IEvent>('Event', eventSchema);
export default Event;
