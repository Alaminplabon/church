import { Model, Types } from 'mongoose';
type Location = {
  country: string;
  state: string;
  city: string;
  streetAddress: string;
  zipCode: number;
};

export interface IUser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [x: string]: any;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  _id?: Types.ObjectId;
  status?: string;
  username?: string;
  registrationCode?: string;
  servicesType?: string[];
  servicesTags?: string[];
  hobbies?: string[];
  title?: string;
  phoneNumber?: string;
  gender?: 'Male' | 'Female' | 'Others';
  dateOfBirth?: string;
  image?: string;
  role: 'administrator' | 'member' | 'admin';
  isGoogleLogin?: boolean;
  address?: Location;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  churchId?: Types.ObjectId;
  isSeventeenth?: boolean;
  isDeleted: boolean;
  verification?: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
  codeGenetarelimit: number;
  durationDay: number;
  about: string;
  bannerimage?: string;
  createdAt?: Date;
}

export interface UserModel extends Model<IUser> {
  isUserExist(email: string): Promise<IUser>;
  IsUserExistId(id: string): Promise<IUser>;
  IsUserExistUserName(userName: string): Promise<IUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
