import { useEffect, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

import socket from "../services/socket";

function Whiteboard({ room }) {
  const excalidrawAPIRef = useRef(null);

  // Prevent remote updates from interfering
  // with the user's current drawing
  const isApplyingRemoteUpdate =
    useRef(false);

  // =========================================
  // RECEIVE WHITEBOARD
  // =========================================

  useEffect(() => {
    if (!room) return;

    const handleWhiteboardState = (
      receivedElements
    ) => {
      console.log(
        "🎨 Whiteboard received:",
        receivedElements
      );

      if (!excalidrawAPIRef.current) {
        return;
      }

      isApplyingRemoteUpdate.current =
        true;

      excalidrawAPIRef.current.updateScene({
        elements:
          receivedElements || [],
      });

      // Allow local changes again
      setTimeout(() => {
        isApplyingRemoteUpdate.current =
          false;
      }, 50);
    };

    socket.on(
      "whiteboard-state",
      handleWhiteboardState
    );

    // Ask server for existing board
    socket.emit(
      "whiteboard-request",
      room
    );

    return () => {
      socket.off(
        "whiteboard-state",
        handleWhiteboardState
      );
    };
  }, [room]);

  // =========================================
  // LOCAL WHITEBOARD CHANGE
  // =========================================

  const handleChange = (elements) => {
    if (!room) return;

    // Don't send remote updates back
    if (
      isApplyingRemoteUpdate.current
    ) {
      return;
    }

    if (!socket.connected) {
      return;
    }

    socket.emit(
      "whiteboard-change",
      {
        roomId: room,
        elements,
      }
    );
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Excalidraw
        excalidrawAPI={(api) => {
          excalidrawAPIRef.current =
            api;
        }}
        onChange={handleChange}
      />
    </div>
  );
}

export default Whiteboard;