import { model, Schema } from 'mongoose';
import { INetwork } from './network.interface';

const networkSchema = new Schema<INetwork>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const Network = model<INetwork>('Network', networkSchema);
export default Network;
