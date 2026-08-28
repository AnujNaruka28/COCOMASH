
import { prisma, Prisma } from "@repo/db";

class RoomRepository {
    
    async createRoomWithCreator(
        roomData : Prisma.RoomCreateInput,
        creatorId: string,
        displayName: string
    ) {

        return prisma.$transaction(async (tx) => {

            const room = await tx.room.create({
                data: roomData
            });

            const participant = await tx.roomParticipant.create({
                data: {
                    room_id: room.id,
                    user_id: creatorId,
                    display_name: displayName,
                    role: 'creator',
                    status: 'active'
                }
            })
            
            return { room, participant }
        });
    }

    async getAllRooms(offset: number = 0, limit: number = 10) {
        
        const [rooms, total] = await Promise.all([
            prisma.room.findMany({
                skip: offset,
                take: limit,
                include: {
                    _count: {
                        select: { participants: true },
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
            }),
            prisma.room.count()
        ]);
        
        return {
            rooms,
            total,
            page: Math.floor(offset / limit) + 1,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    async findRoomWithParticipantCount(roomId: string) {
        return prisma.room.findUnique({
            where: { id: roomId },
            include: {
                _count: {
                    select: { participants: true },
                },
            },
        });
    }
};

const roomRepository = new RoomRepository();
export default roomRepository;