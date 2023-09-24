import { IMailJob } from '@auth/interfaces/auth.interface';
import { BaseQueue } from '@service/queue/base.queue';
import { mailWorker } from '@workers/mailWorker';

class MailQueue extends BaseQueue {
  constructor() {
    super('mails');
    this.processJob('forgotPasswordMail', 5, mailWorker.sendMail);
    this.processJob('resetPasswordConfirmation', 5, mailWorker.sendMail);
  }
  public addMailJob(name: string, data: IMailJob) {
    this.addJob(name, data);
  }
}
export const mailQueue: MailQueue = new MailQueue();
