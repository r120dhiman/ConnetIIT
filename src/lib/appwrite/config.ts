import { Client, Account, Databases, Storage, Functions } from 'appwrite';


export const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('677522710038159eedf4');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export const COLLECTIONS = {
  POSTS: '67752371002febb931a1',
  CHALLENGES: '677562880002b979b665',
  COMMENTS: '677561d7001da9f2f0de',
  MESSAGES: '677578060007be19a630',
  USERS:'67824d4f000959ec966a',
  ANONYMOUS_CHATS:'67d066fb00343b3675a8',
  COMMUNITIES:'67d1426400251f663afb',
  QUEUE:'67d2b616000ddb0a855c',
  TRIPS:'67d3fdc90004306657f6',
  ROOMCHAT:'67d504550020d2c7c8f2'
  TOTAL_ROOMS:'67d48a4b002b54fcee95'
} as const;