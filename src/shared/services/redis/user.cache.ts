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
  public async getUserDataFromCache(userObjectId: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const userDocument: IUserDocument = (await this.client.HGETALL(`users:${userObjectId}`)) as unknown as IUserDocument;
      const { notifications, reviews, cart, orders, wishlist, createdAt } = userDocument;
      userDocument.notifications = Helper.parseJSON(`${notifications}`);
      userDocument.reviews = Helper.parseJSON(`${reviews}`);
      userDocument.cart = Helper.parseJSON(`${cart}`);
      userDocument.orders = Helper.parseJSON(`${orders}`);
      userDocument.wishlist = Helper.parseJSON(`${wishlist}`);
      userDocument.createdAt = new Date(`${createdAt}`);
      return userDocument;
    } catch (err) {
      this.log.error(err);
      throw new ServerError('Server error . Try again');
    }
  }
}

export const userCache: UserCache = new UserCache();
