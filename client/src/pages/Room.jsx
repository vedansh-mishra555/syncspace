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
  // SOCKET CONNECTION
  // ===========================
  useEffect(() => {
    if (!room || !name) return;

    // Connect socket
    if (!socket.connected) {
      socket.connect();
    }

    // ===========================
    // JOIN ROOM
    // ===========================
    const joinRoom = () => {
      socket.emit("join-room", {
        roomId: room,
        userName: name,
      });
    };

    // If already connected
    if (socket.connected) {
      joinRoom();
    }

    // If connection happens after this component loads
    socket.on("connect", joinRoom);

    // ===========================
    // USERS
    // ===========================
    const handleUsers = (roomUsers) => {
      setUsers(roomUsers);
    };

    socket.on("room-users", handleUsers);

    // ===========================
    // CHAT
    // ===========================
    const handleMessage = (data) => {
      setMessages((prev) => [
        ...prev,
        data,
      ]);
    };

    socket.on(
      "receive-message",
      handleMessage
    );

    // ===========================
    // CODE
    // ===========================
    const handleCode = (newCode) => {
      setCode(newCode);
    };

    socket.on(
      "receive-code",
      handleCode
    );

    // ===========================
    // CLEANUP
    // ===========================
    return () => {
      socket.off("connect", joinRoom);

      socket.off(
        "room-users",
        handleUsers
      );

      socket.off(
        "receive-message",
        handleMessage
      );

      socket.off(
        "receive-code",
        handleCode
      );
    };
  }, [room, name]);

  // ===========================
  // SEND CHAT
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
  // CODE CHANGE
  // ===========================
  const handleCodeChange = (newCode) => {
    setCode(newCode);

    socket.emit("code-change", {
      roomId: room,
      code: newCode,
    });
  };

  // ===========================
  // INVALID ROOM
  // ===========================
  if (!room || !name) {
    return (
      <div
        style={{
          color: "white",
          background: "#0f172a",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        Invalid room. Please join a room again.
      </div>
    );
  }

  return (
    <div className="room-page">

      {/* ===========================
          NAVBAR
      =========================== */}
      <Navbar
        room={room}
        name={name}
      />

      {/* ===========================
          MAIN ROOM
      =========================== */}
      <div className="room-top">

        {/* ===========================
            SIDEBAR
        =========================== */}
        <Sidebar
          room={room}
          name={name}
          users={users}
        />

        {/* ===========================
            CENTER
        =========================== */}
        <div className="room-center">

          {/* CODE EDITOR */}
          <div className="editor-section">
            <CodeEditor
              code={code}
              onCodeChange={handleCodeChange}
            />
          </div>

          {/* WHITEBOARD */}
          <div className="whiteboard-section">
            <Whiteboard room={room} />
          </div>

        </div>

        {/* ===========================
            CHAT
        =========================== */}
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