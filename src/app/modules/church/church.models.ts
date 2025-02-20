import { model, Schema } from 'mongoose';
import { IChurch, IChurchModules } from './church.interface';

const churchSchema = new Schema<IChurch>(
  {
    churchName: {
      type: String,
      required: [true, 'Church name is required'],
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
    administrator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    regCode: {
      type: Schema.Types.ObjectId,
      ref: 'ChurchRegistration',
    },
    // Define location as a GeoJSON Point
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    // Define address as a GeoJSON Point
    address: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    isDeleted: { type: Boolean, default: false },
    memberCount: { type: Number, default: 0 },
    socialMedia: {
      web: { type: String, default: null },
      facebook: { type: String, default: null },
      ex: { type: String, default: null },
      instagram: { type: String, default: null },
    },
    churchBalance: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

// Create a 2dsphere index on the address field (GeoJSON)
churchSchema.index({ address: '2dsphere' });

const Church = model<IChurch, IChurchModules>('Church', churchSchema);
export default Church;
