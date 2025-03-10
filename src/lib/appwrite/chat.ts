import { ID, Query } from 'appwrite';
import { databases } from './config';
import { COLLECTIONS } from './config';
import type { Message } from '../../types/chat';
import { Client } from 'appwrite';
import {client} from './config'

const DATABASE_ID = "6775235f000aeef1a930";

export async function sendMessage(message: Omit<Message, 'id' | 'createdAt'>) {
  console.log("msg data",message);
  
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.MESSAGES,
    ID.unique(),
    {
      ...message,
      isRead: false,
    }
  );
}

export async function getMessages(userId: string, otherUserId: string) {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.MESSAGES,
    [
      Query.or([  // Use Query.or to get messages where either condition matches
        Query.and([  // senderId is userId and receiverId is otherUserId
          Query.equal('senderId', userId),
          Query.equal('receiverId', otherUserId),
        ]),
        Query.and([  // senderId is otherUserId and receiverId is userId
          Query.equal('senderId', otherUserId),
          Query.equal('receiverId', userId),
        ])
      ]),
      Query.orderAsc('$createdAt'),
      Query.limit(50),
    ]
  );
  console.log("response", response);
  
  return response;
}

export function subscribeToMessages(userId: string, callback: (message: Message) => void) {
  return client.subscribe(
    `databases.${DATABASE_ID}.collections.${COLLECTIONS.MESSAGES}.documents`,
    (response) => {
      const message = response.payload as Message;
      if (message.senderId === userId || message.receiverId === userId) {
        callback(message);
      }
    }
  );
}