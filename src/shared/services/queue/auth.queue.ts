import { authWorker } from '@workers/authWorker';
import { BaseQueue } from './base.queue';
import { IAuthJob } from '@auth/interfaces/auth.interface';

class AuthQueue extends BaseQueue {
  constructor() {
    super('authQueue');
    this.processJob('addAuthUserToDB', 5, authWorker.addAuthUserToDB);
  }
  public addAuthUserJob(name: string, data: IAuthJob) {
    this.addJob(name, data);
  }
}
export const authQueue: AuthQueue = new AuthQueue();
