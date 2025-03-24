"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
// import { handleMatchmaking } from '../src/utils/socketMatchmaking';
var app = (0, express_1.default)();
var httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*", // Change to your frontend URL in production
        methods: ["GET", "POST"]
    }
});
// Middleware
app.use(express_1.default.json());
// Simple health check endpoint
app.get("/", function (req, res) {
    res.send("Server is running!");
});
// Socket.IO logic
io.on("connection", function (socket) {
    console.log("User connected: ".concat(socket.id));
    // handleMatchmaking(socket, io);tsc 
    socket.on("disconnect", function () {
        console.log("User disconnected: ".concat(socket.id));
    });
});

// Server listening
var PORT = process.env.PORT || 3000;
httpServer.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});