import { ObjectId } from 'mongoose';

interface IImage {
  url: string;
  key: string;
}

export interface IActivity {
  title: string;
  description?: string;
  images?: IImage[];
  userId: ObjectId;
  isDeleted: boolean;
}
