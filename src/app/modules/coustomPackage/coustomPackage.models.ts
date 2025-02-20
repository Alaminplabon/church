import { model, Schema } from 'mongoose';
import {
  ICustomPackage,
  ICustomPackageModel,
} from './coustomPackage.interface';

const customPackageSchema = new Schema<ICustomPackage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: {
      type: String,
      required: [true, 'Price is required'],
    },
    member: {
      type: Number,
      required: [true, 'Member count is required'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    duration: {
      type: String,
      enum: ['Monthly', 'Yearly'],
      required: [true, 'Duration is required'],
    },
    description: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false, // Default value is false
    },
  },
  {
    timestamps: true,
  },
);

const CustomPackage = model<ICustomPackage, ICustomPackageModel>(
  'CustomPackage',
  customPackageSchema,
);
export default CustomPackage;
