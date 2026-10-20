import { initRedis } from "./config/redis.js";
import worker from "./modules/execution/processor.js";

await initRedis();

console.log("---Worker Initialized---");
console.log("Processing code execution jobs...");

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await worker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await worker.close();
  process.exit(0);
});
