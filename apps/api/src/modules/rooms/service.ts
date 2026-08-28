import { roomRepository } from "@repo/db";
import { NotFoundError } from "../../common/utils/AppError.js";

class RoomService {
    
    async createRoom(roomData: any, creatorId: string) {

        const { displayName, ...coreRoomData } = roomData;

        const { room, participant } = await roomRepository.createRoomWithCreator(
            coreRoomData, 
            creatorId, 
            displayName
        );

        return { 
            room, 
            participant,
            websocket_url: `/ws/rooms/${room.id}`
        };

    }

    async getAllRooms(page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;
        return await roomRepository.getAllRooms(offset, limit);
    }

    async getRoomById(roomId: string) {
        const room = await roomRepository.findRoomWithParticipantCount(roomId);
        
        if (!room) {
            throw new NotFoundError('Room not found');
        }

        return {
            ...room,
            participant_count: room._count.participants,
        };
    }
    
}

const roomService = new RoomService();
export default roomService;