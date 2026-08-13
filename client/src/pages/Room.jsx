import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import socket from "../services/socket";

import ChatBox from "../components/ChatBox";
import CodeEditor from "../components/CodeEditor";
import Whiteboard from "../components/Whiteboard";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Room.css";

function Room() {
  const location = useLocation();
  const navigate = useNavigate();

  const { room, name } = location.state || {};

  // =========================================
  // STATE
  // =========================================

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [code, setCode] = useState(`function hello() {
  console.log("Welcome to SyncSpace");
}`);

  // =========================================
  // CHECK ROOM DETAILS
  // =========================================

  useEffect(() => {
    if (!room || !name) {
      navigate("/");
    }
  }, [room, name, navigate]);

  // =========================================
  // SOCKET CONNECTION
  // =========================================

  useEffect(() => {
    if (!room || !name) return;

    // Connect socket if not connected
    if (!socket.connected) {
      socket.connect();
    }

    // =======================================
    // JOIN ROOM
    // =======================================

    const joinRoom = () => {
      console.log(
        `🚀 Joining room ${room} as ${name}`
      );

      socket.emit("join-room", {
        roomId: room,
        userName: name,
      });
    };

    // If already connected
    if (socket.connected) {
      joinRoom();
    }

    // If connection happens now
    socket.on("connect", joinRoom);

    // =======================================
    // USERS
    // =======================================

    const handleRoomUsers = (roomUsers) => {
      console.log(
        "👥 Room Users:",
        roomUsers
      );

      setUsers(roomUsers || []);
    };

    socket.on(
      "room-users",
      handleRoomUsers
    );

    // =======================================
    // CHAT
    // =======================================

    const handleReceiveMessage = (data) => {
      console.log(
        "💬 Message:",
        data
      );

      setMessages((prev) => [
        ...prev,
        data,
      ]);
    };

    socket.on(
      "receive-message",
      handleReceiveMessage
    );

    // =======================================
    // CODE SYNC
    // =======================================

    const handleReceiveCode = (newCode) => {
      console.log(
        "💻 Code received"
      );

      setCode(newCode);
    };

    socket.on(
      "receive-code",
      handleReceiveCode
    );

    // =======================================
    // CLEANUP
    // =======================================

    return () => {
      socket.off(
        "connect",
        joinRoom
      );

      socket.off(
        "room-users",
        handleRoomUsers
      );

      socket.off(
        "receive-message",
        handleReceiveMessage
      );

      socket.off(
        "receive-code",
        handleReceiveCode
      );
    };
  }, [room, name]);

  // =========================================
  // SEND MESSAGE
  // =========================================

  const sendMessage = () => {
    if (!message.trim()) {
      return;
    }

    if (!socket.connected) {
      return;
    }

    socket.emit("send-message", {
      roomId: room,
      user: name,
      text: message.trim(),
    });

    setMessage("");
  };

  // =========================================
  // CODE CHANGE
  // =========================================

  const handleCodeChange = (newCode) => {
    setCode(newCode);

    if (!socket.connected) {
      return;
    }

    socket.emit("code-change", {
      roomId: room,
      code: newCode,
    });
  };

  // =========================================
  // NO ROOM
  // =========================================

  if (!room || !name) {
    return null;
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="room-page">

      {/* ================= NAVBAR ================= */}

      <Navbar
        room={room}
        name={name}
      />

      {/* ================= ROOM CONTENT ================= */}

      <div className="room-top">

        {/* ================= SIDEBAR ================= */}

        <Sidebar
          room={room}
          name={name}
          users={users}
        />

        {/* ================= CENTER ================= */}

        <div className="room-center">

          {/* CODE EDITOR */}

          <div className="editor-section">
            <CodeEditor
              code={code}
              onCodeChange={
                handleCodeChange
              }
            />
          </div>

          {/* WHITEBOARD */}

          <div className="whiteboard-section">
            <Whiteboard
              room={room}
            />
          </div>

        </div>

        {/* ================= CHAT ================= */}

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