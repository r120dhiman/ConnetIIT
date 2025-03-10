import { ID, Query } from 'appwrite';
import { databases } from './config';
import { COLLECTIONS } from './config';
import type { Challenge } from '../../types';

const DATABASE_ID = '6775235f000aeef1a930';

export async function getChallenges() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CHALLENGES,
      [Query.orderDesc('$createdAt')]
    );
    return response.documents as Challenge[];
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
}

export async function joinChallenge(challengeId: string, userId: string) {
  try {
    const challenge = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.CHALLENGES,
      challengeId
    );
    
    const participants = [...challenge.participants, userId];
    
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.CHALLENGES,
      challengeId,
      { participants }
    );
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw error;
  }
}