import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router'; // Fixed import
import { Users, ArrowLeft, Search, Tags } from 'lucide-react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/shared/Loader';

const SOCKET_SERVER_URL = import.meta.env.SERVER;
// const SOCKET_SERVER_URL = 'http://localhost:3000';
// Initialize socket connection
const socket = io(SOCKET_SERVER_URL);

const AnonymousChat: React.FC = () => {
  const [anonymousId, setAnonymousId] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [mode, setMode] = useState<'interest' | 'random'>('random');
  const [isInQueue, setIsInQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  useEffect(() => {
    if (userProfile) {
      setAnonymousId(userProfile.anonymousId || `anon_${Math.random().toString(36).substring(2, 10)}`);

    }
  }, [userProfile]);

  useEffect(() => {
    // Setup socket event listeners
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('queued', (data) => {

      setIsInQueue(true);
      setQueuePosition(data.position);
    });

    socket.on('matched', ({ roomId, matchedUser }) => {
      setLoading(false);
      setIsInQueue(false);
      // Navigate to chat room with match information
      navigate(`/chat-room`, { 
        state: { 
          roomId,
          matchedUser,
          currentUser: {
            id: anonymousId,
            interests: hobbies
          }
        } 
      });
    });

    socket.on('queue-left', (data) => {

      setIsInQueue(false);
      setLoading(false);
    });

    socket.on('error', (error) => {

      setLoading(false);
      setIsInQueue(false);
      alert(`Error: ${error.message || 'Something went wrong'}`);
    });

    socket.on('disconnect', () => {

      setIsInQueue(false);
      setLoading(false);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('connect');
      socket.off('queued');
      socket.off('matched');
      socket.off('queue-left');
      socket.off('error');
      socket.off('disconnect');
      
      // Leave queue if component unmounts while in queue
      if (isInQueue) {
        socket.emit('leave-queue');
      }
    };
  }, [navigate, anonymousId, hobbies]);

  const handleRequestChat = () => {
    setLoading(true);
    
    // Validate inputs
    if (!anonymousId) {
      alert('Anonymous ID not available');
      setLoading(false);
      return;
    }
    
    // Format interests - trim and filter empty strings
    const formattedInterests = hobbies.map(h => h.trim()).filter(h => h !== '');
    
    const user = {
      id: anonymousId,
      socketId: socket.id,
      interests: formattedInterests.length > 0 ? formattedInterests : ['general'],
      mode
    };


    socket.emit('join-queue', user);
  };

  const handleCancelSearch = () => {
    socket.emit('leave-queue');
    setLoading(false);
    setIsInQueue(false);
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interestString = e.target.value;
    setHobbies(interestString.split(',').map(item => item.trim()).filter(item => item !== ''));
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
                onChange={handleInterestChange}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                          focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400
                          text-white backdrop-blur-sm transition-all"
              />
            </div>
            {hobbies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {hobbies.map((hobby, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                    {hobby}
                  </span>
                ))}
              </div>
            )}
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
            {mode === 'interest' && (
              <p className="text-xs text-gray-400 mt-1">
                You'll be matched with users who share at least one of your interests.
              </p>
            )}
          </div>

          {/* Find Chat Partner Button */}
          {!isInQueue ? (
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
                <Loader size="small" showFacts={false} message="Connecting..." />
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Find a Chat Partner
                </>
              )}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border border-purple-400/20 rounded-lg bg-purple-400/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                    <span className="text-purple-300 font-medium">Searching for a match...</span>
                  </div>
                  <span className="text-sm text-purple-200">Position: {queuePosition}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {mode === 'interest' 
                    ? "Looking for someone with similar interests..." 
                    : "Looking for anyone available to chat..."}
                </p>
              </div>
              
              <button
                onClick={handleCancelSearch}
                className="w-full py-2 px-4 rounded-lg border border-red-400/30 bg-red-400/10 hover:bg-red-400/20
                        text-red-300 font-medium transition-all duration-200"
              >
                Cancel Search
              </button>
            </div>
          )}

          {/* Status Messages */}
          {isInQueue && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  <span className="font-bold">{mode === 'interest' ? 'Interest-based' : 'Random'} matching</span>
                </div>
                <div className="text-sm text-gray-400">
                  <span className="font-bold">Anonymous ID:</span> {anonymousId.substring(0, 8)}...
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AnonymousChat;