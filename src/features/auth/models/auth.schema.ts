import { hash, compare } from 'bcryptjs';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { Schema, Model, model } from 'mongoose';

const SALT_ROUND = 10;
const authSchema: Schema = new Schema(
  {
    username: { type: String },
    uId: { type: String },
    email: { type: String },
    password: { type: String },
    phoneNumber: { type: String },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpires: { type: Number },
    createdAt: { type: Date, default: Date.now }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
  const hashedPassword: string = await hash(this.password as string, SALT_ROUND);
  this.password = hashedPassword;
  next();
});
authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const hashedPassword: string = this.password;
  return compare(hashedPassword, password);
};

export const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth');
