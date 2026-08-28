
import { roomJoinSchema } from "./dto";
import { handleRoomJoin } from "./handlers";

const roomEvents = [
    {
        event: "room:join",
        schema: roomJoinSchema,
        handler: handleRoomJoin,
    }
]

export default roomEvents;
