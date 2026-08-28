import type { Server, Socket } from "socket.io";
import { registerRoomEvents } from "../rooms/handler";
import z from "zod";

function registerEvent<T extends z.ZodType>(
    socket: Socket,
    event: string,
    schema: T,
    handler: (data: z.infer<T>) => Promise<void>
) {

    socket.on(event, async (rawData) => {
        const result = schema.safeParse(rawData);
        if(!result.success) {
            socket.emit(`${event}:error`, {
                code: "INVALID_PAYLOAD",
                message: "Invalid event payload",
                issues: result.error.issues
            });
            return;
        }
        await handler(result.data).catch(err => {
            console.error(`Error handling ${event}:`, err);
            socket.emit(`${event}:error`, {
                code: "INTERNAL_ERROR",
                message: "Something went wrong",
            });
        });
    })
    
}

function registerEvents(io: Server, socket: Socket) {
    
    registerRoomEvents(io, socket);

}

export {
    registerEvent,
    registerEvents
}
