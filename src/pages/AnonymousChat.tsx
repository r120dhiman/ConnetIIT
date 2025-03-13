import React, { useState, useEffect, useRef } from 'react';
import { requestAnonymousChat, checkForChatMatch } from '../utils/matchmaking';
import { Link, useNavigate } from 'react-router';
import { Query } from 'appwrite';
import ChatWindow from './AnonymousChatWindow';
import { databases, COLLECTIONS, account } from '../lib/appwrite/config';
import { Users, ArrowLeft, Search, Tags } from 'lucide-react';
import { motion } from 'framer-motion';
import { div } from 'framer-motion/client';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const AnonymousChat: React.FC = () => {
  const [anonymousId, setAnonymousId] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [mode, setMode] = useState<'interest' | 'random'>('random');
  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const matchCheckIntervalRef = useRef<number | null>(null);
const navigate = useNavigate();

  useEffect(() => {
    const fetchAnonymousId = async () => {
      try {
        const user = await account.get();
        if (!user) return;
        const userdata = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [
          Query.equal("id", user.$id),
        ]);
        const randomId = userdata.documents[0].anonymousId;
        setAnonymousId(randomId.toString());
      } catch (error) {
        console.error("Error fetching anonymous ID:", error);
      }
    };

    fetchAnonymousId();
    
    // Clean up interval on component unmount
    return () => {
      if (matchCheckIntervalRef.current) {
        clearInterval(matchCheckIntervalRef.current);
      }
    };
  }, []);

  const handleRequestChat = async () => {
    if (matchCheckIntervalRef.current) {
      clearInterval(matchCheckIntervalRef.current);
      matchCheckIntervalRef.current = null;
    }

    setLoading(true);
    setChat(null);
    const startTime = Date.now();
    const searchDuration = 15000; // 5 seconds

    try {
      console.log(anonymousId, hobbies, mode);
      const chatData = await requestAnonymousChat(anonymousId, hobbies, mode);
      
      if (chatData && chatData.$id) {
        // We got a match immediately
        setChat(chatData);
        setLoading(false);
        return;
      }
      
      // No immediate match, set up interval to check for matches
      const checkInterval = setInterval(async () => {
        try {
          // Check if we've exceeded search duration
          if (Date.now() - startTime >= searchDuration) {
            clearInterval(checkInterval);
            matchCheckIntervalRef.current = null;
            setLoading(false);
            alert('No match found after 5 seconds.');
            return;
          }
          
          // Check for matches
          const matchResult = await checkForChatMatch(anonymousId);
          if (matchResult) {
            clearInterval(checkInterval);
            matchCheckIntervalRef.current = null;
            setChat(matchResult);
            setLoading(false);
          }
        } catch (err) {
          console.error("Error checking for match:", err);
        }
      }, 1000);
      
      matchCheckIntervalRef.current = checkInterval as unknown as number;
    } catch (error) {
      console.error("Error requesting chat:", error);
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/20"
      >
        {/* Header Section */}
        <div className="bg-black/30 p-6 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="text-white/80 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Link>
            <Users className="h-6 w-6 text-white/80" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Anonymous Mode
          </h2>
          <p className="text-gray-300">Your identity is hidden. Chat safely and freely.</p>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6 bg-black/20">
          {/* Interests Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">Your Interests</label>
            <div className="relative">
              <Tags className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Gaming, Music, Travel..."
                onChange={(e) => setHobbies(e.target.value.split(','))}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                          focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400
                          text-white backdrop-blur-sm transition-all"
              />
            </div>
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">Match Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'interest' | 'random')}
              className="w-full pl-3 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg
                        focus:ring-2 focus:ring-purple-500 focus:border-transparent
                        text-white backdrop-blur-sm"
            >
              <option value="random" className="bg-gray-900">Random Match</option>
              <option value="interest" className="bg-gray-900">Interest-based Match</option>
            </select>
          </div>

          {/* Find Chat Partner Button */}
          <button
            onClick={handleRequestChat}
            disabled={loading || !anonymousId}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg
              font-medium transition-all duration-200 ${
                loading || !anonymousId
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 active:transform active:scale-95'
              } text-white backdrop-blur-sm`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-3 h-3 bg-white rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-3 h-3 bg-white rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-3 h-3 bg-white rounded-full"
                ></motion.div>
                Searching...
              </div>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Find a Chat Partner
              </>
            )}
          </button>

          {/* Chat Result with Entry Animation */}
          {chat && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 p-4 border border-green-400/20 rounded-lg bg-green-400/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                Match Found!
              </div>
              <div className="space-y-1 text-sm text-gray-300">
                <p className="font-mono">ID: {chat.$id}</p>
                <p>Status: <span className="text-green-400">{chat.receiverId}</span></p>
              </div>
            </motion.div>
          )}
          {chat &&
          <div className="flex items-center justify-center mt-4">
            <ChatWindow chatId={chat.$id} userId={chat.receiverId}/>
            </div>}
        </div> 
      </motion.div>
    </div>
  );
};

export default AnonymousChat;