import { useState, useEffect, useCallback } from 'react';
import { getPosts, likePost } from '../lib/appwrite/posts';
import { subscribeToLikes } from '../lib/appwrite/realtime';
import { useAuth } from '../contexts/AuthContext';
import type { Post } from '../types';

export function usePosts() {
  const { user } = useAuth();
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

  // Subscribe to likes for each post
  useEffect(() => {
    const subscriptions = posts.map(post => {
      return subscribeToLikes(post.id, (likes) => {
        setPosts(prevPosts => 
          prevPosts.map(p => 
            p.id === post.id ? { ...p, likes } : p
          )
        );
      });
    });

    // Cleanup subscriptions on unmount
    return () => {
      subscriptions.forEach(unsubscribe => unsubscribe());
    };
  }, [posts]);

  const handleLike = useCallback(async (postId: string) => {
    console.log("usepost like postid", postId);
    
    try {
      if (!user) {
        console.error('User must be logged in to like a post');
        return;
      }

      const userId = user.$id;
      await likePost(postId, userId);
      
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  }, [posts, user]);

  return {
    posts,
    loading,
    error,
    handleLike,
    addNewPost: (newPost: Post) => setPosts(currentPosts => [newPost, ...currentPosts]),
    refreshPosts: fetchPosts
  };
}