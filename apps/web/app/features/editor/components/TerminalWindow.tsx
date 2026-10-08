"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { X } from "lucide-react";

import "@xterm/xterm/css/xterm.css";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TerminalWindow({ isOpen, onClose }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);

  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      const term = new (Terminal as any)();
      
      term.open(terminalRef.current);
      term.write('Welcome to Terminal\r\n');
      term.write('Ready for commands...\r\n$ ');
      
      xtermRef.current = term;
    }

    return () => {
      if (xtermRef.current) {
        xtermRef.current.dispose();
        xtermRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#333]">
        <span className="text-white text-sm font-medium">Terminal</span>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          title="Close Terminal"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div 
        ref={terminalRef} 
        className="flex-1 p-4 overflow-auto h-full [&>div]:h-full"
      />
    </div>
  );
}
