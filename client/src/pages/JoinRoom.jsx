import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import socket from "../services/socket";
import "../styles/JoinRoom.css";

function JoinRoom() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const navigate = useNavigate();

  const generateRoom = () => {
    const roomId = uuidv4().slice(0, 8).toUpperCase();
    setRoom(roomId);
    toast.success("Room ID Generated!");
  };

  const copyRoomId = () => {
    if (!room) {
      toast.warning("Generate a Room ID first!");
      return;
    }

    navigator.clipboard.writeText(room);
    toast.success("Room ID Copied!");
  };

 const handleJoin = () => {
  if (!name || !room) {
    toast.warning("Please fill all fields!");
    return;
  }

  socket.connect();

  socket.emit("join-room", {
    roomId: room,
    userName: name,
  });

  navigate("/room", {
    state: {
      room,
      name,
    },
  });
};
  return (
    <div className="join-page">
      <div className="join-card">
        <h1>🚀 SyncSpace</h1>

        <p>Real-Time Collaborative Workspace</p>

        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button onClick={generateRoom}>
          🎲 Generate Room ID
        </button>

        <button onClick={copyRoomId}>
          📋 Copy Room ID
        </button>

        <button onClick={handleJoin}>
          🚀 Join / Create Room
        </button>

        <button onClick={() => navigate("/notes")}>
          📝 Go to Notes
        </button>
      </div>
    </div>
  );
}

export default JoinRoom;