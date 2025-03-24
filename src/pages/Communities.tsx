import React, { useState, useEffect, useCallback, useRef } from "react";
import { databases } from "../lib/appwrite";

import { Query } from "appwrite"; // Make sure to import Query
import { Typography } from "@mui/material";
import { MessageSquare, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getRoomChats,
  sendRoomChat,
  subscribeToRoomChats,
} from "../lib/appwrite/roomChat";
import { useAuth } from "../contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERS = import.meta.env.VITE_APPWRITE_USERS;
const ROOMCHAT = import.meta.env.VITE_APPWRITE_ROOMCHAT;
const COMMUNITIES = import.meta.env.VITE_APPWRITE_COMMUNITTIES;
const MESSAGES_PER_PAGE = 7;

// Database structure
interface CommunityDocument {
  $id: string;
  name: string;
  membersList: string[];
  msgLogs: string[]; // Just IDs in the database
  posts: CommunityPost[];
}

// UI representation with extended data
interface MessageDetails {
  $id?: string;
  content: string;
  senderId: string;
  senderName: string;
  timeStamp: string;
}

// UI representation of Community with message details
interface Community {
  $id: string;
  name: string;
  membersList: string[];
  msgLogs: MessageDetails[]; // Full message objects for UI
  posts: CommunityPost[];
}

interface CommunityPost {
  id: string;
  content: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
}

// Custom function to implement pagination for getRoomChats
const getPagedRoomChats = async (roomId: string, limit: number, offset: number) => {
  try {
    // We'll implement our own pagination since getRoomChats doesn't support it
    const response = await databases.listDocuments(
      DATABASE_ID,
ROOMCHAT,
      [
        Query.equal('roomId', roomId),
        Query.orderDesc('$createdAt'), // Order by creation date descending (newest first)
        Query.limit(limit),
        Query.offset(offset)
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching paged room chat:', error);
    throw error;
  }
};

const Communities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const unsubscribeRef = useRef<() => void>(() => {});
  const initialLoadComplete = useRef(false);
  const shouldScrollToBottom = useRef(false);

  // Cache for user names
  const userNameCache = useRef<Record<string, string>>({});

  // Updated colors matching the new theme
  const colors = {
    background: {
      default: "#1B1730",
      paper: "#2A2635", 
      alt: "#2C2A3A",
    },
    text: {
      primary: "#ffffff",
      secondary: "#e0e0e0",
      muted: "#b0b0b0",
    },
    primary: {
      main: "#FE744D",
    },
  };

  // Memoized function to get user name - reduces redundant API calls
  const getUserName = useCallback(async (userId: string): Promise<string> => {
    // Return cached name if available
    if (userNameCache.current[userId]) {
      return userNameCache.current[userId];
    }

    try {
      const sender = await databases.getDocument(
        DATABASE_ID,
USERS,
        userId
      );
      userNameCache.current[userId] = sender.name || "Unknown";
      return sender.name;
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown";
    }
  }, []);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Fetch communities once on component mount
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const response = await databases.listDocuments(
          DATABASE_ID,
COMMUNITIES
        );
        const communityDocuments = response.documents as CommunityDocument[];

        // Filter communities to only include those where the user is a participant
        const userCommunities = communityDocuments.filter((community) =>
          community.membersList.includes(user ? user.$id : "")
        );

        if (userCommunities.length > 0) {
          // Convert to UI representation with minimal data initially
          const uiCommunities = userCommunities.map((comm) => ({
            ...comm,
            msgLogs: [] as MessageDetails[],
          })) as Community[];

          setCommunities(uiCommunities);

          // Only load messages if we have communities
          if (uiCommunities.length > 0) {
            setSelectedCommunity(uiCommunities[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCommunities();
    }
    
    // Cleanup function
    return () => {
      unsubscribeRef.current();
    };
  }, [user]);

  // Load messages for selected community with pagination
  useEffect(() => {
    if (!selectedCommunity) return;
    
    // Clear existing subscription
    unsubscribeRef.current();
    
    // Reset pagination when community changes
    setCurrentPage(1);
    setHasMoreMessages(true);
    initialLoadComplete.current = false;
    shouldScrollToBottom.current = true;
    
    loadCommunityMessages(selectedCommunity.$id, 1);
    
    // Subscribe to new messages
    const unsubscribe = subscribeToRoomChats(
      selectedCommunity.$id,
      async (newMessage) => {
        try {
          const senderName = await getUserName(newMessage.senderId);

          const newMessageDetails: MessageDetails = {
            $id: newMessage.$id,
            content: newMessage.content,
            senderId: newMessage.senderId,
            senderName,
            timeStamp: newMessage.timestamp,
          };

          setSelectedCommunity((prev) =>
            prev
              ? {
                  ...prev,
                  msgLogs: [...prev.msgLogs, newMessageDetails],
                }
              : prev
          );
          
          // Don't auto-scroll for incoming messages that aren't from the current user
          // Let those be notifications that the user can scroll to see
        } catch (error) {
          console.error("Error processing new message:", error);
        }
      }
    );
    
    // Store unsubscribe function
    unsubscribeRef.current = unsubscribe;
    
    return () => {
      unsubscribe();
    };
  }, [selectedCommunity?.$id, getUserName]);

  const loadCommunityMessages = async (communityId: string, page: number) => {
    if (loading || !hasMoreMessages) return;
    
    try {
      setLoading(true);
      
      // Get paginated messages using our custom function
      const messages = await getPagedRoomChats(
        communityId, 
        MESSAGES_PER_PAGE, 
        (page - 1) * MESSAGES_PER_PAGE
      );
      
      // Check if we have more messages
      setHasMoreMessages(messages.length === MESSAGES_PER_PAGE);
      
      // Process messages in parallel with Promise.all
      const messagePromises = messages.map(async (msg) => {
        const senderName = await getUserName(msg.senderId);
        return {
          $id: msg.$id,
          content: msg.content,
          senderId: msg.senderId,
          senderName,
          timeStamp: msg.timestamp || msg.$createdAt,
        };
      });
      
      const msgLogsContent = await Promise.all(messagePromises);
      
      // Update selected community with message details
      setSelectedCommunity((prev) => {
        if (!prev) return null;
        
        if (page === 1) {
          // First page - replace messages
          return {
            ...prev,
            msgLogs: msgLogsContent,
          };
        } else {
          // Additional pages - prepend messages (older messages come first)
          return {
            ...prev,
            msgLogs: [...msgLogsContent, ...prev.msgLogs],
          };
        }
      });
      
      setCurrentPage(page);

      // For initial load (page 1), mark initial load as complete
      if (page === 1) {
        initialLoadComplete.current = true;
        
        // If we should scroll to bottom after loading (for first open or new community), do it
        if (shouldScrollToBottom.current) {
          setTimeout(scrollToBottom, 100);
          shouldScrollToBottom.current = false;
        }
      }
    } catch (error) {
      console.error("Error loading community messages:", error);
      setHasMoreMessages(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle scroll to load more messages
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || loading || !hasMoreMessages) return;
    
    // Load more when scrolled to top (since messages are displayed newest at bottom)
    if (container.scrollTop < 50) {
      loadCommunityMessages(selectedCommunity?.$id || "", currentPage + 1);
    }
  }, [selectedCommunity?.$id, currentPage, loading, hasMoreMessages]);

  // Set up scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Effect to scroll to bottom when chat is opened
  useEffect(() => {
    if (isChatOpen && initialLoadComplete.current) {
      setTimeout(scrollToBottom, 300); // Delay to ensure animation completes
    }
  }, [isChatOpen, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!selectedCommunity || !newMessage.trim() || !user) return;

    // Store the message locally and clear input immediately
    const messageToSend = newMessage.trim();
    setNewMessage("");

    try {
      // Send the message to the chat room
      await sendRoomChat(
        selectedCommunity.$id,
        messageToSend,
        user.$id
      );
      
      // Optimistically add the message to the UI
      // const newMessageDetails: MessageDetails = {
      //   content: messageToSend,
      //   senderId: user.$id,
      //   senderName: userNameCache.current[user.$id] || "Me",
      //   timeStamp: new Date().toISOString(),
      // };

      // setSelectedCommunity(prev => {
      //   if (!prev) return null;
      //   return {
      //     ...prev,
      //     msgLogs: [...prev.msgLogs, newMessageDetails]
      //   };
      // });
      
      // Scroll to bottom after sending a message
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Optimized selection handler
  const handleSelectCommunity = useCallback(async (communityId: string) => {
    try {
      const selectedComm = communities.find(c => c.$id === communityId);
      if (!selectedComm) return;
      
      // Set the selected community immediately with empty messages
      setSelectedCommunity({...selectedComm, msgLogs: []});
      setIsChatOpen(true);
      
      // Reset pagination
      setCurrentPage(1);
      setHasMoreMessages(true);
      initialLoadComplete.current = false;
      shouldScrollToBottom.current = true;
      
      // Messages will be loaded by the useEffect that watches selectedCommunity
    } catch (error) {
      console.error("Error selecting community:", error);
    }
  }, [communities]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.default }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Communities</h1>

        {/* Community Navigation - Using windowing for large lists */}
        <div className="flex overflow-x-auto py-6 gap-4 mb-8 scrollbar-hide">
          {communities.map((community) => (
            <button
              key={community.$id}
              onClick={() => handleSelectCommunity(community.$id)}
              className={`px-6 py-3 rounded-full whitespace-nowrap transform transition-all duration-300 hover:scale-105 shadow-md ${
                selectedCommunity?.$id === community.$id
                  ? "bg-gradient-to-r from-[#FE744D] to-[#FE744D] text-white font-bold"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {community.name}
            </button>
          ))}
        </div>

        {/* Chat Toggle Button */}
        {!isChatOpen && (
          <button
            onClick={() => {
              setIsChatOpen(true);
              shouldScrollToBottom.current = true;
            }}
            className="fixed bottom-20 right-8 p-4 bg-gradient-to-r from-[#FE744D] to-[#FE744D] rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          >
            <MessageSquare className="h-6 w-6 text-white" />
          </button>
        )}

        {/* Chatbox */}
        <AnimatePresence>
          {isChatOpen && selectedCommunity && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-12 right-0 w-full max-w-[32rem] h-[70vh] bg-[#262438] shadow-2xl z-40"
              onAnimationComplete={() => {
                if (initialLoadComplete.current && shouldScrollToBottom.current) {
                  scrollToBottom();
                  shouldScrollToBottom.current = false;
                }
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <Typography variant="h6" className="font-bold text-[#fafafa]">
                    {selectedCommunity.name} Chat
                  </Typography>
                  <div className="flex items-center">
                    {loading && (
                      <div className="w-4 h-4 border-2 border-t-transparent border-[#FE744D] rounded-full animate-spin mr-2"></div>
                    )}
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Messages Container - with virtualization for performance */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {hasMoreMessages && currentPage > 1 && (
                    <div className="text-center py-2">
                      <button 
                        onClick={() => loadCommunityMessages(selectedCommunity.$id, currentPage + 1)}
                        className="text-sm text-white bg-[#392639] px-4 py-1 rounded-full hover:bg-[#4a324a]"
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Load more messages"}
                      </button>
                    </div>
                  )}
                  
                  {selectedCommunity.msgLogs.length > 0 ? (
                    selectedCommunity.msgLogs.map((msg, index) => (
                      <div
                        key={msg.$id || index}
                        className={`flex ${
                          msg.senderId !== user?.$id
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div className="transform transition-all duration-200 hover:scale-[1.02] max-w-[80%]">
                          <div
                            className={`py-1 px-3 rounded-full bg-[#392639] ${
                              msg.senderId === user?.$id ? "bg-[#392639]" : ""
                            }`}
                          >
                            <Typography className="text-[#fafafa] break-words">
                              {msg.content}
                            </Typography>
                            <p className="text-white text-xs">
                            {msg.timeStamp ? formatDistanceToNow(new Date(msg.timeStamp), { addSuffix: true }) : ""}
                            </p>
                          </div>
                          <p className="text-white text-sm truncate">
                            {msg.senderName
                              ? `${msg.senderName.split(" ")[0]}`
                              : "Unknown"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Typography className="text-gray-500 text-center italic">
                      {loading ? "Loading messages..." : "Start the conversation..."}
                    </Typography>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && !e.shiftKey && handleSendMessage()
                      }
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FE744D] focus:border-transparent"
                      style={{ color: "black", backgroundColor: "#fafafa" }}
                      disabled={loading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={loading || !newMessage.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-[#FE744D] to-[#FE744D] text-white rounded-full font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Communities;