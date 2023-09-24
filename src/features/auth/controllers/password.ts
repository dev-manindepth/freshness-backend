import { IAuthDocument, IResetPassword } from '@auth/interfaces/auth.interface';
import { emailSchema, passwordSchema, tokenSchema } from '@auth/schemas/password';
import { joiRequestBodyValidation, joiRequestParamsValidation } from '@global/decorator/joi-validator';
import { BadRequestError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import crypto from 'crypto';
import { authService } from '@service/db/auth.service';
import { forgotPasswordTemplate } from '@service/mails/templates/forgot-password/forgot-password-template';
import { resetPasswordTempate } from '@service/mails/templates/reset-password/reset-password-template';
import { mailQueue } from '@service/queue/mail.queue';
import Logger from 'bunyan';
import { format } from 'date-fns';
import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import publicIP from 'ip';
const log: Logger = config.createLogger('password');
export class Password {
  @joiRequestBodyValidation(emailSchema)
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body;
    try {
      const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);
      if (!existingUser) {
        throw new BadRequestError('Invalid email');
      }
      const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
      const randomCharacters: string = randomBytes.toString();
      await authService.updatePasswordToken(`${existingUser._id}`, randomCharacters, Date.now() * 60 * 60 * 1000);
      const resetLink: string = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
      const template: string = forgotPasswordTemplate.createTemplate(existingUser.username, resetLink);
      mailQueue.addMailJob('forgotPasswordMail', { template: template, receiverEmail: existingUser.email, subject: 'Reset your password' });
      res.status(HTTP_STATUS.OK).json({ message: 'Reset link sent successfully' });
    } catch (err) {
      log.error('error in password controller', err);
      next(err);
    }
  }

  @joiRequestBodyValidation(passwordSchema)
  @joiRequestParamsValidation(tokenSchema)
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { password, confirmPassword } = req.body;
      const { token } = req.params;
      if (password !== confirmPassword) {
        throw new BadRequestError('Password and ConfirmPassword donot match');
      }
      const existingUser: IAuthDocument = await authService.getAuthUserByPasswordToken(token);
      if (!existingUser) {
        throw new BadRequestError('Invalid token');
      }
      existingUser.password = password;
      existingUser.passwordResetExpires = undefined;
      existingUser.passwordResetToken = undefined;
      await existingUser.save();
      const templateParams: IResetPassword = {
        username: existingUser.username,
        email: existingUser.email,
        ipaddress: publicIP.address(),
        date: format(new Date(), 'dd/MM/yyyy HH:mm')
      };
      const template: string = resetPasswordTempate.createTemplate(templateParams);
      mailQueue.addMailJob('resetPasswordConfirmation', { template, receiverEmail: existingUser.email, subject: 'Password Reset success' });
      res.status(HTTP_STATUS.OK).json({ message: 'password reset successfully' });
    } catch (err) {
      next(err);
    }
  }
}
