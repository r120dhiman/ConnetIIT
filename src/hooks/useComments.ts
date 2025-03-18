import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCommentsByPostId, createComment, likeComment as likeCommentAPI } from '../lib/appwrite/comments';
import type { Comment } from '../types/comment';

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const fetchedComments = await getCommentsByPostId(postId);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const addComment = async (content: string, parentId: string = '') => {
    if (!user) {
      console.error('User must be logged in to comment');
      return;
    }

    try {
      const newComment = await createComment(
        postId,
        user.$id,
        content,
        parentId
      );

      if (newComment) {
        setComments(prevComments => [...prevComments, newComment]);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      const success = await likeCommentAPI(commentId);
      
      if (success) {
        // Update the comment in the local state
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.$id === commentId 
              ? { ...comment, likes: (comment.likes || 0) + 1 } 
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  return {
    comments,
    loading,
    addComment,
    likeComment
  };
};