const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const policeRoutes = require("./routes/policeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sosRoutes = require("./routes/sosRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://route-rakshak-black.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin
    if (!origin) {
      return callback(null, true);
    }

    // Allow exact origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview/deployment URLs
    if (
      /^https:\/\/route-rakshak-[a-z0-9]+-himanshu45666s-projects\.vercel\.app$/.test(
        origin
      )
    ) {
      return callback(null, true);
    }

    console.log("❌ CORS blocked origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  credentials: true,
};

// HTTP server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: corsOptions,
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

// Express middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/police", policeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚍 Route Rakshak Server Running...");
});

// Port
const PORT = process.env.PORT || 5000;

// MongoDB
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

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});