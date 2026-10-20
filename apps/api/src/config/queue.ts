import { createQueue } from '@repo/config';
import { Queue } from 'bullmq';

export const executionQueue: Queue = createQueue('code-execution');