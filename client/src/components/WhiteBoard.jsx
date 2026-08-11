import { useEffect, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

import socket from "../services/socket";

function Whiteboard({ room }) {
  const excalidrawAPI = useRef(null);

  const isRemoteUpdate = useRef(false);

  // ===========================
  // RECEIVE WHITEBOARD
  // ===========================
  useEffect(() => {
    const handleWhiteboardUpdate = (elements) => {
      if (!excalidrawAPI.current) return;

      isRemoteUpdate.current = true;

      excalidrawAPI.current.updateScene({
        elements,
      });

      setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 0);
    };

    socket.on(
      "whiteboard-update",
      handleWhiteboardUpdate
    );

    return () => {
      socket.off(
        "whiteboard-update",
        handleWhiteboardUpdate
      );
    };
  }, []);

  // ===========================
  // WHITEBOARD CHANGE
  // ===========================
  const handleChange = (elements) => {
    if (!room) return;

    // Don't send remote changes back to server
    if (isRemoteUpdate.current) return;

    socket.emit("whiteboard-change", {
      roomId: room,
      elements,
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Excalidraw
        excalidrawAPI={(api) => {
          excalidrawAPI.current = api;
        }}
        onChange={handleChange}
      />
    </div>
  );
}

export default Whiteboard;