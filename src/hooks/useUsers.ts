import { useState, useEffect } from 'react';
import { searchUsers,allfriends } from '../lib/appwrite/users';
import { useDebounce } from './useDebounce';
import { getProfile } from '../lib/appwrite/users';
import type { User } from '../types';

export function useUsers(searchQuery: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedQuery.trim()) {
        setUsers([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await searchUsers(debouncedQuery);
        
        setUsers(response.documents);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedQuery]);

  return { users, loading };
}

export async function allFriendsMsg(userId:String) {
  try {
    // Replace this with your actual data fetching logic
    const friends = await allfriends(userId);
    return { friends };
  } catch (error) {
    console.error("Error fetching friends:", error);
    return { friends: [] };
  }
}

export async function otheruserdetails(otheruserid:String){
  try {
    const otheruserDetails= await getProfile(otheruserid);
    console.log("I am from useUsers ",otheruserDetails);
    const payload={
      name:otheruserDetails.name,
      profileUrl:otheruserDetails.profileUrl,
      isOnline:otheruserDetails.isOnline
    }
    return payload;
  } catch (error) {
    
  }
}