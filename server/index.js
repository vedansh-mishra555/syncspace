const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const codeRoutes = require("./routes/codeRoutes");

require("dotenv").config();

const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");
const socketHandler = require("./socket/socket");

connectDB();

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());
app.use(express.json());

// =====================================
// API ROUTES
// =====================================

app.use("/api", noteRoutes);
app.use("/api/code", codeRoutes);

// =====================================
// BASIC ROUTES
// =====================================

app.get("/", (req, res) => {
  res.send("🚀 SyncSpace Backend Running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SyncSpace Backend is running successfully",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment:
      process.env.NODE_ENV || "development",
  });
});

// =====================================
// HTTP SERVER
// =====================================

const server = http.createServer(app);

// =====================================
// SOCKET.IO
// =====================================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Start Socket.IO handler
socketHandler(io);

// =====================================
// START SERVER
// =====================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `✅ Server running on port ${PORT}`
  );
});