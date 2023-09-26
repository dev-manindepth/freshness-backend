import { AuthPayload } from '@auth/interfaces/auth.interface';
import { config } from '@root/config';
import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import { NotAuthorizedError } from '@global/helpers/error-handler';

class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    try {
      if (!req.session?.jwt) {
        throw new NotAuthorizedError('Token is not available . Please login again');
      }
    } catch (err) {
      return next(err);
    }
    try {
      const payload: AuthPayload = JWT.verify(req.session?.jwt, config.JWT_TOKEN!) as AuthPayload;
      req.currentUser = payload;
      next();
    } catch (err) {
      next(new NotAuthorizedError('Token is invalid. Please login again'));
    }
  }
  public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError('Authentication is required to access this route');
      }
      next();
    } catch (err) {
      next(err);
    }
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
