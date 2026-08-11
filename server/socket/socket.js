const rooms = {};
const whiteboards = {};

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    // ===========================
    // JOIN ROOM
    // ===========================
    socket.on("join-room", ({ roomId, userName }) => {
      socket.join(roomId);

      socket.roomId = roomId;
      socket.userName = userName;

      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      // Prevent duplicate users
      const existingUser = rooms[roomId].find(
        (user) => user.id === socket.id
      );

      if (!existingUser) {
        rooms[roomId].push({
          id: socket.id,
          name: userName,
        });
      }

      // Send users to everyone in room
      io.to(roomId).emit("room-users", rooms[roomId]);

      // Send existing whiteboard to newly joined user
      if (whiteboards[roomId]) {
        socket.emit("whiteboard-update", whiteboards[roomId]);
      }

      console.log(`👤 ${userName} joined room ${roomId}`);
      console.log("👥 Users:", rooms[roomId]);
    });

    // ===========================
    // CHAT
    // ===========================
    socket.on("send-message", (data) => {
      io.to(data.roomId).emit("receive-message", data);
    });

    // ===========================
    // CODE SYNC
    // ===========================
    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("receive-code", code);
    });

    // ===========================
    // WHITEBOARD SYNC
    // ===========================
    socket.on("whiteboard-change", ({ roomId, elements }) => {
      // Save latest whiteboard
      whiteboards[roomId] = elements;

      // Send to everyone except sender
      socket.to(roomId).emit(
        "whiteboard-update",
        elements
      );
    });

    // ===========================
    // DISCONNECT
    // ===========================
    socket.on("disconnect", () => {
      console.log("❌ User Disconnected:", socket.id);

      const roomId = socket.roomId;

      if (roomId && rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter(
          (user) => user.id !== socket.id
        );

        // Update participants
        io.to(roomId).emit(
          "room-users",
          rooms[roomId]
        );

        // Delete empty room
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
          delete whiteboards[roomId];
        }
      }
    });
  });
}

module.exports = socketHandler;