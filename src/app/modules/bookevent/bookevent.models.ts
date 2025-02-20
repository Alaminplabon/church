import { model, Schema } from 'mongoose';
import { IBookEvent } from './bookevent.interface';

const bookEventSchema = new Schema<IBookEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

bookEventSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const BookEvent = model<IBookEvent>('BookEvent', bookEventSchema);
export default BookEvent;
