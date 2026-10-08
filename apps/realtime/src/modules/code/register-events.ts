import type { Server, Socket } from "socket.io";

import { registerEvent } from "../websocket/register-event";
import codeEvents from "./events";

export function registerCodeEvents(
    io: Server,
    socket: Socket
) {
    codeEvents.forEach(({ event, schema, handler }) => {
        registerEvent(
            socket,
            event,
            schema,
            (data: any) => handler(io, socket, data)
        );
    });
}