import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { handleMatchmaking } from "./socketMatchmaking";
import { roomManager } from "./roomManager";

const app = express();
const httpServer = createServer(app);

// Setup CORS
app.use(
  cors({
    origin: "*", // In production, change this to your frontend URL
    methods: ["GET", "POST"],
  })
);

// Parse JSON body
app.use(express.json());

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, change this to your frontend URL
    methods: ["GET", "POST"],
  },
});

// Routes
app.get("/", (req, res) => {
  res.send("Anonymous Chat Server is running!");
});

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({
      status: "ok",
      version: "1.0",
      timestamp: new Date().toISOString(),
    });
});

// Socket.IO connection handling
io.on("connection", (socket) => {


  // Handle matchmaking
  handleMatchmaking(socket, io);

  // Handle room joining
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);

  });

  socket.on("destroyroom", ({ roomId }) => {

    io.to(roomId).emit("room-destroyed");
    
    // Force all sockets to leave the room
    io.in(roomId).socketsLeave(roomId);
    
    // Remove the room from room manager
    const room = roomManager.getRoomByUser(socket.id);
    if (room) {
      roomManager.removeRoom(room.id);
    }
  });

  // Handle room leaving
  socket.on("leave-room", ({ roomId }) => {
    socket.leave(roomId);

    
    // Get the room before the user leaves
    const room = roomManager.getRoomByUser(socket.id);
    if (room) {

      io.to(roomId).emit("user-disconnected");
      io.in(roomId).socketsLeave(roomId);
      roomManager.removeRoom(room.id);
    }
  });

  // Handle typing indicator
  socket.on("typing", ({ roomId }) => {
    socket.to(roomId).emit("typing");
  });

  // Handle disconnection
  socket.on("disconnect", () => {

  });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`- Health check: http://localhost:${PORT}/health`);
});

export default httpServer;
