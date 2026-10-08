import webSocketService from "@/lib/WebSocketService";
import { useRoomStore } from "@/store/roomStore";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

type RoomSocketHookType = (webSocketUrl: string | null, roomId: string, userId: string | null, onRoomStarted: () => void) => {
    socket: Socket | null,
    isConnected: boolean,
}

export const useRoomWebSocket: RoomSocketHookType = (
    webSocketUrl,
    roomId,
    userId,
    onRoomStarted
) => {

    const {
        setParticipants,
        addParticipant
    } = useRoomStore();

    const { user } = useUserStore();

    useEffect(() => {

        if (!webSocketUrl || !userId) return;

        const socket = webSocketService.connect(webSocketUrl);

        const handleRoomStarted = async () => {
            await onRoomStarted();
        };

        const handleRoomState = (data: any) => {
            setParticipants(data.participants || []);
        };

        const handleUserJoined = (data: any) => {
            addParticipant(data);
            toast.success(`${data.displayName} joined the room`);
        };

        const handleJoinError = (data: any) => {
            toast.error(data.message);
        };

        webSocketService.on(
            'room:started',
            handleRoomStarted
        );

        webSocketService.on(
            'room:state',
            handleRoomState
        );

        webSocketService.on(
            'room:user_joined',
            handleUserJoined
        );

        webSocketService.on(
            'room:join:error',
            handleJoinError
        );

        const joinRoom = () => {
            webSocketService.emit('room:join', {
                roomId,
                userId,
                displayName: user?.name || 'Guest User'
            });
        };

        if (socket.connected) {
            joinRoom();
        } else {
            socket.on('connect', joinRoom);
        }

        return () => {
            webSocketService.off(
                'room:started',
                handleRoomStarted
            );

            webSocketService.off(
                'room:state',
                handleRoomState
            );

            webSocketService.off(
                'room:user_joined',
                handleUserJoined
            );

            webSocketService.off(
                'room:join:error',
                handleJoinError
            );

            socket.off('connect', joinRoom);
        };

    }, [
        webSocketUrl,
        roomId,
        userId,
        user?.name,
        setParticipants,
        addParticipant
    ]);

    return {
        socket: webSocketService.getSocket(),
        isConnected: webSocketService.isConnected(),
    };
};