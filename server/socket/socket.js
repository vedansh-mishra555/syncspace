const rooms = {};
const whiteboards = {};

function mergeElements(oldElements = [], newElements = []) {
  const elementMap = new Map();

  // Add existing elements
  oldElements.forEach((element) => {
    elementMap.set(element.id, element);
  });

  // Add/update new elements
  newElements.forEach((element) => {
    const existing = elementMap.get(element.id);

    // Keep the newest version
    if (
      !existing ||
      (element.version || 0) >=
        (existing.version || 0)
    ) {
      elementMap.set(element.id, element);
    }
  });

  return Array.from(elementMap.values());
}

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(
      "✅ User Connected:",
      socket.id
    );

    // =========================================
    // JOIN ROOM
    // =========================================

    socket.on(
      "join-room",
      ({ roomId, userName }) => {
        if (!roomId || !userName) return;

        socket.join(roomId);

        socket.roomId = roomId;
        socket.userName = userName;

        if (!rooms[roomId]) {
          rooms[roomId] = [];
        }

        const existingUser =
          rooms[roomId].find(
            (user) =>
              user.id === socket.id
          );

        if (!existingUser) {
          rooms[roomId].push({
            id: socket.id,
            name: userName,
          });
        }

        console.log(
          `👤 ${userName} joined room ${roomId}`
        );

        io.to(roomId).emit(
          "room-users",
          rooms[roomId]
        );

        // Send current whiteboard
        if (whiteboards[roomId]) {
          socket.emit(
            "whiteboard-state",
            whiteboards[roomId]
          );
        }
      }
    );

    // =========================================
    // WHITEBOARD REQUEST
    // =========================================

    socket.on(
      "whiteboard-request",
      (roomId) => {
        if (!roomId) return;

        if (whiteboards[roomId]) {
          socket.emit(
            "whiteboard-state",
            whiteboards[roomId]
          );
        }
      }
    );

    // =========================================
    // WHITEBOARD CHANGE
    // =========================================

    socket.on(
      "whiteboard-change",
      ({ roomId, elements }) => {
        if (!roomId) return;

        // Merge instead of replacing
        whiteboards[roomId] =
          mergeElements(
            whiteboards[roomId] || [],
            elements || []
          );

        console.log(
          `🎨 Whiteboard updated: ${roomId}`
        );

        // Send merged board to other users
        socket
          .to(roomId)
          .emit(
            "whiteboard-state",
            whiteboards[roomId]
          );
      }
    );

    // =========================================
    // CHAT
    // =========================================

    socket.on(
      "send-message",
      (data) => {
        if (!data || !data.roomId) return;

        io.to(data.roomId).emit(
          "receive-message",
          data
        );
      }
    );

    // =========================================
    // CODE EDITOR
    // =========================================

    socket.on(
      "code-change",
      ({ roomId, code }) => {
        if (!roomId) return;

        socket
          .to(roomId)
          .emit(
            "receive-code",
            code
          );
      }
    );

    // =========================================
    // DISCONNECT
    // =========================================

    socket.on(
      "disconnect",
      () => {
        console.log(
          "❌ User Disconnected:",
          socket.id
        );

        const roomId =
          socket.roomId;

        if (
          roomId &&
          rooms[roomId]
        ) {
          rooms[roomId] =
            rooms[roomId].filter(
              (user) =>
                user.id !== socket.id
            );

          io.to(roomId).emit(
            "room-users",
            rooms[roomId]
          );

          if (
            rooms[roomId].length === 0
          ) {
            delete rooms[roomId];
            delete whiteboards[roomId];

            console.log(
              `🗑️ Room deleted: ${roomId}`
            );
          }
        }
      }
    );
  });
}

module.exports = socketHandler;