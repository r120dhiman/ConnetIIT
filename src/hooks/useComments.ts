import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getComments, createComment, likeComment } from '../lib/appwrite/comments';
import type { Comment } from '../types/comment';

export function useComments(postId: string) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await getComments(postId);
      setComments(response.documents as Comment[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch comments'));
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, parentId?: string) => {
    if (!user) return;

    try {
      const newComment = await createComment({
        postId,
        userId: user.id,
        content,
        parentId,
      });
      setComments([newComment as Comment, ...comments]);
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await likeComment(commentId);
      setComments(comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      ));
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  return {
    comments,
    loading,
    error,
    addComment,
    likeComment: handleLike,
  };
}