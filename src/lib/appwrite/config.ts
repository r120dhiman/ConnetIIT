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
  POSTS: '67d8715d001f8d445d4b', //done
  CHALLENGES: '67d72ff10031f16751cd',//done
  COMMENTS: '67d72f6d000023e6d4d7',//done
  MESSAGES: '67d73087000ea52a269e',//done /
  USERS:'67d72ad6003d7b11ce21', //done
  ANONYMOUS_CHATS:'67d72d80003bc5b385d8',//done
  COMMUNITIES:'67d72f09002b0ffee954',//done /
  QUEUE:'67d72e120024fcb04feb', //done
  TRIPS:'67d732dc003598f63d28',//done /
  ROOMCHAT:'67d7312400351aed23a4',//done
  TOTAL_ROOMS:'67d733ea0007250da40e',//done
} as const;

