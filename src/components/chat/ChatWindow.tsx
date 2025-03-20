import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Send } from 'lucide-react';
import { useChat } from '../../hooks/useChat';


interface ChatWindowProps {
  otherUserId: string;
  otherUserName: string;
  isOnline: boolean;
  lastSeen?: string;
}

export function ChatWindow({ otherUserId, otherUserName, isOnline, lastSeen }: ChatWindowProps) {
  const { messages, loading, sendMessage } = useChat(otherUserId);
  console.log(otherUserId);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log("msgs", messages);
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("clicked send btn");
    
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(newMessage);
      console.log("sending msg");
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat header - more compact on mobile */}
      <div className="p-3 sm:p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200" />
              <span
                className={`absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
                  isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
                {otherUserName}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 hidden xs:block">
                {isOnline ? 'Online' : lastSeen ? `Last seen ${formatDistanceToNow(new Date(lastSeen))} ago` : 'Offline'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages - adjust max height based on screen size */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4 bg-gray-50" 
           style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-gray-500 text-sm">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm sm:text-base">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === otherUserId ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                  message.senderId === otherUserId
                    ? 'bg-gray-100'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <p className="text-sm sm:text-base break-words">{message.content}</p>
                <p className="text-[10px] sm:text-xs mt-1 opacity-70">
                  {formatDistanceToNow(new Date(message.$createdAt))} ago
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input - more compact on mobile */}
      <form onSubmit={handleSubmit} className="p-2 sm:p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-sm sm:text-base py-1.5 sm:py-2 px-3 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
          <button
            type="submit"
            className="p-1.5 sm:p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}