import { ObjectId } from 'mongodb';
export enum modeType {
  RefundRequest = 'refundRequest',
  ShopWiseOrder = 'ShopWiseOrder',
  Order = 'Order',
  Payment = 'Payment',
  Event = 'Event',
  Shop = 'Shop',
  User = 'User',
  Church = 'Church',
  Sponsor = 'Sponsor',
  Terms = 'Terms',
  codeGenerator = 'codeGenerator',
  BookEvent = 'BookEvent',
}
export interface TNotification {
  receiver: ObjectId;
  message: string;
  description?: string;
  refference: ObjectId;
  model_type: modeType;
  date?: Date;
  read: boolean;
  isDeleted: boolean;
}
