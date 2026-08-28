
import type { Server, Socket } from "socket.io";
import { roomService } from "./service";
import { RoomJoinDTO } from "./dto";

async function handleRoomJoin(
    io: Server,
    socket: Socket,
    data: RoomJoinDTO
) {
    const participant = await roomService.joinRoom(
        data.roomId, 
        socket.data.userId, 
        data.displayName
    );

    if (!participant) {
        socket.emit("room:join:error", { 
            code: "JOIN_FAILED",
            message: "Failed to join room"
        });
        return;
    }

    socket.join(data.roomId);
    
    io.to(data.roomId).emit("room:user_joined", participant);

}

export {
    handleRoomJoin
}
