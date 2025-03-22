import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useUsers, allFriendsMsg } from '../../hooks/useUsers';
import type { User } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../shared/Loader';
import { databases } from "../../lib/appwrite";
import { COLLECTIONS } from "../../lib/appwrite/config";
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

interface UserListProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedUserId: string | null;
  onSelectUser: (user: User) => void;
}

export function UserList({ searchQuery, onSearchChange, selectedUserId, onSelectUser }: UserListProps) {
  const { user } = useAuth();
  const [SelectedUser, setSelectedUser] = useState("");
  
  const { users, loading } = useUsers(searchQuery);
  // const [interactedUsers, setInteractedUsers] = useState<User[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({});

  // Fetch interacted users (friends) when component mounts
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;
      
      try {
        setLoadingFriends(true);
        const { friends, lastMessages } = await allFriendsMsg(user.$id);
        
        // Make sure interacted users have properly formatted IDs
        // const formattedFriends = friends.map(friend => {
        //   if (friend.$id && !friend.id) {
        //     return {
        //       ...friend,
        //       id: friend.$id // Map $id to id
        //     };
        //   }
        //   return friend;
        // });

        // Fetch user data for each friend and populate the interactedUsers array
        // const data: User[] = [];
        // const promises = formattedFriends.map(async (friend) => {
        //   try {
        //     const userData = await databases.getDocument(
        //       DATABASE_ID,
        //       COLLECTIONS.USERS,
        //       friend // Use the mapped id
        //     );

        //     // Push the user data into the data array
        //     data.push({
        //       id: userData.$id,
        //       name: userData.name,
        //       profileUrl: userData.profileUrl,
        //       isOnline: userData.isOnline,
        //       lastSeen: userData.lastSeen,
        //       college: userData.college,
        //     });
        //   } catch (error) {
        //     console.error("Error fetching user data:", error);
        //   }
        // });

        // // Wait for all promises to resolve
        // await Promise.all(promises);
        // setInteractedUsers(data); // Set the interacted users state
        setLastMessages(lastMessages || {});
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoadingFriends(false);
      }
    };

    fetchFriends();
  }, [user]);

  // Determine which users to display based on search state
  const displayUsers = searchQuery ? users : []; // Use an empty array for interacted users
  const isLoading = searchQuery ? loading : loadingFriends;

  return (
    <div className="h-full flex flex-col bg-[#262438] p-4 rounded-3xl">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-[#262438] text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full rounded-3xl border-gray-300 text-white bg-[#262438]"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader 
              size="small" 
              message={searchQuery ? "Searching users..." : "Loading your conversations..."} 
            />
          </div>
        ) : displayUsers.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {searchQuery 
              ? 'No users found matching your search' 
              : 'You haven\'t chatted with anyone yet'}
          </div>
        ) : (
          <div className="space-y-2">
            {displayUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  onSelectUser(user);
                }}
                className={`w-full p-3 text-left text-white hover:bg-[#302d4b] rounded-3xl flex items-center justify-between ${
                  selectedUserId === user.id ? 'bg-primary/10' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={user.profileUrl}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-medium">{user.name}</div>
                    {!searchQuery && lastMessages[user.id] && (
                      <div className="text-sm text-gray-500 truncate">
                        {lastMessages[user.id]}
                      </div>
                    )}
                    {searchQuery && (
                      <div className="text-sm text-gray-500">{user.college}</div>
                    )}
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