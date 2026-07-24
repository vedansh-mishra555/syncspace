import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import socket from "../services/socket";

function Room() {
  const location = useLocation();

  const { room, name } = location.state || {};

  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("room-users", (roomUsers) => {
      setUsers(roomUsers);
    });

    return () => {
      socket.off("room-users");
    };
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>🚀 SyncSpace Room</h1>

      <h2>Room ID: {room}</h2>

      <h3>Welcome, {name}</h3>

      <hr />

      <h2>Participants ({users.length})</h2>

      {users.map((user) => (
        <p key={user.id}>🟢 {user.name}</p>
      ))}
    </div>
  );
}

export default Room;