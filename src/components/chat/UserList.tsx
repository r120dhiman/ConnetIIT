import React from 'react';
import { Search } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import type { User } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface UserListProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedUserId: string | null;
  onSelectUser: (user: User) => void;
}

export function UserList({ searchQuery, onSearchChange, selectedUserId, onSelectUser }: UserListProps) {
  const { users, loading } = useUsers(searchQuery);

  return (
    <div className="h-full flex flex-col">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full rounded-md border-gray-300"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {searchQuery ? 'No users found' : 'Search for users to chat with'}
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => onSelectUser(user)}
                className={`w-full p-3 text-left rounded-md hover:bg-gray-50 flex items-center justify-between ${
                  selectedUserId === user.id ? 'bg-primary/10' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.college}</div>
                  </div>
                </div>
                {!user.isOnline && user.lastSeen && (
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(user.lastSeen))} ago
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}