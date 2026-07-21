const express = require("express");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");
require("dotenv").config();

const testRoutes = require("./routes/testRoutes");

const app = express();
app.use("/api", testRoutes);
app.use("/api", noteRoutes);
app.use(cors());
app.use(express.json());

app.use("/api", testRoutes);

app.get("/", (req, res) => {
    res.send("🚀 SyncSpace Backend Running");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});