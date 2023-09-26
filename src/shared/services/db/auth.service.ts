import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/models/auth.schema';
import { ServerError } from '@global/helpers/error-handler';

class AuthService {
  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data);
  }
  public async getUserByEmailOrPhoneNumber(phoneNumber: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [{ phoneNumber }, { email: email.toLowerCase() }]
    };
    const user: IAuthDocument = (await AuthModel.findOne(query)) as IAuthDocument;
    return user;
  }
  public async getAuthUserByEmail(email: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({ email: email.toLowerCase() })) as IAuthDocument;
    return user;
  }
  public async getAuthUserByPasswordToken(token: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    })) as IAuthDocument;
    return user;
  }
  public async updatePasswordToken(authId: string, token: string, tokenExpires: number): Promise<void> {
    try {
      await AuthModel.updateOne({ _id: authId }, { passwordResetToken: token, passwordResetExpires: tokenExpires });
    } catch (err) {
      throw new ServerError('Error in updating user');
    }
  }
}

export const authService: AuthService = new AuthService();
