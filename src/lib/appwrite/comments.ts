import { databases, COLLECTIONS } from './config';
import { Query } from 'appwrite';
import { Comment } from '../../types/comment';
import { useAuth } from '../../contexts/AuthContext';

// Update these values with your actual Appwrite configuration
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
// const {user}=useAuth();
// console.log("i am from comments.ts",user);
const COMMENTS_COLLECTION_ID = COLLECTIONS.COMMENTS; // Fix: Use COMMENTS collection, not USERS

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COMMENTS_COLLECTION_ID,
      [
        // Use Query class instead of databases.createQuery()
        Query.equal('postId', postId)
      ]
    );
    
    console.log(`Fetched ${response.documents.length} comments for post ${postId}`);
    return response.documents as Comment[];
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    return [];
  }
};

export const createComment = async (
  postId: string, 
  userId: string,
  content: string, 
  parentId: string = ''
): Promise<Comment | null> => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COMMENTS_COLLECTION_ID,
      'unique()',
      {
        postId,
        userId,
        // username:user.name,
        content,
        parentId,
        likes: 0
      }
    );
    
    return response as Comment;
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
};

export const likeComment = async (commentId: string): Promise<boolean> => {
  try {
    // First get the current comment to get the current likes count
    const comment = await databases.getDocument(
      DATABASE_ID,
      COMMENTS_COLLECTION_ID,
      commentId
    ) as Comment;
    
    // Increment the likes count
    const updatedComment = await databases.updateDocument(
      DATABASE_ID,
      COMMENTS_COLLECTION_ID,
      commentId,
      {
        likes: (comment.likes || 0) + 1
      }
    );
    
    return true;
  } catch (error) {
    console.error(`Error liking comment ${commentId}:`, error);
    return false;
  }
};