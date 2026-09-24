import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.string().default("3000").transform(Number),
    WEB_URL: z.url(),
});

export const ENV = envSchema.parse(process.env);