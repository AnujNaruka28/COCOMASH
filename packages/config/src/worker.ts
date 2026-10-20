import { Worker } from "bullmq";
import { getRedisConnectionConfig } from "./redis.js";

export function createWorker<T = any>(
    name: string, 
    processor: (job: any) => Promise<any>,
    options?: { concurrency?: number }
) {
    
    return new Worker<T>(
        name, 
        processor, 
        {
            connection: getRedisConnectionConfig(),
            concurrency: options?.concurrency || 1,
        }
    );
}