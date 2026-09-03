import { roomRepository } from "@repo/db";
import { NotFoundError } from "../../common/utils/AppError.js";
import { CreateRoomDto } from "./dto.js";

class RoomService {
    
    async createRoom(roomData: CreateRoomDto, creatorId: string) {

        const { display_name, ...coreRoomData } = roomData;

        const expiresAt = new Date(Date.now() + 45 * 60 * 1000);

        const { room, participant } = await roomRepository.createRoomWithCreator(
            {
                ...coreRoomData,
                expires_at: expiresAt
            }, 
            creatorId, 
            display_name
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