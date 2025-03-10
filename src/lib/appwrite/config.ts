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
  USERS:'67824d4f000959ec966a'
} as const;