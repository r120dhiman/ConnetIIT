// import { databases, COLLECTIONS } from '../lib/appwrite/config';
// import { Query, ID } from 'appwrite';

// const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
// enum ChatStatus { ACTIVE = "active", ENDED = "ended", PENDING = "pending" }

// export async function requestAnonymousChat(
//   userId: string, 
//   interests: string[],
//   mode: "interest" | "random"
// ) {
//   try {
//     console.log('[requestAnonymousChat] Starting with:', { userId, mode });

//     // Check for active chats first
//     const activeChats = await databases.listDocuments(
//       DATABASE_ID,
//       COLLECTIONS.ANONYMOUS_CHATS, 
//       [
//         Query.equal("status", ChatStatus.ACTIVE),
//         Query.or(
//           [Query.equal("senderId", userId), Query.equal("receiverId", userId)]
//         )
//       ]
//     );

//     if (activeChats.total > 0) {
//       console.log('[requestAnonymousChat] User already in active chat');
//       return activeChats.documents[0];
//     }

//     // Check existing queue entry and remove if exists
//     const existingInQueue = await databases.listDocuments(
//       DATABASE_ID,
//       COLLECTIONS.QUEUE,
//       [Query.equal("userId", userId)]
//     );

//     if (existingInQueue.total > 0) {
//       await databases.deleteDocument(
//         DATABASE_ID,
//         COLLECTIONS.QUEUE,
//         existingInQueue.documents[0].$id
//       );
//     }

//     // Add new queue entry
//     const queueEntry = await databases.createDocument(
//       DATABASE_ID,
//       COLLECTIONS.QUEUE,
//       ID.unique(),
//       {
//         userId,
//         interests: mode === "interest" ? interests : [],
//         mode,
//         timestamp: new Date().toISOString(),
//         status: "waiting"
//       }
//     );

//     // Find match
//     const matchQuery = [
//       Query.notEqual("userId", userId),
//       Query.equal("mode", mode),
//       Query.equal("status", "waiting"),
//       ...(mode === "interest" ? [Query.search("interests", interests.join(" "))] : [])
//     ];

//     const potentialMatches = await databases.listDocuments(
//       DATABASE_ID,
//       COLLECTIONS.QUEUE,
//       matchQuery
//     );

//     if (potentialMatches.total > 0) {
//       const match = potentialMatches.documents[0];
      
//       // Create chat
//       const chat = await createChat(userId, match.userId);

//       // Update both users' queue status to "matched"
//       await Promise.all([
//         databases.updateDocument(
//           DATABASE_ID,
//           COLLECTIONS.QUEUE,
//           match.$id,
//           { 
//             status: "matched",
//             chatId: chat.$id // Store the chat ID in both queue entries
//           }
//         ),
//         databases.updateDocument(
//           DATABASE_ID,
//           COLLECTIONS.QUEUE,
//           queueEntry.$id,
//           { 
//             status: "matched",
//             chatId: chat.$id // Store the chat ID in both queue entries
//           }
//         )
//       ]);

//       return chat;
//     }

//     // No match found
//     return { status: "waiting" };
//   } catch (error) {
//     console.error("[requestAnonymousChat] Error:", error);
//     throw error;
//   }
// }

// async function cleanupQueues() {
//   console.log('[cleanupQueues] Starting queue cleanup');
  
//   const QUEUE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
//   const currentTime = new Date().getTime();
//   const cutoffTime = new Date(currentTime - QUEUE_TTL).toISOString();

//   const queueEntries = await databases.listDocuments(
//     DATABASE_ID,
//     COLLECTIONS.QUEUE,
//     [Query.lessThan('timestamp', cutoffTime)]
//   );

//   if (queueEntries.total === 0) {
//     console.log("No stale entries in the queue. Skipping cleanup.");
//     return;
//   }

//   const deletePromises = queueEntries.documents.map(doc => 
//     databases.deleteDocument(DATABASE_ID, COLLECTIONS.QUEUE, doc.$id)
//   );

//   await Promise.all(deletePromises);
//   console.log(`Cleaned up ${queueEntries.total} stale queue entries`);
// }

// async function createChat(senderId: string, receiverId: string) {
//   console.log('[createChat] Creating chat between:', { senderId, receiverId });
  
//   const chatData = {
//     senderId,
//     receiverId,
//     chatlogs: [],
//     // status: ChatStatus.ACTIVE, // Using enum value
//     createdAt: new Date().toISOString(),
//   };

//   const newChat = await databases.createDocument(
//     DATABASE_ID,
//     COLLECTIONS.ANONYMOUS_CHATS,
//     ID.unique(),
//     chatData
//   );

//   console.log("[createChat] Chat created:", newChat.$id);
//   return newChat;
// }

// // Add new function to check for matches
// export async function checkForChatMatch(userId: string) {
//   try {
//     const queueEntries = await databases.listDocuments(
//       DATABASE_ID,
//       COLLECTIONS.QUEUE,
//       [
//         Query.equal("userId", userId),
//         Query.equal("status", "matched")
//       ]
//     );
    
//     if (queueEntries.total > 0 && queueEntries.documents[0].chatId) {
//       // Found a match, get the chat
//       const chatId = queueEntries.documents[0].chatId;
//       const chat = await databases.getDocument(
//         DATABASE_ID,
//         COLLECTIONS.ANONYMOUS_CHATS,
//         chatId
//       );
      
//       return chat;
//     }
    
//     return null; // No match found yet
//   } catch (error) {
//     console.error("[checkForChatMatch] Error:", error);
//     throw error;
//   }
// }











// import { databases, COLLECTIONS } from '../lib/appwrite/config';
// import { Query, ID } from 'appwrite';

// const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
// enum ChatStatus { ACTIVE = "active", ENDED = "ended", PENDING = "pending" }

// export async function requestAnonymousChat(
//   userId: string, 
//   interests: string[],
//   mode: "interest" | "random"
// ) {
//   try {
//     console.log('[requestAnonymousChat] Starting with:', { userId, mode });

//     // Check for active chats first
//     const activeChats = await databases.listDocuments(
//       DATABASE_ID,
//       COLLECTIONS.ANONYMOUS_CHATS,
//       [
//         Query.equal("status", ChatStatus.ACTIVE),
//         Query.or(
//           [Query.equal("senderId", userId), Query.equal("receiverId", userId)]
//         )
//       ]
//     );

//     if (activeChats.total > 0) {
//       console.log('[requestAnonymousChat] User already in active chat');
//       return activeChats.documents[0];
//     }

//     // Check existing queue entry and remove if exists
//     const existingInQueue = await databases.listDocuments(
//       DATABASE_ID,
//       COLLECTIONS.QUEUE,
//       [Query.equal("userId", userId)]
//     );

//     if (existingInQueue.total > 0) {
//       await databases.deleteDocument(
//         DATABASE_ID,
//         COLLECTIONS.QUEUE,
//         existingInQueue.documents[0].$id
//       );
//     }

//     // Add new queue entry
//     const queueEntry = await databases.createDocument(
//       DATABASE_ID,
//       COLLECTIONS.QUEUE,
//       ID.unique(),
//       {
//         userId,
//         interests: mode === "interest" ? interests : [],
//         mode,
//         timestamp: new Date().toISOString(),
//         status: "waiting"
//       }
//     );

//     // Find match
//     const matchQuery = [
//       Query.notEqual("userId", userId),
//       Query.equal("mode", mode),
//       Query.equal("status", "waiting"),
//       ...(mode === "interest" ? [Query.search("interests", interests.join(" "))] : [])
//     ];

//     const potentialMatches = await databases.listDocuments(
//       DATABASE_ID,
//       COLLECTIONS.QUEUE,
//       matchQuery
//     );

//     if (potentialMatches.total > 0) {
//       const match = potentialMatches.documents[0];
      
//       // Create chat
//       const chat = await createChat(userId, match.userId);

//       // Update both users' queue status to "matched"
//       // This approach avoids using chatId which is not in the schema
//       await Promise.all([
//         databases.updateDocument(
//           DATABASE_ID,
//           COLLECTIONS.QUEUE,
//           match.$id,
//           { status: "matched" }
//         ),
//         databases.updateDocument(
//           DATABASE_ID,
//           COLLECTIONS.QUEUE,
//           queueEntry.$id,
//           { status: "matched" }
//         )
//       ]);

//       return chat;
//     }

//     // No match found
//     return { status: "waiting" };
//   } catch (error) {
//     console.error("[requestAnonymousChat] Error:", error);
//     throw error;
//   }
// }

// async function cleanupQueues() {
//   console.log('[cleanupQueues] Starting queue cleanup');
  
//   const QUEUE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
//   const currentTime = new Date().getTime();
//   const cutoffTime = new Date(currentTime - QUEUE_TTL).toISOString();

//   const queueEntries = await databases.listDocuments(
//     DATABASE_ID,
//     COLLECTIONS.QUEUE,
//     [Query.lessThan('timestamp', cutoffTime)]
//   );

//   if (queueEntries.total === 0) {
//     console.log("No stale entries in the queue. Skipping cleanup.");
//     return;
//   }

//   const deletePromises = queueEntries.documents.map(doc => 
//     databases.deleteDocument(DATABASE_ID, COLLECTIONS.QUEUE, doc.$id)
//   );

//   await Promise.all(deletePromises);
//   console.log(`Cleaned up ${queueEntries.total} stale queue entries`);
// }

// async function createChat(senderId: string, receiverId: string) {
//   console.log('[createChat] Creating chat between:', { senderId, receiverId });
  
//   const chatData = {
//     senderId,
//     receiverId,
//     chatlogs: [],
//     status: ChatStatus.ACTIVE, // Using enum value
//     createdAt: new Date().toISOString(),
//   };

//   const newChat = await databases.createDocument(
//     DATABASE_ID,
//     COLLECTIONS.ANONYMOUS_CHATS,
//     ID.unique(),
//     chatData
//   );

//   console.log("[createChat] Chat created:", newChat.$id);
//   return newChat;
// }

// // Modified to check for chats directly instead of using chatId
// export async function checkForChatMatch(userId: string) {
//   try {
//     // First check if user's queue status is "matched"
//     const queueEntries = await databases.listDocuments(
//       DATABASE_ID,
//       COLLECTIONS.QUEUE,
//       [
//         Query.equal("userId", userId),
//         Query.equal("status", "matched")
//       ]
//     );
    
//     if (queueEntries.total > 0) {
//       // Queue entry is matched, now look for a chat where user is sender or receiver
//       const chats = await databases.listDocuments(
//         DATABASE_ID,
//         COLLECTIONS.ANONYMOUS_CHATS,
//         [
//           Query.equal("status", ChatStatus.ACTIVE),
//           Query.or([
//             Query.equal("senderId", userId),
//             Query.equal("receiverId", userId)
//           ])
//         ]
//       );
      
//       if (chats.total > 0) {
//         return chats.documents[0];
//       }
//     }
    
//     return null; // No match found yet
//   } catch (error) {
//     console.error("[checkForChatMatch] Error:", error);
//     throw error;
//   }
// }

