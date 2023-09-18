import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IUserDocument } from './user.interface';

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}
export interface AuthPayload {
  userId: string;
  uId: string;
  email: string;
  username: string;
  phoneNumber: string;
  iat?: number;
}
export interface IAuthDocument extends Document {
  _id: string | ObjectId;
  uId: string;
  username: string;
  email: string;
  phoneNumber: string;
  password?: string;
  createdAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}
export interface ISignupData {
  _id: ObjectId;
  uId: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
}

export interface IAuthJob {
  value?: string | IAuthDocument | IUserDocument;
}
