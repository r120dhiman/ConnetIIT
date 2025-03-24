import { ID, Query } from 'appwrite';
import { databases } from './config';

import type { Challenge } from '../../types';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const CHALLENGES = import.meta.env.VITE_APPWRITE_CHALLENGES;

export async function getChallenges() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      CHALLENGES,
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
      CHALLENGES,
      challengeId
    );
    
    const participants = [...challenge.participants, userId];
    
    await databases.updateDocument(
      DATABASE_ID,
      CHALLENGES,
      challengeId,
      { participants }
    );
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw error;
  }
}