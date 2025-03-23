import React, { useState } from 'react';
import { UserList } from './chat/UserList';
import { ChatArea } from './chat/ChatArea';
// import { Header } from './layout/Header';
import type { User } from '../types';

export function Chat() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      <div className="container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: 'calc(100vh - 150px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* User list sidebar */}
            <div className="border-r p-4">
              <UserList
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedUserId={selectedUser?.id || null}
                onSelectUser={setSelectedUser}
              />
            </div>
            
            {/* Chat area */}
            <div className="md:col-span-2">
              <ChatArea selectedUser={selectedUser} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
