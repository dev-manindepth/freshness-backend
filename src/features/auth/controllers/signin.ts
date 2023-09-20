import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { IUserDocument } from '@auth/interfaces/user.interface';
import { signinSchema } from '@auth/schemas/signin';
import { joiRequestBodyValidation } from '@global/decorator/joi-validator';
import { BadRequestError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';
import { userService } from '@service/db/user.service';
import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';
export class Signin {
  @joiRequestBodyValidation(signinSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    const isValidPassword = existingUser.comparePassword(password);
    if (!isValidPassword) {
      throw new BadRequestError('Invalid credentials');
    }
    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);
    const userToken: string = JWT.sign({ userId: user._id, uId: existingUser.uId }, config.JWT_TOKEN!);
    req.session = { jwt: userToken };
    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser._id,
      uId: existingUser.uId,
      username: existingUser.username,
      email: existingUser.email,
      createdAt: existingUser.createdAt
    } as IUserDocument;
    res.status(HTTP_STATUS.OK).json({ message: 'login success', user: userDocument, token: userToken });
  }
}
