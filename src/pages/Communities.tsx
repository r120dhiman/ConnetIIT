import React, { useState, useEffect } from 'react';
import { databases } from '../lib/appwrite';
import { COLLECTIONS } from '../lib/appwrite/config';
import { Card, CardContent, Typography } from '@mui/material';
import { MessageSquare, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getRoomChats, sendRoomChat, subscribeToRoomChats } from '../lib/appwrite/roomChat';
import { useAuth } from '../contexts/AuthContext';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

interface Community {
  $id: string;
  name: string;
  membersList: string[];
  msgLogs: string[];
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

const Communities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();

  // Updated colors matching the new theme
  const colors = {
    background: {
      default: '#1B1730', // New background color
      paper: '#2A2635', // Slightly lighter for paper elements
      alt: '#2C2A3A', // Alternative background color
    },
    text: {
      primary: '#ffffff', // Changed to white for better contrast
      secondary: '#e0e0e0', // Lighter gray for secondary text
      muted: '#b0b0b0',
    },
    primary: {
      main: '#FE744D', // Primary button color
    },
  };

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.COMMUNITIES
        );
        const typedDocuments = response.documents as Community[];

        // Filter communities to only include those where the user is a participant
        const userCommunities = typedDocuments.filter(community => 
          community.membersList.includes(user ? user.$id : '')
        );

        setCommunities(userCommunities);
        if (userCommunities.length > 0) {
          const selectedComm = userCommunities[0];
          const messages = await getRoomChats(selectedComm.$id); // Fetch messages using community.$id
          const msgLogsContent = await Promise.all(
            messages.map(async (msg) => {
              const sender = await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, msg.senderId);
              return {
                content: msg.content,
                senderId: msg.senderId,
                senderName: sender.name,
                timeStamp: msg.timestamp,
              };
            })
          );

          setSelectedCommunity({ ...selectedComm, msgLogs: msgLogsContent }); // Set selected community with msgLogs
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    if (selectedCommunity) {
      // Subscribe to room chats for the selected community
      const unsubscribe = subscribeToRoomChats(selectedCommunity.$id, (newMessage) => {
        setSelectedCommunity(prev => prev ? {
          ...prev,
          msgLogs: [...prev.msgLogs, newMessage.content] // Update msgLogs with new message content
        } : prev);
      });

      return () => {
        unsubscribe(); // Clean up the subscription on component unmount
      };
    }
  }, [selectedCommunity]); // Run this effect when selectedCommunity changes

  const handleSendMessage = async () => {
    if (!selectedCommunity || !newMessage.trim() || !user) return;

    try {
      const response = await sendRoomChat(selectedCommunity.$id, newMessage, user.$id);
      const messageId = response.$id; // Assuming the response contains the message ID

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.COMMUNITIES,
        selectedCommunity.$id,
        { msgLogs: [...selectedCommunity.msgLogs, messageId] } // Push message ID to msgLogs array
      );

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background.default }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Communities</h1>
        
        {/* Community Navigation */}
        <div className="flex overflow-x-auto py-6 gap-4 mb-8 scrollbar-hide">
          {communities.map((community) => (
           <button
           key={community.$id}
           onClick={async () => {
             try {
               const selectedComm = communities.find(c => c.$id === community.$id);
               if (!selectedComm) return;
     
               // Fetch messages for the selected community
               const messages = await getRoomChats(selectedComm.$id);
               
               const msgLogsContent = await Promise.all(
                 messages.map(async (msg) => {
                  console.log(msg.timestamp);
                   const sender = await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, msg.senderId);
                   return {
                     content: msg.content,
                     senderId: msg.senderId,
                     senderName: sender.name,
                     timeStamp: msg.timestamp,
                   };
                 })
               );
     
     
               setSelectedCommunity({ ...selectedComm, msgLogs: msgLogsContent });
               setIsChatOpen(true);
             } catch (error) {
               console.error('Error fetching messages:', error);
             }
           }}
           className={`px-6 py-3 rounded-full whitespace-nowrap transform transition-all duration-300 hover:scale-105 shadow-md ${
             selectedCommunity?.$id === community.$id
               ? 'bg-gradient-to-r from-[#FE744D] to-[#FE744D] text-white font-bold'
               : 'bg-white hover:bg-gray-50'
           }`}
         >
           {community.name}
         </button>
          ))}
        </div>

        {/* Chat Toggle Button */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
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
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <Typography variant="h6" className="font-bold text-[#fafafa]">
                    {selectedCommunity.name} Chat
                  </Typography>
                  <button 
                    onClick={() => setIsChatOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4  space-y-4">
                  {selectedCommunity.msgLogs.length > 0 ? (
                    selectedCommunity.msgLogs.map((msg, index) => {
                      return (
                      <div key={index} className={`flex  ${msg.senderId !== user.$id ? 'justify-start' : 'justify-end'}`}>
                        <div className="transform transition-all duration-200 hover:scale-[1.02]">
                          <div className={`py-1 px-3 rounded-full bg-[#392639] ${msg.senderId ===user.$id ? 'bg-[#392639]':""}`}>
                            <Typography className="text-[#fafafa] ">{msg.content}</Typography>
                            <p className='text-white text-xs'>
  {msg.timeStamp ? new Date(msg.timeStamp).toLocaleString() : "Invalid Date"}
</p>
                          </div>
                          <p className='text-white'>{msg.senderName.split(' ')[0]}&nbsp;{msg.senderName.split(' ')[1]}</p>
                        </div>
                      </div>
                    )})
                  ) : (
                    <Typography className="text-gray-500 text-center italic">
                      Start the conversation...
                    </Typography>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FE744D] focus:border-transparent"
                      style={{ color: 'black', backgroundColor: '#fafafa' }} // Set input text color to white
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-gradient-to-r from-[#FE744D] to-[#FE744D] text-white rounded-full font-semibold hover:opacity-90"
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
