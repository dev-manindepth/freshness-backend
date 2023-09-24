import { IResetPassword } from '@auth/interfaces/auth.interface';
import ejs from 'ejs';
import fs from 'fs';
class ResetPasswordTemplate {
  public createTemplate(templateOptions: IResetPassword) {
    const { username, email, ipaddress, date } = templateOptions;
    return ejs.render(fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf8'), {
      username,
      email,
      ipaddress,
      date,
      image_url:
        'https://w7.pngwing.com/pngs/546/655/png-transparent-password-computer-icons-user-the-plain-style-miscellaneous-area-padlock.png'
    });
  }
}
export const resetPasswordTempate: ResetPasswordTemplate = new ResetPasswordTemplate();
