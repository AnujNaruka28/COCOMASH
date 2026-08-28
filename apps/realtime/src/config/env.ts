import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.number().default(3000),
    WEB_URL: z.url(),
});

export const ENV = envSchema.parse(process.env);