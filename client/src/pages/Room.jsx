import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import socket from "../services/socket";
import ChatBox from "../components/ChatBox";

function Room() {
  const location = useLocation();

  const { room, name } = location.state || {};

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Live Participants
    socket.on("room-users", (roomUsers) => {
      setUsers(roomUsers);
    });

    // Receive Messages
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("room-users");
      socket.off("receive-message");
    };
  }, []);

  // Send Message
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId: room,
      user: name,
      text: message,
    });

    setMessage("");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          flex: 1,
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            marginBottom: "20px",
          }}
        >
          🚀 SyncSpace Room
        </h1>

        <h2>Room ID: {room}</h2>

        <h3
          style={{
            marginTop: "10px",
          }}
        >
          Welcome, {name}
        </h3>

        <hr
          style={{
            margin: "25px 0",
            borderColor: "#334155",
          }}
        />

        <h2>👥 Participants ({users.length})</h2>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          {users.length === 0 ? (
            <p>No users connected.</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                style={{
                  background: "#1e293b",
                  padding: "12px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  border: "1px solid #334155",
                }}
              >
                🟢 {user.name}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <ChatBox
        messages={messages}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default Room;