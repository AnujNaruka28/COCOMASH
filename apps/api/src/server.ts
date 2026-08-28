import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { roomsRouter } from './modules/rooms/routes.js';
import { ENV } from './config/env.js';
import { connectRedis } from './config/redis.js';
import { connectDB } from '@repo/db';

const app = express();
const PORT = ENV.PORT;

app.use(helmet());
app.use(cors());

app.use('/api/v1', roomsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, async () => {
  await connectDB();
  await connectRedis();
  console.log(`API server running on port ${PORT}`);
});