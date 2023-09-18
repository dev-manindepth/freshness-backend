import { BaseCache } from '@service/redis/base.cache';

class RedisConnection extends BaseCache {
  constructor() {
    super('redisConnection');
  }
  async connect(): Promise<void> {
    try {
      await this.client.connect();
      const result = await this.client.ping();
      this.log.info('connected to redis', result);
    } catch (err) {
      this.log.error(err);
    }
  }
}
export const redisConnection: RedisConnection = new RedisConnection();
