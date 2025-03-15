import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Send, ArrowDown, Heading1 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {useNavigate} from 'react-router'

interface ChatProps {
  socket: Socket;
  username: string;
  roomid: string;
}

interface MessageData {
  Message: string;
  roomid: string;
  SentAt: string;
  username: string;
}

const Chat: React.FC<ChatProps> = ({ socket, username, roomid }) => {
  const navigate=useNavigate();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [Message, setMessage] = useState<string>("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [islive, setIslive] = useState(true);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const handleNewMessage = (data: MessageData) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  };

  const handleDropUser=() => {
    setIslive(false);
    navigate('/chat-anonymously');
  }
  

  const handleSend = async () => {
    if (Message.trim()) {
      const messageData: MessageData = {
        Message,
        roomid,
        SentAt: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
        username,
      };
      await socket.emit("new-message", messageData);
      handleNewMessage(messageData);
    }
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (chatBodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    }
  };

  useEffect(() => {
    socket.on("new-msg-recieved", handleNewMessage);
    return () => {
      socket.off("new-msg-recieved", handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-semibold">Live Chat</h2>
            {islive ? 
            <h1>Connected</h1>:<h1>User Disconnected</h1>
            }
          </div>
          <div className="text-sm text-white/80">Room: {roomid}</div>
        </div>
      </div>

      {/* Chat Body */}
      <div 
        ref={chatBodyRef} 
        className="flex-1 overflow-y-auto p-4 bg-gray-100" 
        style={{ maxHeight: "calc(100vh - 160px)" }}
        onScroll={handleScroll}
      >
        <AnimatePresence>
          {messages.map((messageContent, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col ${messageContent.username === username ? 'items-end' : 'items-start'} mb-4`}
            >
              {messageContent.username !== username && (
                <span className="text-xs text-gray-500 ml-2 mb-1">{messageContent.username}</span>
              )}
              <div
                className={`max-w-[70%] rounded-2xl p-3 ${messageContent.username === username
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-tr-none'
                  : 'bg-white shadow-md rounded-tl-none'
                }`}
              >
                <p className={`text-base ${messageContent.username === username ? 'text-white' : 'text-gray-800'}`}>
                  {messageContent.Message}
                </p>
                <div className={`flex justify-end mt-1 text-xs ${messageContent.username === username ? 'text-white/70' : 'text-gray-500'}`}>
                  <p>{messageContent.SentAt}</p>
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </AnimatePresence>
        
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 right-8 bg-indigo-600 text-white p-2 rounded-full shadow-lg"
            onClick={scrollToBottom}
          >
            <ArrowDown size={20} />
          </motion.button>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={Message}
            name="message"
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Start writing..."
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-full shadow hover:shadow-lg transition-all"
            disabled={!Message.trim()}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>

      <button  onClick={handleDropUser} >Drop This user</button>
    </div>
  );
};

export default Chat;