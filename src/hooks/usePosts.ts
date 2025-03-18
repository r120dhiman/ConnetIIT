import { useState, useEffect, useCallback } from 'react';
import { getPosts, likePost } from '../lib/appwrite/posts';
import type { Post } from '../types';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = useCallback(async (postId: string) => {
    console.log("usepost like postid", postId);
    
    try {
      await likePost(postId);
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  }, [posts]);

  // Add this function to update posts after creation
  const addNewPost = useCallback((newPost: Post) => {
    setPosts(currentPosts => [newPost, ...currentPosts]);
  }, []);

  return {
    posts,
    loading,
    error,
    handleLike,
    addNewPost,
    refreshPosts: fetchPosts
  };
}