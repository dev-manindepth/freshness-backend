import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/models/auth.schema';

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
}

export const authService: AuthService = new AuthService();
