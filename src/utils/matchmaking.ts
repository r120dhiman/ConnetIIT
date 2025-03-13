import { databases, COLLECTIONS } from '../lib/appwrite/config';
import { Query } from 'appwrite';
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

console.log('[matchmaking] Initializing with DATABASE_ID:', DATABASE_ID);

const interestQueue: { userId: string; hobbies: string[]; timestamp: number }[] = [];
const randomQueue: { userId: string; timestamp: number }[] = [];

const QUEUE_TTL = 5 * 60 * 1000; // 5 minutes timeout for stale entries
enum ChatStatus { ACTIVE = "active", ENDED = "ended", PENDING = "pending" }

export async function requestAnonymousChat(
  userId: string,
  hobbies: string[],
  mode: "interest" | "random"
) {
  console.log('[requestAnonymousChat] Starting matchmaking request:', { userId, hobbies, mode });
  try {
    cleanupQueues();

    console.log('[requestAnonymousChat] Checking for active chats for user:', userId);
    const activeChats = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANONYMOUS_CHATS,
      [
        Query.equal("status", ChatStatus.ACTIVE),
        Query.or([
          Query.equal("senderId", userId),
          Query.equal("receiverId", userId)
        ])
      ]
    );

    console.log('[requestAnonymousChat] Active chats found:', activeChats.total);
    if (activeChats.total > 0) {
      console.log("Active chat already exists:", activeChats.documents[0]);
      return activeChats.documents[0];
    }

    const timestamp = Date.now();

    if (mode === "interest") {
      console.log('[requestAnonymousChat] Processing interest-based matching');
      console.log('Current interest queue:', interestQueue);
      const potentialMatch = interestQueue.find((user) =>
        user.userId !== userId &&
        user.hobbies.some((hobby) => hobbies.includes(hobby))
      );

      if (potentialMatch) {
        console.log('[requestAnonymousChat] Found interest match:', potentialMatch);
        interestQueue.splice(interestQueue.indexOf(potentialMatch), 1);
        return await createChat(userId, potentialMatch.userId);
      }

      if(!interestQueue.find((user) => user.userId === userId)){
        interestQueue.push({ userId, hobbies, timestamp });
      }
      console.log("Added to interest-based matchmaking queue. Queue length:", interestQueue.length);
    } else {
      console.log('[requestAnonymousChat] Processing random matching');
      console.log('Current random queue:', randomQueue);
      const matchedUserIndex = randomQueue.findIndex(user => user.userId !== userId);

      if (matchedUserIndex !== -1) {
        const matchedUser = randomQueue.splice(matchedUserIndex, 1)[0].userId;
        console.log('[requestAnonymousChat] Found random match:', matchedUser);
        return await createChat(userId, matchedUser);
      }
      if(!randomQueue.find((user) => user.userId === userId)){
      randomQueue.push({ userId, timestamp });}
      console.log("Added to random matchmaking queue. Queue length:", randomQueue.length);
    }
    console.log('[requestAnonymousChat] No immediate match found, returning search message');
    return null;
  } catch (error) {
    console.error("[requestAnonymousChat] Error in matchmaking:", error);
    throw error;
  }
}

function cleanupQueues() {
  console.log('[cleanupQueues] Starting queue cleanup');
  console.log('Queue lengths before cleanup:', {
    interestQueue: interestQueue.length,
    randomQueue: randomQueue.length
  });
  if(randomQueue.length ===0 && interestQueue.length ===0){
    console.log("No users in the queue. Skipping cleanup.");
    return;}

  const currentTime = Date.now();

  const cleanInterestQueue = interestQueue.filter(
    (user) => currentTime - user.timestamp < QUEUE_TTL
  );
  const cleanRandomQueue = randomQueue.filter(
    (user) => currentTime - user.timestamp < QUEUE_TTL
  );

  interestQueue.length = 0;
  interestQueue.push(...cleanInterestQueue);

  randomQueue.length = 0;
  randomQueue.push(...cleanRandomQueue);

  console.log("Queues cleaned. Remaining users:", {
    interestQueue: interestQueue.length,
    randomQueue: randomQueue.length,
  });
}

async function createChat(senderId: string, receiverId: string) {
  console.log('[createChat] Creating new chat:', { senderId, receiverId });
  
  const chatData = {
    senderId,
    receiverId,
    chatlogs: [],
    status: ChatStatus.ACTIVE,
    created_at: new Date().toISOString(),
    is_reported: false,
  };

  console.log('[createChat] Chat data prepared:', chatData);

  const newChat = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.ANONYMOUS_CHATS,
    "unique()",
    chatData
  );

  console.log("[createChat] Match found! Chat created:", newChat);
  return newChat;
}