import { Query } from 'appwrite';
import { databases } from './config';

// import type { Post, User } from '../../types';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABSE_ID;
const POSTS = import.meta.env.VITE_APPWRITE_POSTS;
const USERS = import.meta.env.VITE_APPWRITE_USERS;

export async function searchPosts(query: string) {
  return databases.listDocuments(
    DATABASE_ID,
POSTS,
    [
      Query.search('title', query),
      Query.limit(10)
    ]
  );
}

export async function searchUsers(query: string) {
  try {
    if (!query.trim()) {
      return { documents: [] };
    }

    const searchQuery = query.toLowerCase().trim();

    return databases.listDocuments(
      DATABASE_ID,
USERS,
      [
        Query.search('name', searchQuery),
        Query.limit(20),
        Query.orderDesc('$createdAt')
      ]
    );
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Failed to search users');
  }
}

export async function searchByTags(tags: string[]) {
  return databases.listDocuments(
    DATABASE_ID,
POSTS,
    [
      Query.search('tags', tags.join(',')),
      Query.limit(10)
    ]
  );
}