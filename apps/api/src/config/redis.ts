
import { getRedisClient, connectRedis as connectRedisClient } from '@repo/config';
import { RedisClientType } from 'redis';

export const redisClient: RedisClientType = getRedisClient();
export const connectRedis = async () => await connectRedisClient();