import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import {v4 as uuid} from 'uuid';
import io from "socket.io-client";
import Chat from "../components/Chat";

const socket = io("https://connetiit.onrender.com");

interface ChatRoomProps {
  senderId?: string;
  receiverId?: string;
  room?: string | number;
}

const ChatRoom: React.FC = () => {
  const location = useLocation();
  const { Room, senderId, receiverId } =
    (location.state as ChatRoomProps) || {};
    

  useEffect(() => {
    try {

      if (senderId) {
        socket.emit("join_room", Room);
      }
    } catch (error) {
      
    }

  }, []);

  return (
    <div>
      <Chat socket={socket} username={senderId} roomid={Room} />
    </div>
  );
};

export default ChatRoom;
