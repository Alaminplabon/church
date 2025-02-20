// Event Interface
// export interface ILocation {
//   latitude: number;
//   longitude: number;
//   address: string;
// }

interface IImage {
  url: string;
  key: string;
}

export interface IEvent {
  title: string;
  description: string;
  location: string;
  date: Date;
  images: IImage[];
  userId: object;
  churchId: object;
  isDeleted?: boolean;
  startTime: string;
  endTime: string;
}

export interface udEvent extends IEvent {
  defaultImages: { key: string; url: string }[];
}
