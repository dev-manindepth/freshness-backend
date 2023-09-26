import { config } from '@root/config';
import Queue, { Job, ProcessCallbackFunction } from 'bull';
import Logger from 'bunyan';
import { createBullBoard, BullAdapter, ExpressAdapter } from '@bull-board/express';
import { IAuthJob, IMailJob } from '@auth/interfaces/auth.interface';
let bullAdapters: BullAdapter[] = [];
export let serverAdapter: ExpressAdapter;

type IBaseJob = IAuthJob | IMailJob;
export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
    this.log = config.createLogger(`${queueName}Queue`);
    bullAdapters.push(new BullAdapter(this.queue));
    bullAdapters = [...new Set(bullAdapters)];
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    createBullBoard({ queues: bullAdapters, serverAdapter });
    this.queue.on('global:completed', (jobId: string) => {
      this.log.info(`Job ${jobId} completed`);
    });
    this.queue.on('global:stalled', (jobId: Job) => {
      this.log.info(`Job ${jobId} stalled`);
    });
  }
  protected addJob(name: string, data: IBaseJob): void {
    this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } });
  }
  protected processJob(name: string, concurrency: number, callback: ProcessCallbackFunction<void>): void {
    this.queue.process(name, concurrency, callback);
  }
}
