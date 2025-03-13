import React, { useState, useEffect } from 'react';
import { databases } from '../lib/appwrite';
import { COLLECTIONS } from '../lib/appwrite/config';
import { Card, CardContent, Typography } from '@mui/material';
import { Header } from '../components/layout/Header';
import { MessageSquare, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.COMMUNITIES
        );
        const typedDocuments = response.documents as unknown as Community[];
        setCommunities(typedDocuments);
        if (typedDocuments.length > 0) {
          setSelectedCommunity(typedDocuments[0]);
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();
  }, []);

  const handleSendMessage = async () => {
    if (!selectedCommunity || !newMessage.trim()) return;

    try {
      const updatedMsgLogs = [...selectedCommunity.msgLogs, newMessage];
      
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.COMMUNITIES,
        selectedCommunity.$id,
        { msgLogs: updatedMsgLogs }
      );

      setSelectedCommunity({
        ...selectedCommunity,
        msgLogs: updatedMsgLogs
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Header />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Communities</h1>
        
        {/* Community Navigation */}
        <div className="flex overflow-x-auto py-6 gap-4 mb-8 scrollbar-hide">
          {communities.map((community) => (
            <button
              key={community.$id}
              onClick={() => {
                setSelectedCommunity(community);
                setIsChatOpen(true);
              }}
              className={`px-6 py-3 rounded-full whitespace-nowrap transform transition-all duration-300 hover:scale-105 shadow-md ${
                selectedCommunity?.$id === community.$id
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold'
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
            className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
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
              className="fixed bottom-0 right-0 w-[32rem] h-[70vh] bg-white shadow-2xl z-40"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <Typography variant="h6" className="font-bold text-gray-800">
                    {selectedCommunity.name} Chat
                  </Typography>
                  <button 
                    onClick={() => setIsChatOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedCommunity.msgLogs.length > 0 ? (
                    selectedCommunity.msgLogs.map((msg, index) => (
                      <Card key={index} className="transform transition-all duration-200 hover:scale-[1.02]">
                        <CardContent className="py-3 px-4 bg-gradient-to-r from-white to-gray-50">
                          <Typography className="text-gray-700">{msg}</Typography>
                        </CardContent>
                      </Card>
                    ))
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
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-semibold hover:opacity-90"
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
