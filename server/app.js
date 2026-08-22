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

const allowedOrigins = [
  "https://route-rakshak-black.vercel.app",
  /^https:\/\/route-rakshak-.*-himanshu45666s-projects\.vercel\.app$/
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowed = allowedOrigins.some((item) =>
      item instanceof RegExp ? item.test(origin) : item === origin
    );

    callback(null, allowed);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions
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

app.use(cors(corsOptions));
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