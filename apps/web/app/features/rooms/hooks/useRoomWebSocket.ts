import webSocketService from "@/lib/WebSocketService";
import { useRoomStore } from "@/store/roomStore";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

type RoomSocketHookType = (webSocketUrl: string | null, roomId: string, userId: string | null) => {
    socket: Socket | null,
    isConnected: boolean,
}

export const useRoomWebSocket: RoomSocketHookType = (webSocketUrl: string | null, roomId: string, userId: string | null) => {

    const { setStarted, setParticipants, addParticipant } = useRoomStore();
    const { user } = useUserStore();

    useEffect(() => {

        if(!webSocketUrl || !userId) return;

        const socket = webSocketService.connect(webSocketUrl);

        const handleRoomStarted = () => setStarted(true);

        const handleRoomState = (data: any) => setParticipants(data.participants || []);
        
        const handleUserJoined = (data: any) => {
            addParticipant(data);
            toast.success(`${data.displayName} joined the room`);
        }

        const handleJoinError = (data: any) => toast.error(data.message);
        

        // webSocketService.on('room:started', handleRoomStarted);
        webSocketService.on('room:state', handleRoomState);
        webSocketService.on('room:user_joined', handleUserJoined);
        webSocketService.on('room:join:error', handleJoinError);

        if (socket.connected) {
            webSocketService.emit('room:join', { 
                roomId, 
                userId,
                displayName: user?.name || 'Guest User'
            });
        } else {
            socket.on('connect', () => {
                webSocketService.emit('room:join', { 
                    roomId, 
                    userId,
                    displayName: user?.name || 'Guest User'
                });
            });
        }

        return () => {
            // webSocketService.off('room:started', handleRoomStarted);
            webSocketService.off('room:state', handleRoomState);
            webSocketService.off('room:user_joined', handleUserJoined);
            webSocketService.off('room:join:error', handleJoinError);
        }

    },[webSocketUrl, roomId, userId, user?.name, setStarted, setParticipants, addParticipant]);

    return {
        socket: webSocketService.getSocket(),
        isConnected: webSocketService.isConnected(),
    };

};

