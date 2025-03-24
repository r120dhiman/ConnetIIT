const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const parser = require("body-parser");
const socket = require("socket.io");
const http = require("http");
const router = require("./userRoutes/routes");

app.use(router);

const server = http.createServer(app);
app.use(cors());
const io = socket(server);

io.connect("http://localhost:3000", {
  cors: {
    origin: "*",
    methods: ["GET","POST","PUT","DELETE","PATCH"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(express.json());

mongoose.connect();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
