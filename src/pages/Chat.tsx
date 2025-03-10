import React, { useState, useEffect } from 'react';
import { ChatWindow } from '../components/chat/ChatWindow';
import { UserList } from '../components/chat/UserList';
import { useAuth } from '../contexts/AuthContext';
import { updateUserStatus } from '../lib/appwrite/users';
import type { User } from '../types';
import { Header } from '../components/layout/Header';

export function Chat() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)]">
      <Header/>
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Users sidebar */}
        <div className="col-span-4 bg-white rounded-lg shadow-md p-4">
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
            <ChatWindow
              otherUserId={selectedUser.id}
              otherUserName={selectedUser.name}
              isOnline={selectedUser.isOnline}
              lastSeen={selectedUser.lastSeen}
            />
          ) : (
            <div className="h-full bg-white rounded-lg shadow-md flex items-center justify-center text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}