const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const policeRoutes = require("./routes/policeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("🟢 New Client Connected:", socket.id);

  socket.on("sendSOS", (data) => {
  console.log("🚨 SOS Received:", data);

  io.emit("receiveSOS", data);
});

  socket.on("disconnect", () => {
    console.log("🔴 Client Disconnected:", socket.id);
  });
});
const sosRoutes = require("./routes/sosRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/police", policeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.send("🚍 Route Rakshak Server Running...");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error");
    console.log(err.message);
    console.log(err);
  });
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});