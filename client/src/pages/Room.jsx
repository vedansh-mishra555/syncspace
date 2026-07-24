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
  // Socket Listeners
  // ===========================
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
  // Live Code
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

  
      {/* TOP SECTION */}
      <div className="room-top">

        {/* SIDEBAR */}
        <Sidebar
          room={room}
          name={name}
          users={users}
        />

        {/* CODE EDITOR */}
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
        {/* CHAT */}
        <ChatBox
          messages={messages}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />

      </div>

      {/* WHITEBOARD */}
     
    </div>
  );
}

export default Room;