// import {client }from "../../lib/appwrite";
// import { COLLECTIONS, DATABASE_ID } from "../../lib/appwrite/config";
// import { handleNewMessage } from "./handleMessages";

// const SubscribeToMessages = (loggedInUserId: string) => {
//     const unsubscribeMessages = client.subscribe(
//             `databases.${DATABASE_ID}.collections.${COLLECTIONS.MESSAGES}.documents`,
        
//         (response) => handleNewMessage(response, loggedInUserId, "Trip Chat")
//     );

//     const unsubscribeCommunityChat = client.subscribe(
//          `databases.${DATABASE_ID}.collections.${COLLECTIONS.COMMUNITIES}.documents`,
//         (response) => handleNewMessage(response, loggedInUserId, "Community Chat")
//     );

//     const unsubscribeTripChat = client.subscribe(
//         `databases.${DATABASE_ID}.collections.${COLLECTIONS.TRIPS}.documents`,
//         (response) => handleNewMessage(response, loggedInUserId, "Anonymous Chat")
//     );

//     return () => {
//         unsubscribeTripChat();
//         unsubscribeCommunityChat();
//         unsubscribeMessages(); 
//     };
// }
// export default SubscribeToMessages