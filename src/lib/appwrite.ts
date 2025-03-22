import { Client, Account, Databases, Storage, Functions } from 'appwrite';

export const client = new Client()
  .setEndpoint('https://auth.connectiit.tech/v1')
  .setProject("677522710038159eedf4");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);