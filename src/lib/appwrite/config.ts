import { Client, Account, Databases, Storage, Functions } from 'appwrite';

const SETPROJECT=import.meta.env.VITE_APPWRITE_SET_PROJECT
const ENDPOINT=import.meta.env.VITE_APPWRITE_ENDPOINT
export const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(SETPROJECT);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const COLLECTIONS = {
  POSTS: import.meta.env.VITE_APPWRITE_POSTS, //done
  CHALLENGES: import.meta.env.VITE_APPWRITE_CHALLENGES,//done
  COMMENTS: import.meta.env.VITE_APPWRITE_COMMETNS,//done
  MESSAGES: import.meta.env.VITE_APPWRITE_MESSAGES,//done /
  USERS:import.meta.env.VITE_APPWRITE_USERS, //done
  ANONYMOUS_CHATS:import.meta.env.VITE_APPWRITE_ANONYMOUS_CHATS,//done
  COMMUNITIES:import.meta.env.VITE_APPWRITE_COMMUNITTIES,//done /
  QUEUE:import.meta.env.VITE_APPWRITE_QUEUE, //done
  TRIPS:import.meta.env.VITE_APPWRITE_TRIPS,//done /
  ROOMCHAT:import.meta.env.VITE_APPWRITE_ROOMCHAT,//done
  TOTAL_ROOMS:import.meta.env.VITE_APPWRITE_TOTAL_ROOMS,//done
  COMMUNITY_MEMBERS:import.meta.env.VITE_APPWRITE_COMMUNITY_MEMBERS,//done
} as const;

