import { createClient, RedisClientType } from 'redis';
import { ENV } from './env.js';

let redisClient: RedisClientType | null = null;

/**
 * Get or create a Redis client instance
 * Use this for pub/sub and direct Redis operations
 */
export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    redisClient = createClient({
      url: ENV.REDIS_URL,
    });

    redisClient.on('error', (err) => console.error('[Redis Error]:', err));
  }

  return redisClient;
}

/**
 * Connect to Redis
 * Call this once during app initialization
 */
export async function connectRedis() {
  const client = getRedisClient();
  
  if (!client.isOpen) {
    await client.connect().then(() => {
      console.log('Redis connected');
    }).catch((err) => {
      console.error('Redis connection failed', err);
      process.exit(1);
    });
  }
}

/**
 * Get Redis connection configuration
 * Use this for BullMQ Queue and Worker
 */
export function getRedisConnectionConfig() {
  return {
    url: ENV.REDIS_URL,
  };
}