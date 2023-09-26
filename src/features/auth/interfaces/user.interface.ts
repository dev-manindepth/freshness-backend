import { Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
export interface IUserDocument extends Document {
  _id: string | ObjectId;
  authId: string | ObjectId;
  username?: string;
  email?: string;
  password?: string;
  uId?: string;
  notifications: INotificationSettings;
  reviews: Types.ObjectId[];
  cart: ICartItem[];
  orders: Types.ObjectId[];
  wishlist: Types.ObjectId[];
  profilePicture: string;
  createdAt?: Date;
}
interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}
export interface INotificationSettings {
  orders: boolean;
  reminders: boolean;
  recommended: boolean;
  offersAndDeals: boolean;
  ratingAndReviews: boolean;
}
