import type { Server, Socket } from "socket.io";

import { registerEvent } from "../websocket/register-event";
import roomEvents from "./events";

export function registerRoomEvents(
    io: Server,
    socket: Socket
) {
    roomEvents.forEach(({ event, schema, handler }) => {
        registerEvent(
            socket,
            event,
            schema,
            (data) => handler(io, socket, data)
        );
    });
}