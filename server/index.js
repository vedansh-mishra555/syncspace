const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const testRoutes = require("./routes/testRoutes");
const noteRoutes = require("./routes/noteRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", testRoutes);
app.use("/api", noteRoutes);

app.get("/", (req, res) => {
    res.send("🚀 SyncSpace Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});