"use client"

import { useEffect, useState } from "react";
import Loading from "loading";
import { useRoomInitialization } from "../hooks/useRoomInitialization"
import { useRoomWebSocket } from "../hooks/useRoomWebSocket"
import RoomModal from "./RoomModal";
import { RoomJoinModal } from "./RoomJoinModal";
import { useUserStore } from "@/store/userStore";
import dynamic from "next/dynamic";

const EditorComponent = dynamic(() => import("@/features/editor/components/EditorRoom"), {
    ssr: false
});

const Room = ( { roomId }: {
    roomId: string;
} ) => {

    const { roomData, websocketUrl, isLoading, refetchRoom } = useRoomInitialization(roomId);
    const { setUser } = useUserStore();
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [isUserReady, setIsUserReady] = useState(false);

    useEffect(() => {
        const storage = process.env.NODE_ENV === 'development' ? sessionStorage : localStorage;
        const storedUserId = storage.getItem('userId');
        const storedUserName = storage.getItem('userName');
        
        if (storedUserId && storedUserName) {
            setUser({
                id: storedUserId,
                name: storedUserName,
                email: null,
                profile_url: storage.getItem('profileImage') || null
            });
            setIsUserReady(true);
        } else {
            setShowJoinModal(true);
        }

    }, [setUser]);

    const handleJoinSuccess = () => {
        setIsUserReady(true);
        setShowJoinModal(false);
    };

    const shouldConnectWebSocket = isUserReady && websocketUrl;
    
    const { userId } = useUserStore();
    
    const { socket } = useRoomWebSocket(websocketUrl, roomId, shouldConnectWebSocket ? userId : null, refetchRoom);

    if(isLoading) return <Loading /> ;

    const isCreator = !!userId && userId === roomData?.data?.data?.creator_id;

    if (roomData?.data?.data?.status === 'active') {
        return (
        <>

            {
                socket && (
                    <EditorComponent
                        socket={socket}
                        roomId={roomId}
                        roomName={roomData?.data?.data?.name || ""}
                        isCreator={isCreator}
                    />
                )
            }
            <RoomJoinModal
                isOpen={showJoinModal}
                onJoinSuccess={handleJoinSuccess}
            />

        </>
        );
    }

    return (
        <>
            <RoomModal 
                status={roomData?.data?.data?.status || "waiting"} 
                roomId={roomId} 
                isCreator={isCreator} 
            />
            <RoomJoinModal 
                isOpen={showJoinModal} 
                onJoinSuccess={handleJoinSuccess}
            />
        </>
    );
}

export default Room;