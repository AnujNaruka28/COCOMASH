import { roomRepository } from "@repo/db";

class RoomService {
    
    async joinRoom(
        roomId: string, 
        userId: string, 
        displayName: string
    ) {

        return roomRepository.joinRoom(roomId, userId, displayName);

    }
}

export const roomService = new RoomService();