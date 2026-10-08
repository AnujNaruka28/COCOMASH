import { Prisma } from "../src/generated/prisma/client.js";
declare class RoomRepository {
    createRoomWithCreator(roomData: Omit<Prisma.RoomCreateInput, 'creator'>, creatorId: string, displayName: string): Promise<{
        room: {
            id: string;
            name: string | null;
            room_type: import("../src/generated/prisma/enums.js").RoomType;
            status: import("../src/generated/prisma/enums.js").RoomStatus;
            max_participants: number;
            created_at: Date;
            started_at: Date | null;
            ended_at: Date | null;
            expires_at: Date;
            creator_id: string;
        };
        participant: {
            id: string;
            status: import("../src/generated/prisma/enums.js").ParticipantStatus;
            display_name: string;
            role: import("../src/generated/prisma/enums.js").ParticipantRole;
            joined_at: Date;
            left_at: Date | null;
            room_id: string;
            user_id: string;
        };
        user: any;
    }>;
    getAllRooms(offset?: number, limit?: number): Promise<{
        rooms: ({
            _count: {
                participants: number;
            };
        } & {
            id: string;
            name: string | null;
            room_type: import("../src/generated/prisma/enums.js").RoomType;
            status: import("../src/generated/prisma/enums.js").RoomStatus;
            max_participants: number;
            created_at: Date;
            started_at: Date | null;
            ended_at: Date | null;
            expires_at: Date;
            creator_id: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findRoomWithParticipantCount(roomId: string): Promise<({
        _count: {
            participants: number;
        };
    } & {
        id: string;
        name: string | null;
        room_type: import("../src/generated/prisma/enums.js").RoomType;
        status: import("../src/generated/prisma/enums.js").RoomStatus;
        max_participants: number;
        created_at: Date;
        started_at: Date | null;
        ended_at: Date | null;
        expires_at: Date;
        creator_id: string;
    }) | null>;
    joinRoom(roomId: string, userId: string, displayName: string): Promise<{
        participant: {
            user: {
                id: string;
                profile_url: string | null;
            };
        } & {
            id: string;
            status: import("../src/generated/prisma/enums.js").ParticipantStatus;
            display_name: string;
            role: import("../src/generated/prisma/enums.js").ParticipantRole;
            joined_at: Date;
            left_at: Date | null;
            room_id: string;
            user_id: string;
        };
        participants: ({
            user: {
                id: string;
                profile_url: string | null;
            };
        } & {
            id: string;
            status: import("../src/generated/prisma/enums.js").ParticipantStatus;
            display_name: string;
            role: import("../src/generated/prisma/enums.js").ParticipantRole;
            joined_at: Date;
            left_at: Date | null;
            room_id: string;
            user_id: string;
        })[];
    } | null>;
    startRoom(roomId: string): Promise<{
        id: string;
        name: string | null;
        room_type: import("../src/generated/prisma/enums.js").RoomType;
        status: import("../src/generated/prisma/enums.js").RoomStatus;
        max_participants: number;
        created_at: Date;
        started_at: Date | null;
        ended_at: Date | null;
        expires_at: Date;
        creator_id: string;
    }>;
}
declare const roomRepository: RoomRepository;
export default roomRepository;
//# sourceMappingURL=RoomRepository.d.ts.map