import { Server, ServerOptions } from 'socket.io';
import { ENV } from '../../config/env';
import { registerEvents } from './register-events';


function createSocketServer() {
    const io = new Server({
        cors: {
            origin: ENV.WEB_URL,
        },
    } as ServerOptions);

    io.on("connection", (socket) => {
        registerEvents(io, socket);
    });

    return io;
} 

export default createSocketServer;