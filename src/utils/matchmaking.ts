
import { databases } from '../lib/appwrite/config';
import { Query, ID } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ANONYMOUS_CHATS = import.meta.env.VITE_APPWRITE_ANONYMOUS_CHATS;
const QUEUE = import.meta.env.VITE_APPWRITE_QUEUE;

enum ChatStatus { ACTIVE = "active", ENDED = "ended", PENDING = "pending" }

export async function requestAnonymousChat(
  userId: string, 
  interests: string[],
  mode: "interest" | "random"
) {
  try {
    const activeChats = await databases.listDocuments(
      DATABASE_ID,
ANONYMOUS_CHATS,
      [
        Query.equal("status", ChatStatus.ACTIVE),
        Query.or([
          Query.equal("senderId", userId), 
          Query.equal("receiverId", userId)
        ])
      ]
    );

    if (activeChats.total > 0) {
      console.log('[requestAnonymousChat] User already in active chat');
      return activeChats.documents[0];
    }

    // Remove user from queue if already present
    await removeFromQueue(userId);

    // Add new queue entry
    const queueEntry = await databases.createDocument(
      DATABASE_ID,
QUEUE,
      ID.unique(),
      {
        userId,
        interests: mode === "interest" ? interests : [],
        mode,
        timestamp: new Date().toISOString(),
        status: "waiting"
      }
    );

    // Find a match
    const potentialMatches = await databases.listDocuments(
      DATABASE_ID,
QUEUE,
      [
        Query.notEqual("userId", userId),
        Query.equal("mode", mode),
        Query.equal("status", "waiting"),
        ...(mode === "interest" ? [Query.search("interests", interests.join(" "))] : [])
      ]
    );

    if (potentialMatches.total > 0) {
      const match = potentialMatches.documents[0];
      
      // Create chat first
      const chat = await createChat(userId, match.userId);
      
      // Then update queue statuses
      try {
        await Promise.all([
          updateQueueStatus(match.$id, chat.$id),
          updateQueueStatus(queueEntry.$id, chat.$id)
        ]);
      } catch (updateError) {
        console.error("Error updating queue statuses:", updateError);
        // Consider cleaning up the created chat if queue updates fail
      }
      
      return chat;
    }
    return { status: "waiting" };
  } catch (error) {
    console.error("[requestAnonymousChat] Error:", error);
    throw error;
  }
}

async function removeFromQueue(userId: string) {
  const existingInQueue = await databases.listDocuments(
    DATABASE_ID,
QUEUE,
    [Query.equal("userId", userId)]
  );
  if (existingInQueue.total > 0) {
    await databases.deleteDocument(
      DATABASE_ID,
QUEUE,
      existingInQueue.documents[0].$id
    );
  }
}

async function updateQueueStatus(queueId: string, chatId: string) {
  try {
    // First verify the document exists
    const queueDoc = await databases.getDocument(
      DATABASE_ID,
QUEUE,
      queueId
    );

    if (!queueDoc) {
      console.error(`Queue document ${queueId} not found`);
      return;
    }

    await databases.updateDocument(
      DATABASE_ID,
QUEUE,
      queueId,
      { 
        status: "matched", 
        chatId,
        // updatedAt: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error(`Error updating queue status for ${queueId}:`, error);
  }
}


async function createChat(senderId: string, receiverId: string) {
  console.log('[createChat] Creating chat between:', { senderId, receiverId });

  const newChat = await databases.createDocument(
    DATABASE_ID,
ANONYMOUS_CHATS,
    ID.unique(),
    {
      senderId,
      receiverId,
      chatlogs: [],
      // createdAt: new Date().toISOString()
    }
  );
const chatId=newChat.$id;
  console.log("[createChat] Chat created:", newChat.$id);
  const data={
    chatId,
    receiverId,
  }

  console.log(newChat.receiverId);
  return newChat;
}

export async function checkForChatMatch(userId: string) {
  try {
    const queueEntries = await databases.listDocuments(
      DATABASE_ID,
QUEUE,
      [
        Query.equal("userId", userId),
        Query.equal("status", "matched")
      ]
    );
    
    if (queueEntries.total > 0 && queueEntries.documents[0].chatId) {
      return await databases.getDocument(
        DATABASE_ID,
ANONYMOUS_CHATS,
        queueEntries.documents[0].chatId
      );
    }
    return null;
  } catch (error) {
    console.error("[checkForChatMatch] Error:", error);
    throw error;
  }
}