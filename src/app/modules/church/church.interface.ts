import { Model, ObjectId } from 'mongoose';

interface IImage {
  url: string;
  key: string;
}

export interface IChurch {
  deleteKey: string[];
  churchName: string;
  description?: string;
  images: IImage[];
  isDeleted: boolean;
  administrator: ObjectId;
  regCode: ObjectId;
  location: { coordinates: [number, number]; type: string };
  address: { coordinates: [number, number]; type: string };
  bannerImage: IImage[];
  defaultImages: IImage[];
  memberCount: number;
  churchBalance: number;
  socialMedia: {
    web?: string;
    facebook?: string;
    ex?: string;
    instagram?: string;
  };
}

export interface udChurch extends IChurch {
  defaultImages: { key: string; url: string }[];
}

export type IChurchModules = Model<IChurch, Record<string, unknown>>;
