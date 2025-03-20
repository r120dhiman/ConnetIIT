import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Send } from 'lucide-react';
import Loader from '../shared/Loader';
import type { User } from '../../types';

// Import these functions from your message service
import { getMessages, sendMessage } from '../../lib/appwrite/messages';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

interface ChatAreaProps {
  selectedUser: User | null;
}

export function ChatArea({ selectedUser }: ChatAreaProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages when a user is selected
  useEffect(() => {
    if (!selectedUser || !user) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const fetchedMessages = await getMessages(user.$id, selectedUser.id);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user) return;
    
    try {
      setSending(true);
      const sentMessage = await sendMessage({
        content: newMessage,
        senderId: user.$id,
        receiverId: selectedUser.id
      });
      
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Your Messages</h3>
          <p className="mt-1 text-gray-500">Select a conversation or search for a user to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="px-4 py-3 border-b flex items-center">
        <div className="relative mr-3">
          <img
            src={selectedUser.profileUrl}
            alt={selectedUser.name}
            className="w-10 h-10 rounded-full"
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <div>
          <div className="font-medium">{selectedUser.name}</div>
          <div className="text-sm text-gray-500">
            {selectedUser.isOnline ? 'Online' : selectedUser.lastSeen ? 
              `Last seen ${formatDistanceToNow(new Date(selectedUser.lastSeen))} ago` : 
              'Offline'}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader size="medium" message="Loading messages..." />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user?.$id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 ${
                  message.senderId === user?.$id
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-white border rounded-bl-none'
                }`}
              >
                <div>{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.senderId === user?.$id ? 'text-primary-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 border-t bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-gray-300 focus:ring-primary focus:border-primary"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-primary text-white rounded-full disabled:opacity-50"
          >
            {sending ? (
              <Loader size="small" showFacts={false} />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 