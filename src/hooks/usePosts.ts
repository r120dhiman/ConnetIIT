import { useState, useEffect, useCallback } from 'react';
import { getPosts, likePost } from '../lib/appwrite/posts';
import { subscribeToLikes } from '../lib/appwrite/realtime';
import { useAuth } from '../contexts/AuthContext';
import type { Post } from '../types';

// Number of posts to fetch per page
const POSTS_PER_PAGE = 10;

export function usePosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (page = 0, reset = true) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Calculate offset based on page
      const offset = page * POSTS_PER_PAGE;
      
      // Update the getPosts function to accept limit and offset parameters
      const fetchedPosts = await getPosts(POSTS_PER_PAGE, offset);
      
      if (fetchedPosts.length < POSTS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (reset) {
        setPosts(fetchedPosts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
      }
      
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMorePosts = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchPosts(currentPage + 1, false);
    }
  }, [fetchPosts, currentPage, loadingMore, hasMore]);

  const refreshPosts = useCallback(() => {
    return fetchPosts(0, true);
  }, [fetchPosts]);

  // Initial load
  useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  // Realtime subscriptions for likes
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
    loadingMore,
    error,
    hasMore,
    handleLike,
    loadMorePosts,
    addNewPost: (newPost: Post) => setPosts(currentPosts => [newPost, ...currentPosts]),
    refreshPosts
  };
}