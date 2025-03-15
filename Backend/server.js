
import express from 'express';
import http from 'http';
import cors from 'cors';
import {Server} from 'socket.io';
const app=express();    

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
});
const port=process.env.PORT || 3000;
app.use(cors({
    origin: '*'
}));

io.on("connection",(socket) => {
  console.log("User connected",socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`user with id ${socket.id} has joined the room wiht id ${data}`);
  }
  )

  socket.on("new-message", (data) => {
    console.log(data);
    socket.to(data.roomid).emit("new-msg-recieved",data);
  }
  )

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});



server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});