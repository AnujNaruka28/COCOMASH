import { createClient } from 'redis';
import { ENV } from './env.js';

const redisClient = createClient({
  url: ENV.REDIS_URL,
});

redisClient.on("error", (err) => console.error('[Redis Error Logged]:', err));

const connectRedis = async () => {
    await redisClient.connect().then(() => {
        console.log('Redis connected');
    }).catch((err) => {
        console.error('Redis connection failed', err);
        process.exit(1);
    });
}

export { connectRedis, redisClient };


