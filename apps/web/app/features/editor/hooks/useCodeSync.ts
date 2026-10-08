import * as Y from "yjs";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/userStore";
import randomColor from "randomcolor";
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from "y-protocols/awareness";
import { Socket } from "socket.io-client";

interface useCodeSyncProps {
  roomId: string;
  socket: Socket | null;
}

interface SyncProvider {
  awareness: Awareness;
  destroy: () => void;
}

export function useCodeSync({ roomId, socket }: useCodeSyncProps) {
  const { user } = useUserStore();

  // State, not refs — these need to trigger a re-render in the consuming component
  // once the session is actually set up.
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [ytext, setYtext] = useState<Y.Text | null>(null);
  const [provider, setProvider] = useState<SyncProvider | null>(null);
  const [undoManager, setUndoManager] = useState<Y.UndoManager | null>(null);

  const awarenessRef = useRef<Awareness | null>(null);

  // Effect A — session lifecycle. Only recreates the doc on an actual room/connection
  // change, never on a profile edit.
  useEffect(() => {
    if (!roomId || !socket) return;

    const doc = new Y.Doc();
    const text = doc.getText("code");
    const awareness = new Awareness(doc);
    awarenessRef.current = awareness;

    const syncProvider: SyncProvider = {
      awareness,
      destroy: () => {
        awareness.destroy();
        doc.destroy();
      },
    };

    awareness.setLocalStateField("user", {
      name: user?.name || "Guest",
      color: randomColor(),
      colorLight: randomColor({ luminosity: "light" }),
      avatar: user?.profile_url || null,
    });

    const handleDocUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin !== "socket") {
        socket.emit("code:change", { roomId, update });
      }
    };
    doc.on("update", handleDocUpdate);

    const handleCodeSync = (data: {
      update: ArrayBuffer | Uint8Array;
    }) => {
      const update =
        data.update instanceof Uint8Array
          ? data.update
          : new Uint8Array(data.update);

      Y.applyUpdate(doc, update, "socket");
    };

    socket.on("code:sync", handleCodeSync);

    const handleAwarenessUpdate = (
      { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
      origin: unknown
    ) => {
      if (origin !== "socket") {
        const changedClients = added.concat(updated).concat(removed);
        const update = encodeAwarenessUpdate(awareness, changedClients);
        socket.emit("code:awareness", { roomId, update });
      }
    };
    awareness.on("update", handleAwarenessUpdate);

    const handleAwarenessSync = (data: {
      update: ArrayBuffer | Uint8Array;
    }) => {
      const update =
        data.update instanceof Uint8Array
          ? data.update
          : new Uint8Array(data.update);

      applyAwarenessUpdate(
        awareness,
        update,
        "socket"
      );
    };
    
    socket.on("code:awareness:sync", handleAwarenessSync);

    const handleCodeState = (data: {
      update: ArrayBuffer | Uint8Array;
    }) => {
      const update =
        data.update instanceof Uint8Array
          ? data.update
          : new Uint8Array(data.update);

      Y.applyUpdate(doc, update, "socket");
    };

    socket.on("code:state", handleCodeState);

    // Re-request state on every (re)connection, not just once on mount —
    // the original had no recovery path after a dropped connection.
    const requestState = () => socket.emit("code:state:request", { roomId });
    socket.on("connect", requestState);

    if (socket.connected) {
      requestState();
    }

    const manager = new Y.UndoManager(text);

    setYdoc(doc);
    setYtext(text);
    setProvider(syncProvider);
    setUndoManager(manager);

    return () => {
      doc.off("update", handleDocUpdate);
      awareness.off("update", handleAwarenessUpdate);
      socket.off("code:sync", handleCodeSync);
      socket.off("code:awareness:sync", handleAwarenessSync);
      socket.off("code:state", handleCodeState);
      socket.off("connect", requestState);

      manager.destroy();
      syncProvider.destroy();
      awarenessRef.current = null;

      setYdoc(null);
      setYtext(null);
      setProvider(null);
      setUndoManager(null);
    };
  }, [roomId, socket]); // <- user fields deliberately excluded

  // Effect B — local user info only. Updates awareness in place; never
  // touches the doc, provider, or socket listeners.
  useEffect(() => {
    if (!awarenessRef.current) return;
    awarenessRef.current.setLocalStateField("user", {
      name: user?.name || "Guest",
      color: awarenessRef.current.getLocalState()?.user?.color ?? randomColor(),
      colorLight: awarenessRef.current.getLocalState()?.user?.colorLight ?? randomColor({ luminosity: "light" }),
      avatar: user?.profile_url || null,
    });
  }, [user?.name, user?.profile_url]);

  return { ydoc, ytext, provider, undoManager };
}