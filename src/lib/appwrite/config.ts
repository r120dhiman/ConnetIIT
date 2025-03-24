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
