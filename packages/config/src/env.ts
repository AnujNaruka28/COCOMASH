import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  WEB_URL: z.url().optional(),
  REDIS_URL: z.url(),
  E2B_API_KEY: z.string().optional(),
  DATABASE_URL: z.url().optional(),
});

export const ENV = envSchema.parse(process.env);