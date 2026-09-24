import { useEffect } from 'react';
import { useRoomStore } from '@/store/roomStore';
import { useGetRoom } from '../services/roomService';

export const useRoomInitialization = (roomId: string) => {
  const { websocketUrl, setWebSocketUrl, isLoading } = useRoomStore();
  const { data: roomData, isLoading: isRoomLoading } = useGetRoom(roomId);

  useEffect(() => {
    if (!websocketUrl && roomId) {
      const wsBaseUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL!;
      setWebSocketUrl(wsBaseUrl);
    }
  }, [roomId, websocketUrl, setWebSocketUrl]);

  return {
    websocketUrl,
    roomData,
    roomId,
    isLoading: isRoomLoading || isLoading,
  };
};
