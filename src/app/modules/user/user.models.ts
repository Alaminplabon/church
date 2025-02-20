import { Error, Query, Schema, model } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from './user.interface';
import cron from 'node-cron';

const locationSchema = new Schema({
  country: { type: String },
  state: { type: String },
  city: { type: String },
  streetAddress: { type: String },
  zipCode: { type: Number },
});

const userSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    username: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    registrationCode: { type: String },
    servicesType: {
      type: [String],
    },
    servicesTags: { type: [String] },
    hobbies: { type: [String] },
    title: { type: String },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    confirmPassword: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Others'] },
    dateOfBirth: { type: String },
    image: { type: String },
    role: {
      type: String,
      enum: ['administrator', 'member', 'admin'],
      required: true,
    },
    isGoogleLogin: { type: Boolean },
    address: locationSchema,
    needsPasswordChange: { type: Boolean, required: true, default: false },
    passwordChangedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    verification: {
      otp: { type: Schema.Types.Mixed },
      expiresAt: { type: Date },
      status: { type: Boolean },
    },
    codeGenetarelimit: {
      type: Number,
      default: 0,
    },
    durationDay: {
      type: Number,
      default: 0,
    },
    about: { type: String },
    bannerimage: { type: String, default: null },
    churchId: { type: Schema.Types.ObjectId, ref: 'Church' },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
userSchema.post(
  'save',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (error: Error, doc: any, next: (error?: Error) => void): void {
    doc.password = '';
    next();
  },
);

userSchema.pre<Query<IUser[], IUser>>('find', function (next) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre<Query<IUser | null, IUser>>('findOne', function (next) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email: email }).select('+password');
};

userSchema.statics.IsUserExistId = async function (id: string) {
  return await User.findById(id).select('+password');
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
// // Daily Cron Job to decrement durationDay
// cron.schedule('0 0 * * *', async () => {
//   console.log('Running daily job to decrement durationDay...');
//   try {
//     const users = await User.find({ durationDay: { $gt: 0 } });

//     for (const user of users) {
//       user.durationDay -= 1; // Decrement durationDay
//       if (user.durationDay === 0) {
//         user.codeGenetarelimit = 0; // Reset carCreateLimit if durationDay expires
//       }
//       await user.save(); // Save the updated user //     }

//     console.log('Daily job completed successfully.');
//   } catch (error) {
//     console.error('Error running daily job:', error);
//   }
// });
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily job to decrement durationDay...');

  try {
    const users = await User.find({ durationDay: { $gt: 0 } });

    for (const user of users) {
      const updatedDurationDay = user.durationDay - 1;
      const updateFields = { durationDay: updatedDurationDay };

      if (updatedDurationDay === 0) {
        (updateFields as any).codeGenetarelimit = 0;
      }

      await User.updateOne({ _id: user._id }, { $set: updateFields });
    }

    console.log('Daily job completed successfully.');
  } catch (error) {
    console.error('Error running daily job:', error);
  }
});
