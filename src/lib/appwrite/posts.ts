import { ID, Query } from 'appwrite';
import { databases } from './config';
import { COLLECTIONS } from './config';
import type { Post } from '../../types';

const DATABASE_ID = '6775235f000aeef1a930';

export async function getPosts() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.POSTS,
      [Query.orderDesc('$createdAt'), Query.limit(20)]
    );
    console.log("response", response);
    
    return response.documents as Post[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function createPost(post: Omit<Post, 'id' | 'createdAt' | 'likes'>) {
  console.log('Database ID:', DATABASE_ID);
  console.log('Collection ID:', COLLECTIONS);
  
  console.log("creating post");
  console.log("creating data", databases);
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.POSTS,
      ID.unique(),
      {
        ...post,
        likes: 0,
      }
    );
    console.log("create response", response);
    return response;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function likePost(postId: string) {
  console.log("post id", postId);
  
  try {
    const post = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.POSTS,
      postId
    );
    console.log("liked post", post);
    
    
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.POSTS,
      postId,
      { likes: (post.likes || 0) + 1 }
    );
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
}