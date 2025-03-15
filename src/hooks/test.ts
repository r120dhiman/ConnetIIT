import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

// Define message structure
interface Message {
  senderId: string;
  receiverId?: string;
  message: string;
  timestamp: string;
}

// Hook return type
interface UseSocket {
  messages: Message[];
  sendMessage: (receiverId: string, message: string) => void;
  isConnected: boolean;
}

const useSocket = (senderId: string, receiverId: string): UseSocket => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  useEffect(() => {
    if (!senderId) return;

    // Only create a new socket if one doesn't exist
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000", {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        reconnectionDelay: 1000,
        query: { userId: senderId } // Pass userId in connection query
      });
    }

    const socket = socketRef.current;

    const handleConnect = () => {
      console.log(`Socket connected for user ${senderId}`);
      setIsConnected(true);
      reconnectAttempts.current = 0;
      socket.emit("register", senderId);
    };

    const handleDisconnect = (reason: string) => {
      console.log(`Socket disconnected for user ${senderId}. Reason: ${reason}`);
      setIsConnected(false);
      
      if (reason === "io server disconnect") {
        // Reconnect if server disconnected
        socket.connect();
      }
    };

    const handleReconnect = (attempt: number) => {
      console.log(`Reconnection attempt ${attempt} for user ${senderId}`);
      reconnectAttempts.current = attempt;
    };

    const handleReconnectError = (error: Error) => {
      console.error(`Reconnection error for user ${senderId}:`, error);
      if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
        console.log('Max reconnection attempts reached');
        socket.disconnect();
      }
    };

    // Set up event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnect', handleReconnect);
    socket.on('reconnect_error', handleReconnectError);
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on("receiveMessage", (message: Message) => {
      console.log("Received message:", message);
      if ((message.senderId === receiverId && message.receiverId === senderId) || 
          (message.senderId === senderId && message.receiverId === receiverId)) {
        setMessages(prev => [...prev, message]);
      }
    });

    // Clean up function
    return () => {
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('reconnect', handleReconnect);
        socket.off('reconnect_error', handleReconnectError);
        socket.off('connect_error');
        socket.off('receiveMessage');
        
        // Only disconnect if component is unmounting
        if (!socket.connected) {
          socket.disconnect();
          socketRef.current = null;
        }
      }
    };
  }, [senderId, receiverId]);

  const sendMessage = useCallback((receiverId: string, message: string) => {
    if (!message.trim() || !receiverId || !isConnected || !socketRef.current) {
      console.warn("Cannot send message:", { receiverId, isConnected });
      return;
    }

    const messageData = {
      senderId,
      receiverId,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    console.log(`Sending message from ${senderId} to ${receiverId}:`, messageData);
    socketRef.current.emit("sendMessage", messageData);
  }, [senderId, isConnected]);

  return { messages, sendMessage, isConnected };
};

export default useSocket;























