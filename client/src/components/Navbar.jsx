import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import socket from "../services/socket";
import "../styles/Navbar.css";

function Navbar({ room, name }) {
  const navigate = useNavigate();

  const [connected, setConnected] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    // Check current connection when component loads
    setConnected(socket.connected);

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

    if (!confirmLeave) return;

    socket.disconnect();

    toast.success("Left the room successfully!");

    navigate("/");
  };

  return (
    <>
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

          <button className="copy-btn" onClick={copyRoom}>
            📋 Copy
          </button>

          <button
            className="copy-btn"
            onClick={() => setShowAbout(true)}
          >
            ℹ️ About
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

      {showAbout && (
        <div className="about-overlay">
          <div className="about-modal">
            <h2>🚀 SyncSpace</h2>

            <p>
              <strong>Version:</strong> 1.0
            </p>

            <p>
              <strong>Developer:</strong> Vedansh Mishra
            </p>

            <p>
              <strong>Tech Stack:</strong>
              <br />
              React • Node.js • Express • MongoDB • Socket.IO • Monaco Editor
            </p>

            <p>
              <strong>Features:</strong>
            </p>

            <ul>
              <li>✅ Real-time Collaborative Coding</li>
              <li>✅ Room-based Collaboration</li>
              <li>✅ Live Chat</li>
              <li>✅ Copy & Download Code</li>
              <li>✅ Whiteboard</li>
              <li>✅ Responsive UI</li>
            </ul>

            <button
              className="leave-btn"
              onClick={() => setShowAbout(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;