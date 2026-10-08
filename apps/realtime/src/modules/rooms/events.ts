
import { roomJoinSchema, roomLanguageChangeSchema, roomStartSchema } from "./dto";
import { handleRoomJoin, handleRoomLanguageChange, handleRoomStart } from "./handlers";

const roomEvents = [
    {
        event: "room:join",
        schema: roomJoinSchema,
        handler: handleRoomJoin,
    },
    {
        event: "room:start",
        schema: roomStartSchema,
        handler: handleRoomStart,
    },
    {
        event: "room:language:change",
        schema: roomLanguageChangeSchema,
        handler: handleRoomLanguageChange,
    }
]

export default roomEvents;
