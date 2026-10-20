import { getRedisClient, connectRedis } from '@repo/config';

export const redisClient = getRedisClient();
export const initRedis = async () => await connectRedis();