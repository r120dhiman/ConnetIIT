// import { databases as database } from "../../lib/appwrite";
// import { DATABASE_ID } from "../../lib/appwrite/config";

// const handleNewMessage = (
//   response: any,
//   loggedInUserId: string,
//   chatType: string
// ) => {
//   const message = response.payload;

//   // Check if the user is part of the chat
//   if (!message.participants.includes(loggedInUserId)) return;

//   // Notify the user only if the chatroom is not currently open
//   if (!isChatOpen(message.chatId)) {
//     showNotification(message, chatType);
//   }
// };

// const showNotification = (message: any, chatType: string) => {
//   if (Notification.permission === "granted") {
//     new Notification(`New ${chatType} Message`, {
//       body: `${message.senderName}: ${message.text}`,
//       icon: "/chat-icon.png",
//     });
//   } else {
//     Notification.requestPermission().then((permission) => {
//       if (permission === "granted") {
//         new Notification(`New ${chatType} Message`, {
//           body: `${message.senderName}: ${message.text}`,
//           icon: "/chat-icon.png",
//         });
//       }
//     });
//   }
// };

// const markMessagesAsRead = async (chatId: string) => {
//   await database.updateDocument(DATABASE_ID, "messages", chatId, {
//     unread: false,
//   });
// };

// export { handleNewMessage, showNotification, markMessagesAsRead };
