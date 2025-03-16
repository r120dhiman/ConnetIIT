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
  console.log(`User connected: ${socket.id}`);

  // Handle matchmaking
  handleMatchmaking(socket, io);

  // Handle room joining
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle room leaving
  socket.on("leave-room", ({ roomId }) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId} in server.ts` );
    // Check if the room exists and remove it
    const room = roomManager.getRoomByUser(socket.id);
    if (room) {
      // Notify other users in the room
      socket.to(room.id).emit("user-disconnected", {
        message: "Your chat partner has disconnected",
      });
      // Clean up the room
      roomManager.removeRoom(room.id);
    }
  });

  // // Handle chat messages
  // socket.on('send-message', ({ roomId, message }) => {
  //   // Broadcast to everyone in the room except sender
  //   socket.to(roomId).emit('receive-message', message);
  //   console.log(`Message sent in room ${roomId}: ${message.text.substring(0, 20)}...`);
  // });

  // Handle typing indicator
  socket.on("typing", ({ roomId }) => {
    socket.to(roomId).emit("typing");
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`- Health check: http://localhost:${PORT}/health`);
});

export default httpServer;
