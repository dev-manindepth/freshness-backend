import { IAuthJob } from '@auth/interfaces/auth.interface';
import { BaseQueue } from '@service/queue/base.queue';
import { userWorker } from '@workers/userWorker';

class UserQueue extends BaseQueue {
  constructor() {
    super('userQueue');
    this.processJob('addUserToDB', 5, userWorker.addUserToDB);
  }
  public addUserJob(name: string, data: IAuthJob) {
    this.addJob(name, data);
  }
}
export const userQueue: UserQueue = new UserQueue();
