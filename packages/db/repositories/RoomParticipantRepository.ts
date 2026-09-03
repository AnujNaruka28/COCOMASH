import { prisma } from "../src/client.js";
import { Prisma } from "../src/generated/prisma/client.js";

class RoomParticipantRepository {
    
    async createParticipant(
        data: Prisma.RoomParticipantCreateInput
    ) {
        return prisma.roomParticipant.create({
            data
        });
    }

    async findParticipantByRoomIdAndUserId(
        roomId: string,
        userId: string
    ) {
        return prisma.roomParticipant.findFirst({
            where: {
                room_id: roomId,
                user_id: userId
            }
        });
    }
};

const roomParticipantRepository = new RoomParticipantRepository();

export default roomParticipantRepository;