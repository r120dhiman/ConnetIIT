import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Send, ArrowDown, Shield, UserX } from 'lucide-react';act';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';r';

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
  const navigate = useNavigate(););
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [Message, setMessage] = useState<string>("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [islive, setIslive] = useState(true);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const handleNewMessage = (data: MessageData) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  };

  const handleDropUser = () => { {
    setIslive(false);
    navigate('/chat-anonymously');
  }

  const handleSend = async () => {  const handleSend = async () => {
    if (Message.trim()) {
      const messageData: MessageData = {MessageData = {
        Message,
        roomid,
        SentAt: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`, `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
        username,
      };
      await socket.emit("new-message", messageData);ait socket.emit("new-message", messageData);
      handleNewMessage(messageData);
    }
    setMessage("");etMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });llIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {  const handleScroll = () => {
    if (chatBodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;lHeight, clientHeight } = chatBodyRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    }
  };

  useEffect(() => {  useEffect(() => {
    socket.on("new-msg-recieved", handleNewMessage);msg-recieved", handleNewMessage);
    return () => {
      socket.off("new-msg-recieved", handleNewMessage);new-msg-recieved", handleNewMessage);
    };
  }, [socket]);socket]);

  useEffect(() => {  useEffect(() => {
    scrollToBottom(););
  }, [messages]);

  return (  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg shadow-2xl overflow-hidden">    <div className="flex flex-col h-full bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
      {/* Chat Header */}Chat Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 p-4 shadow-lg">lg">
        <div className="flex items-center justify-between">lex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-medium">Anonymous Chat</h2>us Chat</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>l animate-pulse"></div>
              <span className="text-xs text-emerald-400">assName="text-xs text-emerald-400">
                {islive ? 'Secure Connection' : 'Connection Lost'}on Lost'}
              </span> </span>
            </div>v>
          </div>
          <div className="flex items-center space-x-4"> className="flex items-center space-x-4">
            <div className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full"><div className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
              Room #{roomid.substring(0, 6)}              Room #{roomid.substring(0, 6)}
            </div>
            <motion.button <motion.button
              whileHover={{ scale: 1.05 }}{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDropUser}
              className="p-2 text-red-400 hover:text-red-300 transition-colors"xt-red-400 hover:text-red-300 transition-colors"
              title="Leave Chat"       title="Leave Chat"
            >
              <UserX size={20} />
            </motion.button>tton>
          </div>
        </div>
      </div>

      {/* Chat Body */}
      <div
        ref={chatBodyRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-900" 
        style={{ maxHeight: "calc(100vh - 160px)" }} maxHeight: "calc(100vh - 160px)" }}
        onScroll={handleScroll}handleScroll}
      >
        <AnimatePresence>
          {messages.map((messageContent, index) => (
            <motion.div.div
              key={index}ey={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}}}
              transition={{ duration: 0.3 }}tion={{ duration: 0.3 }}
              className={`flex flex-col ${messageContent.username === username ? 'items-end' : 'items-start'} mb-4`}
            >
              {messageContent.username !== username && (Content.username !== username && (
                <span className="text-xs text-gray-500 ml-2 mb-1">Anonymous #{messageContent.username.substring(0, 4)}</span>n className="text-xs text-gray-500 ml-2 mb-1">Anonymous #{messageContent.username.substring(0, 4)}</span>
              )}
              <div <div
                className={`max-w-[70%] rounded-2xl p-3 ${] rounded-2xl p-3 ${
                  messageContent.username === usernameontent.username === username
                    ? 'bg-indigo-600 text-white rounded-tr-none'            ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-gray-800 text-gray-100 rounded-tl-none'-gray-100 rounded-tl-none'
                }`}
              >
                <p className="text-base break-words">{messageContent.Message}</p>rds">{messageContent.Message}</p>
                <div className="flex justify-end mt-1 text-xs opacity-60">nd mt-1 text-xs opacity-60">
                  {messageContent.SentAt}
                </div>
              </div>
            </motion.div> </motion.div>
          ))}
          <div ref={messagesEndRef} />esEndRef} />
        </AnimatePresence>AnimatePresence>

        {showScrollButton && (        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 right-8 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"fixed bottom-20 right-8 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
            onClick={scrollToBottom}ToBottom}
          >
            <ArrowDown size={20} />
          </motion.button>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">border-t border-gray-700">
        <div className="flex items-center space-x-2">ms-center space-x-2">
          <input
            type="text"
            value={Message} value={Message}
            name="message"
            className="flex-1 p-3 bg-gray-900 text-gray-100 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"x-1 p-3 bg-gray-900 text-gray-100 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
            onChange={(e) => setMessage(e.target.value)}Change={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}onKeyPress={handleKeyPress}
            placeholder="Type anonymously..."            placeholder="Type anonymously..."
          />
          <motion.button<motion.button
            whileTap={{ scale: 0.95 }}        whileTap={{ scale: 0.95 }}
            onClick={handleSend}          onClick={handleSend}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!Message.trim()}={!Message.trim()}










export default Chat;};  );    </div>      </div>        </div>          </motion.button>            <Send size={20} />          >          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Chat;