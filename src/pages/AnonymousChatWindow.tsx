import React, { useState, useEffect, useRef } from "react";
import { databases, COLLECTIONS, client } from "../lib/appwrite/config";
import { Send } from "lucide-react";

interface Message {
  senderId: string;
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  chatId: string;
  userId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<() => void | null>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [messages, loading]);

  // Fetch messages function
  const fetchMessages = async () => {
    console.log("Fetching messages for chat:", chatId);
    setLoading(true);
    
    try {
      const chatData = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        COLLECTIONS.ANONYMOUS_CHATS,
        chatId
      );

      console.log("Chat data retrieved:", chatData);

      if (chatData.chatlogs && Array.isArray(chatData.chatlogs)) {
        const parsedMessages = chatData.chatlogs.map((msg: string) => {
          try {
            return JSON.parse(msg);
          } catch (e) {
            console.error("Failed to parse message:", msg, e);
            return null;
          }
        }).filter(Boolean);
        
        console.log("Parsed messages:", parsedMessages.length);
        setMessages(parsedMessages);
      } else {
        console.log("No chat logs found or invalid format");
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize and set up subscriptions
  useEffect(() => {
    // Clean up previous subscription if it exists
    if (subscriptionRef.current) {
      subscriptionRef.current();
    }

    fetchMessages();

    // Create new subscription
    const channelId = `databases.${import.meta.env.VITE_APPWRITE_DATABASE_ID}.collections.${COLLECTIONS.ANONYMOUS_CHATS}.documents.${chatId}`;
    console.log("Subscribing to channel:", channelId);
    
    // Store unsubscribe function in ref for later cleanup
    subscriptionRef.current = client.subscribe(channelId, (response) => {
      console.log("Received real-time update:", response);

      // Handle document updates - specifically watching for changes to the chatlogs field
      if (
        response.events.includes("databases.*.collections.*.documents.*.update") &&
        response.payload && 
        response.payload.chatlogs
      ) {
        console.log("Document updated with new messages, processing update");
        
        try {
          // Parse the messages from the update payload
          const updatedChatlogs = response.payload.chatlogs || [];
          const parsedMessages = updatedChatlogs.map((msg: string) => {
            try {
              return JSON.parse(msg);
            } catch (e) {
              console.error("Failed to parse message from update:", msg, e);
              return null;
            }
          }).filter(Boolean);
          
          console.log(`Received ${parsedMessages.length} messages in update`);
          
          // Update local state with new messages
          setMessages(parsedMessages);
        } catch (error) {
          console.error("Error processing message update:", error);
          // Fallback to re-fetching all messages
          fetchMessages();
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("Unmounting: unsubscribing from channel");
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }
    };
  }, [chatId]); // Only re-subscribe when chatId changes

  // Send a new message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = newMessage.trim();
    setNewMessage(''); // Clear input right away for better UX
    
    const newMsg = {
      senderId: userId,
      text: messageToSend,
      timestamp: new Date().toISOString()
    };

    console.log("Preparing to send message:", newMsg);
    
    try {
      // Get current chat data
      const chatData = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        COLLECTIONS.ANONYMOUS_CHATS,
        chatId
      );

      // Create new messages array with the new message
      const updatedMessages = [
        ...(chatData.chatlogs || []),
        JSON.stringify(newMsg)
      ];

      console.log("Updating document with total messages:", updatedMessages.length);
      
      // Update the chat document with new messages
      const response = await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        COLLECTIONS.ANONYMOUS_CHATS,
        chatId,
        { 
          chatlogs: updatedMessages,
          lastMessageAt: new Date().toISOString(),
          lastMessage: messageToSend
        }
      );
      
      console.log("Document updated successfully:", response.$id);
      
      // Temporarily add to local state for immediate feedback, 
      // will be overwritten when the subscription update arrives
      setMessages(prev => [...prev, newMsg]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert("Failed to send message. Please try again.");
      setNewMessage(messageToSend); // Restore the message text on error
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg bg-gray-900 text-white rounded-lg shadow-lg p-4 h-[80vh]">
      {/* Connection Status Indicator */}
      <div className="flex justify-end mb-2">
        <div className="flex items-center text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
          <span>Connected</span>
        </div>
      </div>
      
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={`${msg.timestamp}-${index}`}
              className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.senderId === userId
                    ? "bg-blue-600 rounded-br-none"
                    : "bg-gray-700 rounded-bl-none"
                }`}
              >
                <p className="text-sm break-words">{msg.text}</p>
                <span className="text-xs opacity-50 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="flex items-center mt-4 p-2 border-t border-gray-700">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          disabled={loading}
        />
        <button 
          type="submit" 
          className={`ml-2 p-3 rounded-lg transition-colors ${
            loading || !newMessage.trim() 
            ? "bg-blue-500/50 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading || !newMessage.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;