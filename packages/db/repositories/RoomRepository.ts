
import { prisma } from "../src/client.js";
import { Prisma } from "../src/generated/prisma/client.js";

class RoomRepository {
    
    async createRoomWithCreator(
        roomData : Omit<Prisma.RoomCreateInput, 'creator'>,
        creatorId: string,
        displayName: string
    ) {

        return prisma.$transaction(async (tx) => {

            let userId: string = creatorId;
            if(!creatorId) {
                const user = await tx.user.create({
                    data: {
                        name: displayName
                    }
                })
                userId = user.id;
            }

            const room = await tx.room.create({
                data: {
                    ...roomData,
                    creator: {
                        connect: {
                            id: userId
                        }
                    }
                },
            });

            const participant = await tx.roomParticipant.create({
                data: {
                    room_id: room.id,
                    user_id: userId,
                    display_name: displayName,
                    role: 'creator',
                    status: 'active'
                }
            })
            
            return { room, participant }
        },{
            maxWait: 8000,
            timeout: 10000
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

    async joinRoom(
        roomId: string, 
        userId: string, 
        displayName: string
    ) {

        return prisma.$transaction(async (tx) => {
            
            const rooms = await tx.$queryRaw<{
                id: string,
                creator_id: string,
                max_participants: number
            }[]>`
            SELECT 
            id,
            creator_id,
            max_participants
            FROM rooms
            WHERE id = ${roomId}
            FOR UPDATE;
            `;

            const room = rooms[0];

            if(!room) return null;

            const existingParticipant = await tx.roomParticipant.findFirst({
                where: {
                    room_id: room.id,
                    user_id: userId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            profile_url: true
                        }
                    }
                }
            });

            if(existingParticipant) {
                            
                const participants = await tx.roomParticipant.findMany({
                    where: {
                        room_id: room.id,
                        status:  "active"
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                profile_url: true
                            }
                        }
                    }
                });

                return {participant: existingParticipant, participants};
            }

            const participantCount = await tx.roomParticipant.count({
                where:{
                    room_id: room.id,
                    status: "active"
                }
            });

            if(participantCount >= room.max_participants) return null;

            const role = room.creator_id === userId ? 'creator' : 'joiner';

            const participant = await tx.roomParticipant.create({
                data: {
                    room: {
                        connect: {
                            id: roomId
                        }
                    },
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    display_name: displayName,
                    role,
                    status: 'active',
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            profile_url: true
                        }
                    }
                }
            });

            const participants = await tx.roomParticipant.findMany({
                where: {
                    room_id: room.id,
                    status:  "active"
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            profile_url: true
                        }
                    }
                }
            });

            return {
                participant,
                participants
            };

        },{
            maxWait: 8000,
            timeout: 10000
        });

    }
};

const roomRepository = new RoomRepository();
export default roomRepository;