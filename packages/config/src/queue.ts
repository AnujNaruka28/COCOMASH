import { Queue } from 'bullmq';
import { getRedisConnectionConfig } from './redis.js';

export function createQueue<T = any>(name: string) {
  return new Queue<T>(name, {
    connection: getRedisConnectionConfig(),
    defaultJobOptions: {
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    },
  });
}
