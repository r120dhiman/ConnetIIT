import { databases} from "./config";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_ANONYMOUS_CHATS;
const ANONYMOUS_CHATS = import.meta.env.VITE_APPWRITE_ANONYMOUS_CHATS;

// Enum for chat status
enum ChatStatus {
  ACTIVE = "active",
  PENDING = "pending",
  ENDED = "ended"
}

// Utility function for updating chat logs
async function updateChatLogs(chatId: string, modifyLogs: (logs: string[]) => string[]) {
  console.log(`[updateChatLogs] Updating logs for chat ${chatId}`);
  try {
    const chat = await databases.getDocument(DATABASE_ID, COLLECTION_ID, chatId);
    console.log(`[updateChatLogs] Current chat logs:`, chat.chat_logs);
    const updatedLogs = modifyLogs(chat.chat_logs);
    console.log(`[updateChatLogs] Updated chat logs:`, updatedLogs);

    return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, chatId, {
      chat_logs: updatedLogs,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error updating chat logs for chatId ${chatId}:`, error);
    throw error;
  }
}

// Create chat
export async function createChat(user1: string, user2: string) {
  console.log(`[createChat] Creating chat between users ${user1} and ${user2}`);
  const chatData = {
    user1_id: user1,
    user2_id: user2,
    chat_logs: [],
    status: ChatStatus.PENDING,
    created_at: new Date().toISOString(),
    is_reported: false,
  };

  try {
    const newChat = await databases.createDocument(
      DATABASE_ID,
      ANONYMOUS_CHATS,
      "unique()",
      chatData
    );

    console.log("[createChat] New chat created:", newChat);
    return newChat;
  } catch (error) {
    console.error("[createChat] Error creating chat:", error);
    throw error;
  }
}

// Add message
export async function addMessage(chatId: string, senderId: string, content: string) {
  console.log(`[addMessage] Adding message to chat ${chatId} from ${senderId}`);
  console.log(`[addMessage] Message content:`, content);
  
  const newMessage = JSON.stringify({
    senderId,
    content,
    timestamp: new Date().toISOString(),
    isDelivered: false,
    isRead: false,
  });

  console.log(`[addMessage] Formatted message:`, newMessage);
  return await updateChatLogs(chatId, (logs) => [...logs, newMessage]);
}

// Get chat messages
export async function getChatMessages(chatId: string) {
  console.log(`[getChatMessages] Fetching messages for chat ${chatId}`);
  try {
    const chat = await databases.getDocument(DATABASE_ID, COLLECTION_ID, chatId);
    console.log(`[getChatMessages] Retrieved chat:`, chat);
    const messages = chat.chat_logs.map((log: string) => JSON.parse(log));
    console.log(`[getChatMessages] Parsed messages:`, messages);
    return messages;
  } catch (error) {
    console.error(`[getChatMessages] Error fetching messages for chatId ${chatId}:`, error);
    throw error;
  }
}

// Mark message as delivered
export async function markMessageAsDelivered(chatId: string, messageIndex: number) {
  console.log(`[markMessageAsDelivered] Marking message ${messageIndex} as delivered in chat ${chatId}`);
  return await updateChatLogs(chatId, (logs) =>
    logs.map((log: string, index: number) => {
      const message = JSON.parse(log);
      if (index === messageIndex) message.isDelivered = true;
      return JSON.stringify(message);
    })
  );
}

// Mark message as read
export async function markMessageAsRead(chatId: string, messageIndex: number) {
  console.log(`[markMessageAsRead] Marking message ${messageIndex} as read in chat ${chatId}`);
  return await updateChatLogs(chatId, (logs) =>
    logs.map((log: string, index: number) => {
      const message = JSON.parse(log);
      if (index === messageIndex) message.isRead = true;
      return JSON.stringify(message);
    })
  );
}
