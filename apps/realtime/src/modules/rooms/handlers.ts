
import type { Server, Socket } from "socket.io";
import { roomService } from "./service";
import { RoomJoinDTO } from "./dto";
import { dummyAvatar } from "../../common/utils/dummyAvatar";

async function handleRoomJoin(
    _io: Server,
    socket: Socket,
    data: RoomJoinDTO,
) {
    const result = await roomService.joinRoom(
        data.roomId, 
        socket.data.userId, 
        data.displayName
    );

    if (!result) {
        socket.emit("room:join:error", { 
            code: "JOIN_FAILED",
            message: "Failed to join room"
        });
        return;
    }

    socket.join(data.roomId);

    const participants = result.participants.map(p => ({
        id: p.id,
        displayName: p.display_name,
        profileImage: p.user?.profile_url || dummyAvatar(p.display_name),
    }));

    const newParticipant = {
        id: result.participant.id,
        displayName: result.participant.display_name,
        profileImage: result.participant.user?.profile_url || dummyAvatar(result.participant.display_name)
    }

    socket.emit("room:state", {
        participants
    })
    
    socket.to(data.roomId).emit("room:user_joined", newParticipant);

}

export {
    handleRoomJoin
}
