import { Query } from 'appwrite';
import { databases } from './config';
import { COLLECTIONS } from './config';
// import type { Post, User } from '../../types';

const DATABASE_ID = "6775235f000aeef1a930";

export async function searchPosts(query: string) {
  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.POSTS,
    [
      Query.search('title', query),
      Query.limit(10)
    ]
  );
}

export async function searchUsers(query: string) {
  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.USERS,
    [
      Query.search('name', query),
      Query.limit(10)
    ]
  );
}

export async function searchByTags(tags: string[]) {
  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.POSTS,
    [
      Query.search('tags', tags.join(',')),
      Query.limit(10)
    ]
  );
}