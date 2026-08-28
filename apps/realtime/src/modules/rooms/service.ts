import { roomParticipantRepository, roomRepository } from "@repo/db";

class RoomService {
    
    async joinRoom(
        roomId: string, 
        userId: string, 
        displayName: string
    ) {

        const roomWithParticipantCount = await roomRepository.findRoomWithParticipantCount(roomId);
        
        if(!roomWithParticipantCount) return null;

        const exisitngParticipant = await roomParticipantRepository.findParticipantByRoomIdAndUserId(roomId, userId);

        if(exisitngParticipant) return exisitngParticipant;

        const { _count : { participants }, max_participants: maxParticipants } = roomWithParticipantCount;

        if(participants >= maxParticipants) return null;

        const role = roomWithParticipantCount.creator_id === userId ? 'creator' : 'joiner';
        
        const participant = await roomParticipantRepository.createParticipant({
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
            status: 'active'
        });
        return participant;
    }
}

export const roomService = new RoomService();