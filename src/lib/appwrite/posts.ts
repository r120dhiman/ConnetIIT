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

export async function createPost(post: {
  userId: string;
  title: string;
  content: string;
  tags: string[];
  githubUrl?: string;
}) {
  try {
    // Validate required fields
    if (!post.userId || !post.title || !post.content || !Array.isArray(post.tags)) {
      throw new Error('Missing required fields');
    }

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.POSTS,
      ID.unique(),
      {
        userId: post.userId,
        title: post.title,
        content: post.content,
        tags: post.tags,
        githubUrl: post.githubUrl || '',
        likes: 0
      }
    );

    console.log("Post created successfully:", response);
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