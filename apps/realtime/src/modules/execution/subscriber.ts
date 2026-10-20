import { getRedisClient } from '@repo/config';
import { Server as SocketIOServer } from 'socket.io';

const roomSubscriptions = new Map<string, any>();

async function subscribeToRoomExecution(
    io: SocketIOServer,
    roomId: string
) {

    if(roomSubscriptions.has(roomId)) return;

    const subscriber = getRedisClient().duplicate();

    try {
        
        await subscriber.connect();
        
        const channel = `room:${roomId}:execution`;
        
        await subscriber.subscribe(channel, (message) => {

            try {
                
                const result = JSON.parse(message);
                io.to(roomId).emit("execution:result", result);

            } catch (error) {

                console.error('Failed to parse execution result:', error);

            }

        });

        roomSubscriptions.set(roomId, subscriber);

    } catch (error) {
        
        console.error('Failed to subscribe to room execution:', error);
        await subscriber.quit();

    }

}

async function unsubscribeFromRoomExecution(roomId: string) {

    const subscriber = roomSubscriptions.get(roomId);

    if(subscriber) {
        await subscriber.quit();
        roomSubscriptions.delete(roomId);
    }
}

export {
    subscribeToRoomExecution,
    unsubscribeFromRoomExecution
}
