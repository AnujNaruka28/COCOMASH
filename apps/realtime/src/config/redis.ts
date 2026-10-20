import { getRedisClient, connectRedis } from '@repo/config';

export const redis = getRedisClient();
export const initializeRedis = async () => await connectRedis();
