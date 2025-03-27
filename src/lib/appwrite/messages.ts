import { ID, Query } from 'appwrite';
import {  DATABASE_ID, databases } from './config';
const  MESSAGES=import.meta.env.VITE_APPWRITE_USERS

// Interface for a message
interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

// Interface for the message creation payload
interface MessagePayload {
  content: string;
  senderId: string;
  receiverId: string;
}

/**
 * Fetches messages between two users
 * 
 * @param currentUserId - ID of the current user
 * @param otherUserId - ID of the user to fetch messages with
 * @returns Array of messages between the two users, sorted by createdAt
 */
export const getMessages = async (currentUserId: string, otherUserId: string): Promise<Message[]> => {
  try {
    // Validate inputs
    if (!currentUserId || !otherUserId) {
      throw new Error('Both user IDs are required');
    }

    // Query for messages where:
    // (currentUser is sender AND otherUser is receiver) OR (currentUser is receiver AND otherUser is sender)
    const response = await databases.listDocuments(
      DATABASE_ID,
MESSAGES,
      [
        Query.or([
          Query.and([
            Query.equal('senderId', currentUserId),
            Query.equal('receiverId', otherUserId)
          ]),
          Query.and([
            Query.equal('senderId', otherUserId),
            Query.equal('receiverId', currentUserId)
          ])
        ]),
        Query.orderAsc('createdAt') // Sort by timestamp, oldest first
      ]
    );

    // Map the database documents to our Message interface
    return response.documents.map(doc => ({
      id: doc.$id,
      content: doc.content,
      senderId: doc.senderId,
      receiverId: doc.receiverId,
      createdAt: doc.createdAt || doc.$createdAt
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Sends a new message
 * 
 * @param messageData - Object containing message content, sender ID, and receiver ID
 * @returns The created message object
 */
export const sendMessage = async (messageData: MessagePayload): Promise<Message> => {
  try {
    // Validate inputs
    if (!messageData.content || !messageData.senderId || !messageData.receiverId) {
      throw new Error('Message content, sender ID, and receiver ID are required');
    }

    // Create the message document
    const response = await databases.createDocument(
      DATABASE_ID,
MESSAGES,
      ID.unique(), // Generate a unique ID
      {
        content: messageData.content,
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        createdAt: new Date().toISOString(),
        read: false // Default to unread
      }
    );

    // Return the created message
    return {
      id: response.$id,
      content: response.content,
      senderId: response.senderId,
      receiverId: response.receiverId,
      createdAt: response.createdAt || response.$createdAt
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Marks messages as read
 * 
 * @param currentUserId - ID of the current user (receiver)
 * @param senderId - ID of the sender
 * @returns True if successful
 */
export const markMessagesAsRead = async (currentUserId: string, senderId: string): Promise<boolean> => {
  try {
    // Find all unread messages sent to currentUser by senderId
    const unreadMessages = await databases.listDocuments(
      DATABASE_ID,
MESSAGES,
      [
        Query.equal('receiverId', currentUserId),
        Query.equal('senderId', senderId),
        Query.equal('read', false)
      ]
    );

    // Update each message to mark as read
    const updatePromises = unreadMessages.documents.map(doc => 
      databases.updateDocument(
        DATABASE_ID,
MESSAGES,
        doc.$id,
        { read: true }
      )
    );

    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }
};

/**
 * Gets the unread message count for a user
 * 
 * @param userId - ID of the user to get unread count for
 * @returns Object mapping sender IDs to their unread count
 */
export const getUnreadMessageCounts = async (userId: string): Promise<Record<string, number>> => {
  try {
    // Find all unread messages for this user
    const unreadMessages = await databases.listDocuments(
      DATABASE_ID,
MESSAGES,
      [
        Query.equal('receiverId', userId),
        Query.equal('read', false)
      ]
    );

    // Count messages by sender
    const counts: Record<string, number> = {};
    
    unreadMessages.documents.forEach(doc => {
      const senderId = doc.senderId;
      counts[senderId] = (counts[senderId] || 0) + 1;
    });

    return counts;
  } catch (error) {
    console.error('Error getting unread message counts:', error);
    return {};
  }
}; 