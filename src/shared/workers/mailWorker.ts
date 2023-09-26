import { mailService } from '@service/mails/mail.service';
import { DoneCallback, Job } from 'bull';

class MailWorker {
  public async sendMail(job: Job, done: DoneCallback) {
    try {
      const { template, subject, receiverEmail } = job.data;
      await mailService.sendMail(receiverEmail, subject, template);
      job.progress(100);
      done(null, job.data);
    } catch (err) {
      done(err as Error);
    }
  }
}
export const mailWorker: MailWorker = new MailWorker();
