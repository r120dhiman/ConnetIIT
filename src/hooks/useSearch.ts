import { useState } from 'react';
import { searchPosts, searchUsers, searchByTags } from '../lib/appwrite/search';
import type { Post, User } from '../types';

export function useSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<{
    posts: Post[];
    users: User[];
  }>({
    posts: [],
    users: [],
  });

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults({ posts: [], users: [] });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [postsResponse, usersResponse] = await Promise.all([
        searchPosts(query),
        searchUsers(query),
      ]);

      setResults({
        posts: postsResponse.documents as Post[],
        users: usersResponse.documents as User[],
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Search failed'));
    } finally {
      setLoading(false);
    }
  };

  return {
    search,
    results,
    loading,
    error,
  };
}