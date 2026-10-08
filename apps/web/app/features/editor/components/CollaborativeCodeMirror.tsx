// CollaborativeCodeMirror.tsx
"use client";

import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { yCollab } from "y-codemirror.next";
import { useCodeSync } from "../hooks/useCodeSync";

interface Props {
  roomId: string;
  socket: Socket | null;
}

export default function CollaborativeCodeMirror({ roomId, socket }: Props) {

  const { ytext, provider, undoManager } = useCodeSync({ roomId, socket });
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {

    if (!element || !ytext || !provider || !undoManager) return;

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        vscodeDark,
        javascript(), // TODO: swap based on room/exercise language once multi-language rooms exist
        yCollab(ytext, provider.awareness, { undoManager }),
      ],
    });

    const view = new EditorView({ state, parent: element });

    // undoManager's own lifecycle is owned by useCodeSync — only the view belongs to this component.
    return () => view.destroy();
  }, [element, ytext, provider, undoManager]);

  return <div className="h-full w-full [&>.cm-editor]:h-full" ref={setElement} />;
}