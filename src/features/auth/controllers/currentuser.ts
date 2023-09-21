import { IUserDocument } from '@auth/interfaces/user.interface';
import { userService } from '@service/db/user.service';
import { userCache } from '@service/redis/user.cache';
import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

export class CurrentUser {
  public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let isUser = false;
      let token = null;
      let user = null;
      const cachedUser: IUserDocument = (await userCache.getUserDataFromCache(req.currentUser!.userId)) as IUserDocument;
      const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserByUserId(req.currentUser!.userId);
      if (Object.keys(existingUser).length) {
        isUser = true;
        token = req.session?.jwt;
        user = existingUser;
      }
      res.status(HTTP_STATUS.OK).json({ token, isUser, user });
    } catch (err) {
      next(err);
    }
  }
}
