const rooms = {};

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    socket.on("join-room", ({ roomId, userName }) => {
      socket.join(roomId);

      socket.roomId = roomId;
      socket.userName = userName;

      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      rooms[roomId].push({
        id: socket.id,
        name: userName,
      });

      io.to(roomId).emit("room-users", rooms[roomId]);

      console.log(`${userName} joined ${roomId}`);
    });

    // Send Chat Message
    socket.on("send-message", (data) => {
      io.to(data.roomId).emit("receive-message", data);
    });

    socket.on("disconnect", () => {
      const roomId = socket.roomId;

      if (roomId && rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter(
          (user) => user.id !== socket.id
        );

        io.to(roomId).emit("room-users", rooms[roomId]);
      }

      console.log("❌ User Disconnected");
    });
  });
}

module.exports = socketHandler;