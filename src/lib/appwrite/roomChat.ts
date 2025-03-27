import { ID, Query } from 'appwrite';
import { databases } from '../appwrite';
import { client } from './config';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ROOMCHAT = import.meta.env.VITE_APPWRITE_ROOMCHAT;

interface RoomChatMessage {
  roomId: string;
  content: string;
  senderId: string;
  timestamp: string; // Ensure this matches the property name in your chat message
}

export const getRoomChats = async (roomId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
ROOMCHAT,
      [Query.equal('roomId', roomId)] // Use the provided roomId instead of a hardcoded value
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching room chat:', error);
    throw error;
  }
};

export const sendRoomChat = async (roomId: string, content: string, senderId: string) => {
  try {
    const chatMessage = {
      roomId,
      content,
      senderId,
      timestamp: new Date().toISOString()
    };

    const response = await databases.createDocument(
      DATABASE_ID,
ROOMCHAT,
      ID.unique(),
      chatMessage
    );

    return response;
  } catch (error) {
    console.error('Error sending room chat:', error);
    throw error;
  }
};

// Realtime subscription for room chats
export const subscribeToRoomChats = (roomId: string, callback: (message: RoomChatMessage) => void) => {
  try {
    const unsubscribe = client.subscribe(
      [`databases.${DATABASE_ID}.collections.${ROOMCHAT}.documents`],
      (response) => {
        // Only process if it's a create event and matches the room
        if (
          response.events.includes('databases.*.collections.*.documents.*.create') && 
          (response.payload as RoomChatMessage).roomId === roomId
        ) {
          callback({
            roomId: (response.payload as RoomChatMessage).roomId,
            content: (response.payload as RoomChatMessage).content,
            senderId: (response.payload as RoomChatMessage).senderId,
            timestamp: (response.payload as RoomChatMessage).timestamp
          });
        }
      }
    );

    return () => {
      unsubscribe();
    };
  } catch (error) {
    console.error('Error subscribing to room chats:', error);
    return () => {}; // Return empty cleanup function in case of error
  }
};
