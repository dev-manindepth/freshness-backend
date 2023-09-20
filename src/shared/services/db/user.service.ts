import { IUserDocument } from '@auth/interfaces/user.interface';
import { UserModel } from '@auth/models/user.schema';
import mongoose from 'mongoose';

class UserService {
  public async createUser(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }
  public async getUserByAuthId(authId: string): Promise<IUserDocument> {
    const userQueryPipeline = [
      {
        $match: { authId: new mongoose.Types.ObjectId(authId) }
      },
      {
        $lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId' }
      },
      {
        $unwind: '$authId'
      },
      {
        $project: this.projectAggregation()
      }
    ];
    const user:IUserDocument[] = await UserModel.aggregate(userQueryPipeline);
    return user[0];
  }
  private projectAggregation() {
    return {
      _id: 1,
      username: '$authId.username',
      uId: '$authId.uId',
      email: '$authId.email',
      phoneNumber: '$authId.phoneNumber',
      createdAt: '$authId.createdAt',
      notifications: 1,
      reviews: 1,
      cart: 1,
      orders: 1,
      wishlist: 1,
      profilePicture: 1
    };
  }
}
export const userService: UserService = new UserService();
