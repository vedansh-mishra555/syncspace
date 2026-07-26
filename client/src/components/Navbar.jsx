import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import socket from "../services/socket";
import "../styles/Navbar.css";

function Navbar({ room, name }) {
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const copyRoom = () => {
    navigator.clipboard.writeText(room);
    toast.success("Room ID Copied!");
  };

  const leaveRoom = () => {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave the room?"
    );

    if (confirmLeave) {
      socket.disconnect();
      window.location.href = "/";
    }
  };

  return (
    <div className="navbar">
      {/* Left */}
      <div className="navbar-left">
        🚀 <span>SyncSpace</span>
      </div>

      {/* Center */}
      <div className="navbar-center">
        <span className="room-id">
          Room: <strong>{room}</strong>
        </span>

        <button
          className="copy-btn"
          onClick={copyRoom}
        >
          📋 Copy
        </button>

        <div className="status">
          <span
            className="status-dot"
            style={{
              background: connected ? "#22c55e" : "#ef4444",
            }}
          ></span>

          {connected ? "Connected" : "Disconnected"}
        </div>
      </div>

      {/* Right */}
      <div className="navbar-right">
        <span className="user-name">
          👤 {name}
        </span>

        <button
          className="leave-btn"
          onClick={leaveRoom}
        >
          🚪 Leave
        </button>
      </div>
    </div>
  );
}

export default Navbar;