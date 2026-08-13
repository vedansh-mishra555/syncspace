import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import socket from "../services/socket";
import "../styles/Navbar.css";

function Navbar({ room, name }) {
  const navigate = useNavigate();

  const [connected, setConnected] = useState(
    socket.connected
  );

  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Socket Connected");
      setConnected(true);
    };

    const handleDisconnect = () => {
      console.log("❌ Socket Disconnected");
      setConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off(
        "disconnect",
        handleDisconnect
      );
    };
  }, []);

  const copyRoom = async () => {
    if (!room) {
      toast.warning("Room ID not found!");
      return;
    }

    try {
      await navigator.clipboard.writeText(room);
      toast.success("Room ID Copied!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy Room ID");
    }
  };

  const leaveRoom = () => {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave the room?"
    );

    if (!confirmLeave) return;

    socket.disconnect();

    toast.success(
      "Left the room successfully!"
    );

    navigate("/");
  };

  return (
    <>
      <div className="navbar">

        {/* LEFT */}
        <div className="navbar-left">
          🚀 <span>SyncSpace</span>
        </div>

        {/* CENTER */}
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

          <button
            className="copy-btn"
            onClick={() =>
              setShowAbout(true)
            }
          >
            ℹ️ About
          </button>

          <div className="status">
            <span
              className="status-dot"
              style={{
                backgroundColor: connected
                  ? "#22c55e"
                  : "#ef4444",
              }}
            />

            {connected
              ? "Connected"
              : "Disconnected"}
          </div>
        </div>

        {/* RIGHT */}
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

      {/* ABOUT MODAL */}
      {showAbout && (
        <div
          className="about-overlay"
          onClick={() =>
            setShowAbout(false)
          }
        >
          <div
            className="about-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h2>🚀 SyncSpace</h2>

            <p>
              <strong>Version:</strong> 1.0
            </p>

            <p>
              <strong>Developer:</strong>{" "}
              Vedansh Mishra
            </p>

            <p>
              <strong>Tech Stack:</strong>
              <br />
              React • Node.js • Express •
              MongoDB • Socket.IO • Monaco
              Editor • Excalidraw
            </p>

            <p>
              <strong>Features:</strong>
            </p>

            <ul>
              <li>
                ✅ Real-time Collaborative
                Coding
              </li>
              <li>
                ✅ Room-based Collaboration
              </li>
              <li>✅ Live Chat</li>
              <li>✅ Shared Whiteboard</li>
              <li>✅ Collaborative Notes</li>
              <li>✅ Copy & Download Code</li>
              <li>✅ Meeting Timer</li>
              <li>✅ Responsive UI</li>
            </ul>

            <button
              className="leave-btn"
              onClick={() =>
                setShowAbout(false)
              }
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