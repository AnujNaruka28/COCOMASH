"use client"

import { useEffect, useState } from "react";
import Loading from "loading";
import { useRoomInitialization } from "../hooks/useRoomInitialization"
import { useRoomWebSocket } from "../hooks/useRoomWebSocket"
import RoomModal from "./RoomModal";
import { RoomJoinModal } from "./RoomJoinModal";
import Editor from "@/features/editor/components/Editor";
import { useRoomStore } from "@/store/roomStore";
import { useUserStore } from "@/store/userStore";

interface RoomProps {
    roomId: string;
}

const Room = ( { roomId }: RoomProps ) => {

    const { websocketUrl, isLoading } = useRoomInitialization(roomId);
    const { isStarted } = useRoomStore();
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
    
    useRoomWebSocket(websocketUrl, roomId, shouldConnectWebSocket ? userId : null);

    if(isLoading) return <Loading /> ;

    if(isStarted) return <Editor /> ;

    return (
        <>
            <RoomJoinModal 
                isOpen={showJoinModal} 
                onJoinSuccess={handleJoinSuccess}
            />
            {!showJoinModal && <RoomModal websocketUrl={websocketUrl || ""} roomId={roomId} />}
        </>
    );
}

export default Room;