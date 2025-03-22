import React, { useState, useEffect } from 'react';
import { ChatWindow } from '../components/chat/ChatWindow';
import { UserList } from '../components/chat/UserList';
import { useAuth } from '../contexts/AuthContext';
import { updateUserStatus } from '../lib/appwrite/users';
import type { User } from '../types';
import { Header } from '../components/layout/Header';

// Check that this interface matches your actual data structure
interface User {
  id: string;
  name: string;
  profileUrl: string;
  college?: string;
  isOnline?: boolean;
  lastSeen?: string | null;
}

export function Chat() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  console.log(selectedUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Update online status
  useEffect(() => {
    if (!user) return;

    // Set online status when component mounts
    updateUserStatus(user.$id, true);
    console.log("user online",user.$id);
    
    // Set offline status when component unmounts
    return () => {
      updateUserStatus(user.$id, false);
      console.log("user offline",user.$id);
    };
  }, [user]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goBackToUserList = () => {
    setSelectedUser(null);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedUser) return;
    
    // Here you would normally send the message to your backend
    console.log(`Sending message to ${selectedUser.name}: ${messageText}`);
    
    // Clear the input after sending
    setMessageText('');
  };

  // Desktop view - original layout
  if (!isMobileView) {
    return (
      <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)]">
        <Header/>
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Users sidebar */}
          <div className="col-span-4 bg-[#1B1730] rounded-3xl shadow-md m-4">
            <UserList
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedUserId={selectedUser?.id ?? null}
              onSelectUser={setSelectedUser}
            />
          </div>

          {/* Chat window */}
          <div className="col-span-8">
            {selectedUser ? (
              <div className="h-full flex flex-col">
                <ChatWindow
                  otherUserId={selectedUser}
                  otherUserName={selectedUser.name}
                  isOnline={selectedUser.isOnline}
                  lastSeen={selectedUser.lastSeen}
                />
                {/* <div className="flex items-center p-4 bg-[#262438] m-4 mt-0 rounded-b-3xl">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow p-2 rounded-md bg-[#1B1730] text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="ml-2 p-2 bg-[#E76F51] text-white rounded-md"
                  >
                    Send
                  </button>
                </div> */}
              </div>
            ) : (
              <div className="h-full bg-[#262438] rounded-3xl m-4 shadow-md flex items-center justify-center text-gray-500">
                Select a user to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mobile view - toggle between search and back button
  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <Header/>
      
      {selectedUser ? (
        // Chat view with back button
        <div className="flex flex-col h-full">
          <div className="sticky top-0 z-10 bg-[#1B1730] p-4">
            <button 
              onClick={goBackToUserList}
              className="p-2 bg-[#262438] text-white rounded-md flex items-center"
            >
              <span className="mr-2">←</span> Back to users
            </button>
          </div>
          
          <div className="flex-grow overflow-auto">
            <div className="p-4 bg-[#1B1730] mb-2">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-3">
                  {selectedUser.profileUrl && (
                    <img 
                      src={selectedUser.profileUrl} 
                      alt={selectedUser.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-400">
                    {selectedUser.isOnline ? 'Online' : selectedUser.lastSeen ? `Last seen ${selectedUser.lastSeen}` : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
            
            <ChatWindow
              otherUserId={selectedUser}
              otherUserName={selectedUser.name}
              isOnline={selectedUser.isOnline}
              lastSeen={selectedUser.lastSeen}
            />
          </div>
        </div>
      ) : (
        // User list view with search
        <>
          <div className="sticky top-0 z-10 bg-[#1B1730] p-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 rounded-md bg-[#262438] text-white"
            />
          </div>
          
          <div className="flex-grow overflow-auto">
            <div className="bg-[#1B1730] h-full">
              <UserList
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedUserId={selectedUser?.id ?? null}
                onSelectUser={setSelectedUser}
                hideSearchInput={true}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}