const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const getDoctor = require("./routes/getDoctors");
const consultations = require("./routes/consultations");

const io = new Server({
  cors: true,
});
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/getDoctor", getDoctor);
app.use("/api/consultations", consultations);

const emailToSocketMap = new Map();
const socketToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("new connection");
  socket.on("join-room", (data) => {
    const { roomId, userId } = data;
    console.log("user", userId, "joined room", roomId);
    emailToSocketMap.set(userId, socket.id);
    socketToEmailMap.set(socket.id, userId);
    socket.join(roomId);
    socket.emit("joined-room", { roomId });
    socket.broadcast.to(roomId).emit("user-joined", { userId });
  });

  socket.on("call-user", (data) => {
    const { userId, offer } = data;
    const fromEmail = socketToEmailMap.get(socket.id);
    const socketId = emailToSocketMap.get(userId);
    socket.to(socketId).emit("incoming-call", { from: fromEmail, offer });
  });

  socket.on("call-accepted", (data) => {
    const { userId, ans } = data;
    const socketId = emailToSocketMap.get(userId);
    socket.to(socketId).emit("call-accepted", { ans });
  });
});

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
io.listen(8000);
