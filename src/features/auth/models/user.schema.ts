import { IUserDocument } from '@auth/interfaces/user.interface';
import mongoose, { model, Model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', index: true },
  profilePicture: { type: String, default: '' },
  passwordResetToken: { type: String, default: '' },
  passwordResetExpires: { type: Number },
  notifications: {
    orders: { type: Boolean, default: true },
    reminders: { type: Boolean, default: true },
    recommended: { type: Boolean, default: true },
    offersAndDeals: { type: Boolean, default: true },
    ratingAndReviews: { type: Boolean, default: true }
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId }],
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
});

export const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');
