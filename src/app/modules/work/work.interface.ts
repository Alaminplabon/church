import { ObjectId } from 'mongoose';

interface IImage {
  url: string;
  key: string;
}

export interface IWork {
  workName: string;
  description?: string;
  images?: IImage[];
  userId: ObjectId;
  isDeleted: boolean;
}
