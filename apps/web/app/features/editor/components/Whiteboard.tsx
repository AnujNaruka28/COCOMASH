"use client";

import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

interface WhiteboardProps {
  isOpen: boolean;
}

export default function Whiteboard({ isOpen }: WhiteboardProps) {
  if (!isOpen) return null;

  return <Excalidraw theme="dark" />;
}
