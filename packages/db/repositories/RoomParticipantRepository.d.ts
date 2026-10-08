import { Prisma } from "../src/generated/prisma/client.js";
declare class RoomParticipantRepository {
    createParticipant(data: Prisma.RoomParticipantCreateInput): Promise<{
        id: string;
        status: import("../src/generated/prisma/enums.js").ParticipantStatus;
        display_name: string;
        role: import("../src/generated/prisma/enums.js").ParticipantRole;
        joined_at: Date;
        left_at: Date | null;
        room_id: string;
        user_id: string;
    }>;
    findParticipantByRoomIdAndUserId(roomId: string, userId: string): Promise<{
        id: string;
        status: import("../src/generated/prisma/enums.js").ParticipantStatus;
        display_name: string;
        role: import("../src/generated/prisma/enums.js").ParticipantRole;
        joined_at: Date;
        left_at: Date | null;
        room_id: string;
        user_id: string;
    } | null>;
}
declare const roomParticipantRepository: RoomParticipantRepository;
export default roomParticipantRepository;
//# sourceMappingURL=RoomParticipantRepository.d.ts.map