import { Query } from 'appwrite';
import { databases } from './config';
import { COLLECTIONS } from './config';
import type { User } from '../../types';


const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export async function searchUsers(query: string) {
  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.USERS,
    [
      Query.search('name', query),
      Query.limit(10)
    ]
  );
}

export async function updateUserStatus(userId: string, isOnline: boolean) {
  console.log("isOnline updating", userId);
  const updated = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userId,
    { isOnline, lastSeen: new Date().toISOString() }
  );
  console.log("isOnline updated", updated);
  
  return updated;
}

export async function updateProfile(userData: Partial<User>) {
  console.log("suer data", userData);
  
  if (!DATABASE_ID) {
    throw new Error('Database ID is not configured');
  }

  return databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userData.id!,
    userData
  );
}

export async function getProfile(userId: string) {
  if (!DATABASE_ID) {
    throw new Error('Database ID is not configured');
  }

  return databases.getDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userId
  );
}