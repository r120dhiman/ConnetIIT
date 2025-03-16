import { databases } from './config';
import { COLLECTIONS } from './config';
// import type { User } from '../../types';
import { Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export async function suggestFriends(userId: string, userInterests: string[]) {
  try {
    console.log(`Suggesting friends for userId: ${userId} with interests: ${userInterests}`);

    // Use the provided interests array instead of fetching the user's profile

    // If the user has no interests, return an empty array
    if (!userInterests || userInterests.length === 0) {
      console.log('No interests provided, returning empty array.');
      return [];
    }

    // Search for users with similar interests
    console.log(`Searching for users with interests: ${userInterests}`);
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [
      Query.equal('interests', userInterests)
    ]);
    console.log(`Found ${response.documents.length} users with similar interests.`);

    // Filter out the current user from the suggestions
    const filteredUsers = response.documents.filter((user: any) => user.$id !== userId);
    console.log(`Filtered out current user. Suggestions count: ${filteredUsers.length}`);

    // Shuffle the filtered users and limit to 5 random users
    const shuffledUsers = filteredUsers.sort(() => 0.5 - Math.random()).slice(0, 5);
    console.log(`Returning ${shuffledUsers.length} random suggestions.`);

    return shuffledUsers;
  } catch (error) {
    console.error('Error suggesting friends:', error);
    throw error;
  }
}
