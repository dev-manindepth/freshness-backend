import { IUserDocument } from '@auth/interfaces/user.interface';
import { ServerError } from '@global/helpers/error-handler';
import { Helper } from '@global/helpers/helpers';
import { BaseCache } from '@service/redis/base.cache';
import { ObjectId } from 'mongodb';

class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }
  public async saveUserToCache(userUId: string, userObjectId: ObjectId, createdUser: IUserDocument): Promise<void> {
    const createdAt = new Date();
    const { notifications, reviews, cart, orders, wishlist } = createdUser;
    const dataToSave = {
      ...createdUser,
      notifications: JSON.stringify(notifications),
      reviews: JSON.stringify(reviews),
      cart: JSON.stringify(cart),
      orders: JSON.stringify(orders),
      wishlist: JSON.stringify(wishlist),
      createdAt: `${createdAt}`
    };

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.ZADD('user', { score: parseInt(userUId), value: `${userObjectId}` });
      for (const [key, value] of Object.entries(dataToSave)) {
        await this.client.HSET(`users:${userObjectId}`, `${key}`, `${value}`);
      }
    } catch (err) {
      this.log.error(err);
      throw new ServerError('Server error. Try again');
    }
  }
}

export const userCache: UserCache = new UserCache();
