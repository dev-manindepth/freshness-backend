import { config } from '@root/config';
import sendgridMail from '@sendgrid/mail';
import Logger from 'bunyan';
import Mail from 'nodemailer/lib/mailer';
import nodemailer from 'nodemailer';
import { ServerError } from '@global/helpers/error-handler';

sendgridMail.setApiKey(config.SENDGRID_API_KEY!);
const log: Logger = config.createLogger('mailService');

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}
class MailService {
  public async sendMail(receiverEmail: string, subject: string, body: string) {
    if (config.NODE_ENV == 'test' || config.NODE_ENV == 'development') {
      this.sendDevelopmentMail(receiverEmail, subject, body);
    } else {
      this.sendProductionMail(receiverEmail, subject, body);
    }
  }
  public async sendDevelopmentMail(receiverEmail: string, subject: string, body: string) {
    const transporter: Mail = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_PASSWORD
      }
    });
    const mailOptions: IMailOptions = {
      from: `Freshness App <${config.SENDER_EMAIL!}>`,
      to: receiverEmail,
      subject,
      html: body
    };
    try {
      await transporter.sendMail(mailOptions);
      log.info('dev mail sent successfully');
    } catch (err) {
      log.error('error in sending dev mail', err);
      throw new ServerError('Error in sending email');
    }
  }
  public async sendProductionMail(receiverEmail: string, subject: string, body: string) {
    const mailOptions: IMailOptions = {
      from: `Freshness App <${config.SENDER_EMAIL!}>`,
      to: receiverEmail,
      subject,
      html: body
    };
    try {
      await sendgridMail.send(mailOptions);
      log.info('prod mail sent successfully');
    } catch (err) {
      log.error('error in sending prod mail', err);
      throw new ServerError('Error in sending prod mail');
    }
  }
}

export const mailService: MailService = new MailService();
