import { client } from './config';
import { COLLECTIONS } from './config';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export function subscribeToCollection(
  collectionId: string,
  callback: (payload: any) => void
) {
  return client.subscribe(
    `databases.${DATABASE_ID}.collections.${collectionId}.documents`,
    callback
  );
}

export function subscribeToLikes(postId: string, callback: (likes: number) => void) {
  return subscribeToCollection(COLLECTIONS.POSTS, (response) => {
    if (response.payload.$id === postId) {
      callback(response.payload.likes);
    }
  });
}

export function subscribeToComments(
  postId: string,
  callback: (comment: any) => void
) {
  return subscribeToCollection(COLLECTIONS.COMMENTS, (response) => {
    if (response.payload.postId === postId) {
      callback(response.payload);
    }
  });
}