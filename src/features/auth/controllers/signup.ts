import { joiRequestBodyValidation } from '@global/decorator/joi-validator';
import { signupSchema } from '@auth/schemas/signup';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { Helper } from '@global/helpers/helpers';
import { IAuthDocument, ISignupData } from '@auth/interfaces/auth.interface';
import { IUserDocument } from '@auth/interfaces/user.interface';
import { userCache } from '@service/redis/user.cache';
import HTTP_STATUS from 'http-status-codes';
import { authQueue } from '@service/queue/auth.queue';
import { userQueue } from '@service/queue/user.queue';
import JWT from 'jsonwebtoken';
import { config } from '@root/config';
export class Signup {
  @joiRequestBodyValidation(signupSchema)
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password, phoneNumber } = req.body;
      const userAlreadyExists = await authService.getUserByEmailOrPhoneNumber(phoneNumber, email);
      if (userAlreadyExists) {
        throw new BadRequestError('Invalid credentials');
      }
      const authObjectId: ObjectId = new ObjectId();
      const userObjectId: ObjectId = new ObjectId();
      const uId = `${Helper.generateRandomIntegers(12)}`;
      const authData: IAuthDocument = Signup.prototype.signupData({
        _id: authObjectId,
        uId,
        username,
        email,
        password,
        phoneNumber
      });
      const userDataForCache: IUserDocument = Signup.prototype.userData(authData, userObjectId);
      await userCache.saveUserToCache(uId, userObjectId, userDataForCache);

      authQueue.addAuthUserJob('addAuthUserToDB', { value: authData });
      userQueue.addUserJob('addUserToDB', { value: userDataForCache });

      const userAuthToken: string = Signup.prototype.signToken(authData, userObjectId);
      req.session = { jwt: userAuthToken };
      res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', authData, user: userDataForCache });
    } catch (error) {
      next(error);
    }
  }
  private signupData(data: ISignupData): IAuthDocument {
    const { _id, uId, username, email, password, phoneNumber } = data;
    return {
      _id,
      uId,
      username,
      email: email.toLowerCase(),
      password,
      phoneNumber,
      createdAt: new Date()
    } as IAuthDocument;
  }
  private userData(authData: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, uId, username, email, phoneNumber, password } = authData;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username,
      email: email.toLowerCase(),
      phoneNumber,
      password,
      profilePicture: '',
      notifications: {
        orders: true,
        reminders: true,
        recommended: true,
        offersAndDeals: true,
        ratingAndReviews: true
      },
      reviews: [],
      cart: [],
      orders: [],
      wishlist: []
    } as unknown as IUserDocument;
  }
  private signToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign({ userId: userObjectId, uId: data.uId }, config.JWT_TOKEN!);
  }
}
