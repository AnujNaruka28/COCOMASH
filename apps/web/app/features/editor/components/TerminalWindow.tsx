"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { X } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

import "@xterm/xterm/css/xterm.css";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
  error?: string;
}

export default function TerminalWindow({ 
  isOpen, 
  onClose, 
  status = 'pending', 
  output = '', 
  error 
}: TerminalProps) {

  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [terminalReady, setTerminalReady] = useState<boolean>(false);

  useEffect(() => {

    const container = terminalRef.current;

    if(!isOpen || !container) return ;
    
    const term = new Terminal({

      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
        cursorAccent: '#ffffff',
        selectionBackground: '#264f78',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#ffffff',
      },
      
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 14,
      cursorBlink: true,
      convertEol: true,
      scrollback: 1000
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(container);
      
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    const fitTerminal = () => {
      if (
        xtermRef.current === term &&
        container.clientWidth > 0 &&
        container.clientHeight > 0
      ) {
        fitAddon.fit();
      }
    };

    const observer = new ResizeObserver(fitTerminal);
    observer.observe(container);

    requestAnimationFrame(() => {

      fitTerminal();

      if(xtermRef.current === term) {
        setTerminalReady(true);
      }
    });

    return () => {

      observer.disconnect();
      term.dispose();
      
      if(xtermRef.current === term) {
        xtermRef.current = null;
        fitAddonRef.current = null;
      }

      setTerminalReady(false);

    };
  }, [isOpen]);

  useEffect(() => {

    const terminal = xtermRef.current;

    if (!isOpen || !terminalReady || !terminal) return;

    terminal.reset();

    if (output) terminal.write(output);

    if (error) {
      terminal.write('\r\n\x1b[31mError:\x1b[0m\r\n');
      terminal.write('\x1b[31m' + error + '\x1b[0m');
    }

    terminal.scrollToBottom();

  }, [isOpen, terminalReady, output, error]);

  if (!isOpen) return null;

  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col">

      <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#333]">

        <div className="flex items-center gap-3">
          <span className="text-white text-sm font-medium">Terminal</span>
          <StatusBadge status={status} />
        </div>

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
        className="flex-1 p-1 overflow-auto h-full [&>div]:h-full"
      />

    </div>
  );
}
