import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import socket from "../services/socket";
import ChatBox from "../components/ChatBox";
import CodeEditor from "../components/CodeEditor";
import Whiteboard from "../components/Whiteboard";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Room.css";

function Room() {
  const location = useLocation();

  const { room, name } = location.state || {};

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [code, setCode] = useState(`function hello() {
  console.log("Welcome to SyncSpace");
}`);

  // ===========================
  // Socket Connection
  // ===========================
  useEffect(() => {
    if (!room || !name) return;

    // Connect only once
    if (!socket.connected) {
      socket.connect();
    }

    // Join room
    socket.emit("join-room", {
      roomId: room,
      userName: name,
    });

    // Users
    socket.on("room-users", (roomUsers) => {
      setUsers(roomUsers);
    });

    // Chat
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Code Sync
    socket.on("receive-code", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("room-users");
      socket.off("receive-message");
      socket.off("receive-code");
    };
  }, [room, name]);

  // ===========================
  // Send Chat
  // ===========================
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId: room,
      user: name,
      text: message,
    });

    setMessage("");
  };

  // ===========================
  // Code Sync
  // ===========================
  const handleCodeChange = (newCode) => {
    setCode(newCode);

    socket.emit("code-change", {
      roomId: room,
      code: newCode,
    });
  };

  return (
    <div className="room-page">

      <Navbar
        room={room}
        name={name}
      />

      <div className="room-top">

        <Sidebar
          room={room}
          name={name}
          users={users}
        />

        <div className="room-center">

          <div className="editor-section">
            <CodeEditor
              code={code}
              onCodeChange={handleCodeChange}
            />
          </div>

          <div className="whiteboard-section">
            <Whiteboard />
          </div>

        </div>

        <ChatBox
          messages={messages}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />

      </div>

    </div>
  );
}

export default Room;