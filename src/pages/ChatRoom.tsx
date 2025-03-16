import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { ArrowLeft, Send, User, Clock, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000';
const socket = io(SOCKET_SERVER_URL);

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

interface ChatRoomProps {}

const ChatRoom: React.FC<ChatRoomProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, matchedUser, currentUser } = location.state || {};
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Validate room information
    if (!roomId || !matchedUser || !currentUser) {
      console.error("Missing room information");
      navigate('/');
      return;
    }

    // Join the room
    socket.emit('join-room', { roomId });
    console.log(`Joined room: ${roomId}`);

    // Add system message for room join
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      sender: 'system',
      text: `You are now chatting with a stranger. Say hello!`,
      timestamp: Date.now()
    };
    setMessages([systemMessage]);

    // Handle incoming messages
    socket.on('receive-message', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
      setIsTyping(false);
    });

    // Handle typing indicator
    socket.on('typing', () => {
      setIsTyping(true);
      // Clear typing indicator after 2 seconds of inactivity
      setTimeout(() => setIsTyping(false), 2000);
    });

    // Handle partner disconnection
    socket.on('user-disconnected', () => {
      console.log('User has disconnected from the chat.'); // Log the disconnection event
      const disconnectMessage: Message = {
        id: `system-${Date.now()}`,
        sender: 'system',
        text: 'Your chat partner has disconnected.',
        timestamp: Date.now()
      };
      setMessages(prevMessages => [...prevMessages, disconnectMessage]);
      setPartnerDisconnected(true);
      // Redirect to chat-anonymously page
    //   navigate('/chat-anonymously');
    });

    // Cleanup on component unmount
    return () => {
      socket.off('receive-message');
      socket.off('typing');
      socket.off('user-disconnected');
      socket.emit('leave-room', { roomId });
    };
  }, [roomId, matchedUser, currentUser, navigate]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;
    
    const newMessage: Message = {
      id: `${currentUser.id}-${Date.now()}`,
      sender: currentUser.id,
      text: inputMessage,
      timestamp: Date.now()
    };
    
    // Add message to local state
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Send message to server
    socket.emit('send-message', { roomId, message: newMessage });
    
    // Clear input
    setInputMessage('');
  };

  const handleTyping = () => {
    socket.emit('typing', { roomId });
  };

  const handleFindNewChat = () => {
    navigate('/chat-anonymously');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-black/30 p-4 backdrop-blur flex items-center justify-between">
          <Link
            to="/chat-anonymously"
            className="text-white/80 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Leave Chat
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white/90">Anonymous Chat</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          </div>
        </div>

        {/* Chat Info */}
        <div className="bg-black/20 p-3 backdrop-blur">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-400" />
              <span className="text-white/80">Matched via: {matchedUser?.interests?.length > 0 ? 'Interests' : 'Random'}</span>
            </div>
            {matchedUser?.interests?.length > 0 && (
              <div className="flex items-center gap-1">
                {matchedUser.interests.slice(0, 2).map((interest: string, index: number) => (
                  <span key={index} className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                    {interest}
                  </span>
                ))}
                {matchedUser.interests.length > 2 && (
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                    +{matchedUser.interests.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-black/10 backdrop-blur p-4 space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`max-w-[80%] ${
                msg.sender === currentUser.id
                  ? 'ml-auto bg-purple-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl'
                  : msg.sender === 'system'
                  ? 'mx-auto bg-gray-800/50 text-gray-300 rounded-xl text-center'
                  : 'mr-auto bg-gray-700 text-white rounded-tl-xl rounded-tr-xl rounded-br-xl'
              } p-3 shadow-md`}
            >
              <div className="text-sm">{msg.text}</div>
              <div className={`text-xs mt-1 flex items-center ${
                msg.sender === currentUser.id ? 'justify-end text-purple-200' : 'justify-start text-gray-400'
              }`}>
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(msg.timestamp)}
              </div>
            </motion.div>
          ))}
          
          {isTyping && !partnerDisconnected && (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="bg-gray-700 rounded-full p-2">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 bg-white rounded-full"
                ></motion.div>
              </div>
              <div className="text-xs">Stranger is typing...</div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {!partnerDisconnected ? (
          <form onSubmit={handleSendMessage} className="bg-black/30 p-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleTyping}
                placeholder="Type a message..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={inputMessage.trim() === ''}
                className={`p-2 rounded-lg ${
                  inputMessage.trim() === ''
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                } transition-colors`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-black/30 p-4 backdrop-blur text-center">
            <p className="text-white/80 mb-3">Chat ended. Your partner has disconnected.</p>
            <button
              onClick={handleFindNewChat}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Find a New Chat Partner
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;