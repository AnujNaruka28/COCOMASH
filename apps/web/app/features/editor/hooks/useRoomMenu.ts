import { useState, useMemo, useCallback } from "react";
import { IoMicOffCircleOutline, IoMicCircleOutline } from "react-icons/io5";
import { TbCamera, TbCameraOff } from "react-icons/tb";
import { baseMenuItems } from "../utils/menuItems";

interface MenuItem {
  id: number;
  label: string;
  icon: React.ComponentType<any>;
  handler?: () => void;
  state?: 'on' | 'off';
}

interface UseRoomMenuHookReturn {
  menuItems: MenuItem[];
  handleMenuSelect: (item: any) => void;
  micState: 'on' | 'off';
  cameraState: 'on' | 'off';
  handleMicToggle: () => void;
  handleCameraToggle: () => void;
  whiteboardOpen: boolean;
  terminalOpen: boolean;
  chatOpen: boolean;
  handleTerminal: () => void;
  handleWhiteboard: () => void;
  handleChat: () => void;
}

export function useRoomMenu(): UseRoomMenuHookReturn {
  const [micState, setMicState] = useState<'on' | 'off'>('off');
  const [cameraState, setCameraState] = useState<'on' | 'off'>('off');
  const [whiteboardOpen, setWhiteboardOpen] = useState<boolean>(false);
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false);
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  const handleMicToggle = useCallback(() => {
    setMicState(prev => {
      const newState = prev === 'on' ? 'off' : 'on';
      console.log('Mic toggled:', newState);
      return newState;
    });
  }, []);

  const handleCameraToggle = useCallback(() => {
    setCameraState(prev => {
      const newState = prev === 'on' ? 'off' : 'on';
      console.log('Camera toggled:', newState);
      return newState;
    });
  }, []);

  const handleTerminal = useCallback(() => setTerminalOpen(prev => !prev), []);
  const handleWhiteboard = useCallback(() => setWhiteboardOpen(prev => !prev), []);
  const handleChat = useCallback(() => setChatOpen(prev => !prev), []);
  const handleEndCall = useCallback(() => {
    console.log('Call ended');
  }, []);

  const menuItems = useMemo(() => {
    return baseMenuItems.map(item => {
      switch (item.id) {
        case 1:
          return { ...item, handler: handleChat };
        case 2:
          return { 
            ...item, 
            icon: micState === 'on' ? IoMicCircleOutline : IoMicOffCircleOutline, 
            state: micState, 
            handler: handleMicToggle 
          };
        case 3:
          return { ...item, handler: handleTerminal };
        case 4:
          return { ...item, handler: handleWhiteboard };
        case 5:
          return { ...item, handler: handleEndCall };
        case 6:
          return { 
            ...item, 
            icon: cameraState === 'on' ? TbCamera : TbCameraOff, 
            state: cameraState, 
            handler: handleCameraToggle 
          };
        default:
          return item;
      }
    });
  }, [micState, cameraState, handleChat, handleTerminal, handleWhiteboard, handleEndCall, handleMicToggle, handleCameraToggle]);

  const handleMenuSelect = useCallback((item: any) => {
    console.log('Selected:', item);
  }, []);

  return {
    menuItems,
    handleMenuSelect,
    micState,
    cameraState,
    handleMicToggle,
    handleCameraToggle,
    whiteboardOpen,
    terminalOpen,
    chatOpen,
    handleTerminal,
    handleWhiteboard,
    handleChat,
  };
};
