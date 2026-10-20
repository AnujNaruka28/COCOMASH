"use client";

import { useEffect, useRef, useState, useImperativeHandle } from "react";
import type { Ref } from "react";
import type { Socket } from "socket.io-client";
import { EditorView, basicSetup } from "codemirror";
import { Compartment, EditorState } from "@codemirror/state";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { yCollab } from "y-codemirror.next";
import { useCodeSync } from "../hooks/useCodeSync";

interface Props {
  roomId: string;
  socket: Socket | null;
  language: string;
  ref: Ref<CodeMirrorRef>
}

export interface CodeMirrorRef {
  getCode: () => string;
}

function getLanguageExtension(language: string) {
  switch (language) {
    case 'javascript':
      return javascript();
    case 'python':
      return python();
    case 'cpp':
      return cpp();
    default:
      return javascript();
  }
}

const CollaborativeCodeMirror = ({ 
  roomId, 
  socket, 
  language, 
  ref 
} : Props) => {

  const { ytext, provider, undoManager } = useCodeSync({ roomId, socket });
  const [element, setElement] = useState<HTMLElement | null>(null);

  const languageCompartmentRef = useRef<Compartment | null>(null);

  if(!languageCompartmentRef.current) languageCompartmentRef.current = new Compartment();

  const languageCompartment = languageCompartmentRef.current;

  const viewRef = useRef<EditorView | null>(null);

  useImperativeHandle(
    ref, 
    () => ({
      getCode: () => (ytext?.toString() || '')
    }),
    [ytext, ref]
  );

  useEffect(() => {

    if (!element || !ytext || !provider || !undoManager) return;

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        vscodeDark,
        languageCompartment.of(
          getLanguageExtension(language)
        ),
        yCollab(
          ytext, 
          provider.awareness, 
          { undoManager }
        ),
      ],
    });

    const view = new EditorView({ state, parent: element });

    viewRef.current = view;
    // undoManager's own lifecycle is owned by useCodeSync — only the view belongs to this component.
    return () => view.destroy();
  }, [
    element, 
    ytext, 
    provider, 
    undoManager, 
    languageCompartment
  ]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: languageCompartment.reconfigure(
        getLanguageExtension(language)
      )
    })
  }, [language, languageCompartment])


  return <div className="h-full w-full [&>.cm-editor]:h-full" ref={setElement} />;
};

export default CollaborativeCodeMirror;