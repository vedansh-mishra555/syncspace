import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import socket from "../services/socket";
import ChatBox from "../components/ChatBox";
import CodeEditor from "../components/CodeEditor";

function Room() {
  const location = useLocation();

  const { room, name } = location.state || {};

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [code, setCode] = useState(`function hello() {
  console.log("Welcome to SyncSpace");
}`);

  // =========================
  // Socket Listeners
  // =========================
  useEffect(() => {
    socket.on("room-users", (roomUsers) => {
      setUsers(roomUsers);
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("receive-code", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("room-users");
      socket.off("receive-message");
      socket.off("receive-code");
    };
  }, []);

  // =========================
  // Send Chat
  // =========================
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId: room,
      user: name,
      text: message,
    });

    setMessage("");
  };

  // =========================
  // Live Code Sync
  // =========================
  const handleCodeChange = (newCode) => {
    setCode(newCode);

    socket.emit("code-change", {
      roomId: room,
      code: newCode,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >
      {/* LEFT PANEL */}
      <div
        style={{
          width: "250px",
          padding: "20px",
          background: "#1e293b",
          borderRight: "1px solid #334155",
          overflowY: "auto",
        }}
      >
        <h2>👥 Participants</h2>

        <hr />

        <p>
          <strong>Room:</strong> {room}
        </p>

        <p>
          <strong>You:</strong> {name}
        </p>

        <hr />

        {users.length === 0 ? (
          <p>No users connected.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              style={{
                padding: "12px",
                marginBottom: "10px",
                background: "#334155",
                borderRadius: "10px",
              }}
            >
              🟢 {user.name}
            </div>
          ))
        )}
      </div>

      {/* CENTER PANEL */}
      <div
        style={{
          flex: 1,
        }}
      >
        <CodeEditor
          code={code}
          onCodeChange={handleCodeChange}
        />
      </div>

      {/* RIGHT PANEL */}
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