import type { Server, Socket } from "socket.io";
import { CodeChangeDTO, CodeStateRequestDTO, CodeAwarenessDTO } from "./dto";
import { getDocumentState, saveDocumentState } from "./document-manager";


async function handleCodeChange(
    _io: Server,
    socket: Socket,
    data: CodeChangeDTO
) {

    const { roomId, update } = data;

    await saveDocumentState(roomId, update);

    socket.to(roomId).emit('code:sync', { update });

}

// socket handler — emits the real binary state under `update`, not `content`
async function handleCodeStateRequest(
    _io: Server,
    socket: Socket,
    data: CodeStateRequestDTO
) {
    const { roomId } = data;
    const state = await getDocumentState(roomId);
    // state is `null` only when nothing exists yet — an empty-but-real doc
    // still returns a (short) non-null Uint8Array, so this check is now correct.
    if (state) {
        socket.emit('code:state', { update: state });
    }
}

async function handleCodeAwareness(
    _io: Server,
    socket: Socket,
    data: CodeAwarenessDTO
) {
    const { roomId, update } = data;
    socket.to(roomId).emit('code:awareness:sync', { update });
}

export {
    handleCodeChange,
    handleCodeStateRequest,
    handleCodeAwareness
}

