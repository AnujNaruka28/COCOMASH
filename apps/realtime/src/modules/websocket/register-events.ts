
import type { Server, Socket } from "socket.io";
import { registerRoomEvents } from "../rooms/register-events";
import { registerCodeEvents } from "../code/register-events";

export function registerEvents(io: Server, socket: Socket) {
    
    registerRoomEvents(io, socket);
    registerCodeEvents(io, socket);

}
