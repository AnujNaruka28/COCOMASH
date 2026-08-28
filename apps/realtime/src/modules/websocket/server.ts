import { Server } from 'socket.io';
import { ENV } from '../../config/env';
import { registerEvents } from './register-events';


function createSocketServer() {
    const io = new Server({
        cors: {
            origin: ENV.WEB_URL,
        },
    });

    io.on("connection", (socket) => {
        registerEvents(io, socket);
    });

    return io;
} 

export default createSocketServer;