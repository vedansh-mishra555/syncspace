const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");
const socketHandler = require("./socket/socket");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", noteRoutes);

app.get("/", (req, res) => {
  res.send("🚀 SyncSpace Backend Running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});