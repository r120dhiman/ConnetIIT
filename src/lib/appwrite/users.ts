import { Query } from 'appwrite';
import { databases } from './config';
import { COLLECTIONS } from './config';
import type { User } from '../../types';

// Update these values with your actual Appwrite configuration
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = COLLECTIONS.USERS; // Your users collection ID

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
  // console.log("isOnline updated", updated);
  
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

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId
    );
    
    return response as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const getUsersByIds = async (userIds: string[]): Promise<Record<string, User>> => {
  const userMap: Record<string, User> = {};
  
  // Process in batches to avoid too many concurrent requests
  const batchSize = 10;
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (userId) => {
        try {
          const user = await getUserById(userId);
          if (user) {
            userMap[userId] = user;
          }
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
        }
      })
    );
  }
  
  return userMap;
};

export const allfriends = async (userId: string): Promise<string[]> => {
  try {
    // Get all messages where user is either sender or receiver in a single query
    const messages = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MESSAGES,
      [
        Query.or([
          Query.equal('senderId', userId),
          Query.equal('receiverId', userId)
        ])
      ]
    );

    // Extract unique user IDs (excluding the user's own ID)
    const interactedUserIds = new Set<string>();
    
    messages.documents.forEach(message => {
      // If user is the sender, add the receiver
      if (message.senderId === userId && message.receiverId && message.receiverId !== userId) {
        interactedUserIds.add(message.receiverId);
      }
      
      // If user is the receiver, add the sender
      if (message.receiverId === userId && message.senderId && message.senderId !== userId) {
        interactedUserIds.add(message.senderId);
      }
    });

    // Convert Set to Array and return
    return Array.from(interactedUserIds);
  } catch (error) {
    console.error('Error getting users with message interactions:', error);
    throw error;
  }
};