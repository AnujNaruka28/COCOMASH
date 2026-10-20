import { redisClient } from "../../config/redis.js";
import { ExecutionResult } from "./dto.js";


export async function publishExecutionResult(
    roomId: string,
    result: ExecutionResult
) {
    const channel = `room:${roomId}:execution`;
    await redisClient.publish(channel, JSON.stringify(result));
}
