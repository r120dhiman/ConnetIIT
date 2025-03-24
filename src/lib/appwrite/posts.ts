import { ID, Query } from 'appwrite';
import { databases } from './config';
import { COLLECTIONS } from './config';
import type { Post } from '../../types';

const DATABASE_ID = '6775235f000aeef1a930';

// export async function getPosts() {
//   try {
//     const response = await databases.listDocuments(
//       DATABASE_ID,
//       COLLECTIONS.POSTS,
//       [Query.orderDesc('$createdAt'), Query.limit(20)]
//     );
//     console.log("response", response);
    
//     return response.documents as Post[];
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     return [];
//   }
// }

export async function getPosts(limit = 10, offset = 0) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.POSTS,
      [
        // Add your queries, for example:
        Query.orderDesc('$createdAt'), // Sort by creation date, newest first
        Query.limit(limit),
        Query.offset(offset)
      ]
    );

    return response.documents as Post[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
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

export async function likePost(postId: string, userId: string) {
  console.log("post id", postId);
  
  try {
    const post = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.POSTS,
      postId
    );
    console.log("liked post", post);
    
    // Check if the user has already liked the post
    const user = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      userId
    );

    if (user.posts_liked && user.posts_liked.includes(postId)) {
      console.log("User has already liked this post.");
      return; // User has already liked the post, exit the function
    }

    // Increment the likes count
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.POSTS,
      postId,
      { likes: (post.likes || 0) + 1 }
    );

    // Update user's posts_liked array
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      userId,
      { posts_liked: [...(user.posts_liked || []), postId] }
    );
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
}