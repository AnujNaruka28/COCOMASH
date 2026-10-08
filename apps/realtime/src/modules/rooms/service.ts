import { roomRepository } from "@repo/db";

class RoomService {
    
    joinRoom = async (
        roomId: string, 
        userId: string, 
        displayName: string
    ) => roomRepository.joinRoom(roomId, userId, displayName);
    
    startRoom = async (roomId: string) => roomRepository.startRoom(roomId);

    getRoom = async (roomId: string) => roomRepository.getRoom(roomId); 
    
}

export const roomService = new RoomService();