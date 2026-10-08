"use client";

import { AvatarGroup } from "@/features/rooms/components/AvatarGroup";
import GearButton from "@/components/common/GearButton";
import { RadialMenu } from "@/components/ui/radial-menu";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useRoomMenu } from "../hooks/useRoomMenu";
import ModalComponents from "../components/ModalComponents";
import dynamic from "next/dynamic";
import type { Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import LanguageDropDown from "./LanguageDropDown";
import webSocketService from "@/lib/WebSocketService";
import { useUserStore } from "@/store/userStore";

const CollaborativeCodeMirror = dynamic(
  () => import("./CollaborativeCodeMirror"),
  { ssr: false }
);

interface EditorRoomProps {
  socket: Socket;
  roomId: string;
  roomName: string;
  isCreator: boolean;
}

const EditorRoom = ({ socket, roomId, roomName, isCreator }: EditorRoomProps) => {

  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javaScript");
  const { userId } = useUserStore();

  const {
    menuItems,
    handleMenuSelect,
    whiteboardOpen,
    terminalOpen,
    chatOpen,
    handleTerminal,
    handleChat,
  } = useRoomMenu();
  
  useEffect(() => {
    
    const handleLanguageChanged = ({ language } : { language: string }) => setSelectedLanguage(language)
    socket.on("room:language:changed", handleLanguageChanged);
    
    return () => {
      socket.off("room:language:changed", handleLanguageChanged);
    }

  }, [socket])


  const handleLanguageChange = (language: string) => {
    webSocketService.emit("room:language:change", {
      roomId,
      userId,
      language,
    });
  }

  return (
    <main className="w-full h-full flex flex-col">
      <nav className="w-full flex items-center justify-between px-4 py-0 bg-neutral-600">
        <header className="flex-2 h-full text-white flex items-center justify-center">
          <h1 className="w-full font-bold leading-tight">
            <Input 
              value={roomName} 
              readOnly 
              className="bg-none shadow-none border-0" 
            />
          </h1>
        </header>
        <div className="flex-1 flex gap-2 items-center justify-around">
          <AvatarGroup />
          <GearButton size={32} />
        </div>
      </nav>

      <div className="h-10 bg-[#252526] border-b border-[#333] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 h-8 text-sm flex items-center gap-2">
            <Play className="w-4 h-4" />
            Run
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Language:</span>
            <LanguageDropDown 
            value={selectedLanguage}
            onChange={handleLanguageChange}
            isDisabled={!isCreator} />
          </div>

        </div>
      </div>

      <ResizablePanelGroup orientation="vertical" className="flex-1 min-h-0">
        
        <ResizablePanel defaultSize="90%">
          <div className="relative w-full h-full" ref={editorRef}>
            {roomId && socket && (
              <CollaborativeCodeMirror roomId={roomId} socket={socket} />
            )}

            <motion.div
              className="absolute bottom-8 left-8 z-50"
              drag
              dragConstraints={editorRef}
              dragElastic={0.1}
              whileDrag={{ scale: 1.1 }}
            >
              <RadialMenu menuItems={menuItems} onSelect={handleMenuSelect} size={200}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.28">
                    <path d="M6.5 2C4.01472 2 2,4.01472 2 6.5C2 8.98528 4.01472 11 6.5 11C8.98528 11 11,8.98528 11 6.5C11 4.01472 8.98528 2 6.5 2Z" fill="#111111" />
                    <path d="M17.5 13C15.0147 13 13,15.0147 13 17.5C13 19.9853 15.0147 22,17.5 22C19.9853 22 22,19.9853 22 17.5C22 15.0147 19.9853 13,17.5 13Z" fill="#111111" />
                  </g>
                  <path d="M17.5 2C15.0147 2 13,4.01472 13 6.5C13 8.98528 15.0147 11,17.5 11C19.9853 11 22,8.98528 22 6.5C22 4.01472 19.9853 2 17.5 2Z" fill="#111111" />
                  <path d="M6.5 13C4.01472 13 2,15.0147 2 17.5C2 19.9853 4.01472 22,6.5 22C8.98528 22 11,19.9853 11 17.5C11 15.0147 8.98528 13,6.5 13Z" fill="#111111" />
                </svg>
              </RadialMenu>
            </motion.div>
          </div>
        </ResizablePanel>

        {terminalOpen && (
          <ResizableHandle className="bg-[#333] hover:bg-[#444] transition-colors mx-auto" withHandle />
        )}

        <ResizablePanel 
          defaultSize={terminalOpen ? "10%" : "0%"} 
          className={`${terminalOpen ? "w-full" : ""}`}
        >
          {terminalOpen && (
            <ModalComponents
              whiteboardOpen={whiteboardOpen}
              terminalOpen={terminalOpen}
              chatOpen={chatOpen}
              setTerminalOpen={handleTerminal}
              setChatOpen={handleChat}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default EditorRoom;
