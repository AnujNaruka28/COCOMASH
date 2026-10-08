import { prisma } from "../src/client.js";
class RoomParticipantRepository {
    async createParticipant(data) {
        return prisma.roomParticipant.create({
            data
        });
    }
    async findParticipantByRoomIdAndUserId(roomId, userId) {
        return prisma.roomParticipant.findFirst({
            where: {
                room_id: roomId,
                user_id: userId
            }
        });
    }
}
;
const roomParticipantRepository = new RoomParticipantRepository();
export default roomParticipantRepository;
