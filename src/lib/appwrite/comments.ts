import { ID, Query } from 'appwrite';
import { databases } from './config';
import { COLLECTIONS } from './config';
import type { Comment } from '../../types/comment';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export async function getComments(postId: string) {
  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.COMMENTS,
    [
      Query.equal('postId', postId),
      Query.orderDesc('$createdAt'),
    ]
  );
}

export async function createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) {
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.COMMENTS,
    ID.unique(),
    {
      ...comment,
      likes: 0,
    }
  );
}

export async function likeComment(commentId: string) {
  const comment = await databases.getDocument(
    DATABASE_ID,
    COLLECTIONS.COMMENTS,
    commentId
  );
  
  return databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.COMMENTS,
    commentId,
    { likes: (comment.likes || 0) + 1 }
  );
}