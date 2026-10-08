import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  REDIS_URL: z.string(),
  WEB_URL: z.string(),
  DATABASE_URL: z.string(),
  LIVEBLOCKS_SECRET_KEY: z.string(),
});

const ENV = envSchema.parse(process.env);

export { ENV };
