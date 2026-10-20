import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { roomsRoutes } from './modules/rooms/routes.js';
import { usersRoutes } from './modules/users/routes.js';
import { ENV } from './config/env.js';
import { connectRedis } from './config/redis.js';
import { connectDB } from '@repo/db';
import { submissionsRoutes } from './modules/submissions/routes.js';

const app = express();
const PORT = ENV.PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1', roomsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/submissions', submissionsRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, async () => {
  await connectDB();
  await connectRedis();
  console.log(`API server running on port ${PORT}`);
});