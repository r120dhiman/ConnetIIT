import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Send, ArrowDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [Message, setMessage] = useState<string>("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('chatActive');
    };

    // Check if we have an active chat session
    const chatActive = sessionStorage.getItem('chatActive');
    if (!chatActive) {
      sessionStorage.setItem('chatActive', 'true');
    } else {
      navigate('/chat-anonymously');
    }

    // Add event listener for page refresh/close
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      sessionStorage.removeItem('chatActive');
    };
  }, [navigate]);

  const handleNewMessage = (data: MessageData) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  };

  const handleDropUser = () => {
    navigate('/chat-anonymously');
  };

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
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
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
    <div className="flex flex-col h-screen max-w-screen mx-auto bg-gray-900 text-white shadow-xl  overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-lg font-semibold">Anonymous Chat</h2>
        <button
          onClick={handleDropUser}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatBodyRef} 
        className="flex-1 overflow-y-auto p-4 bg-gray-800" 
        onScroll={handleScroll}
      >
        <AnimatePresence>
          {messages.map((messageContent, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${messageContent.username === username ? 'justify-end' : 'justify-start'} mb-3`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow-md ${messageContent.username === username ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200'}`}
              >
                <p>{messageContent.Message}</p>
                <div className="text-right text-xs opacity-70 mt-1">{messageContent.SentAt}</div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-20 right-8 bg-blue-500 text-white p-2 rounded-full shadow-lg"
          onClick={scrollToBottom}
        >
          <ArrowDown size={20} />
        </motion.button>
      )}

      {/* Chat Input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={Message}
            className="flex-1 p-3 border border-gray-600 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Say something anonymously..."
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all"
            disabled={!Message.trim()}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
