"use client";

import { lazy, Suspense } from "react";
import Loading from "loading";

const Whiteboard = lazy(() => import("./Whiteboard"));
const Terminal = lazy(() => import("./TerminalWindow"));
const Chat = lazy(() => import("./Chat"));

interface ModalComponentsProps {
  whiteboardOpen: boolean;
  terminalOpen: boolean;
  chatOpen: boolean;
  setTerminalOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
}

export default function ModalComponents({
  whiteboardOpen,
  terminalOpen,
  chatOpen,
  setTerminalOpen,
  setChatOpen,
}: ModalComponentsProps) {
  return (
    <>
      {whiteboardOpen && (
        <Suspense fallback={<Loading />}>
          <div className="fixed top-20 right-20 w-[800px] h-[600px] bg-neutral-900 rounded-lg shadow-2xl z-[10000] flex items-center justify-center transition-all duration-300">
            <Whiteboard isOpen={whiteboardOpen}/>
          </div>
        </Suspense>
      )}
      {terminalOpen && (
        <Suspense fallback={<Loading />}>
          <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
        </Suspense>
      )}
      {chatOpen && (
        <Suspense fallback={<Loading />}>
          <Chat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
