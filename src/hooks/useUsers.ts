import { useState, useEffect } from 'react';
import { searchUsers } from '../lib/appwrite/users';
import { useDebounce } from './useDebounce';
import type { User } from '../types';

export function useUsers(searchQuery: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);
  console.log("debounceQuery", debouncedQuery);
  

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedQuery.trim()) {
        setUsers([]);
        return;
      }
      console.log("we are is use Users");
      
      setLoading(true);
      try {
        const response = await searchUsers(debouncedQuery);
        console.log("users", response);
        
        setUsers(response.documents);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    };
    console.log("we are is used Users", fetchUsers);

    fetchUsers();
  }, [debouncedQuery]);

  return { users, loading };
}