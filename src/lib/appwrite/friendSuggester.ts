import { databases } from './config';
import { COLLECTIONS } from './config';
// import type { User } from '../../types';
import { Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export async function suggestFriends(userId: string, userInterests: string[], page: number = 1, limit: number = 10) {
  try {
    // console.log(`Suggesting friends for userId: ${userId} with interests: ${userInterests}`);
    if (!userInterests || userInterests.length === 0) {
      // console.log('No interests provided, returning empty array.');
      return [];
    }
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [
      Query.equal('interests', userInterests),
      Query.limit(limit), // Limit the number of results
      Query.offset((page - 1) * limit) // Calculate the offset for pagination
    ]);
    const filteredUsers = response.documents.filter((user: any) => user.$id !== userId);
    const finalList=filteredUsers.filter((user) => user.isOnline ===true );
    const shuffledUsers = finalList.sort(() => 0.5 - Math.random()).slice(0, limit);
    console.log(`Returning ${shuffledUsers.length} random suggestions.`);
    return shuffledUsers;
  } catch (error) {
    console.error('Error suggesting friends:', error);
    throw error;
  }
}
