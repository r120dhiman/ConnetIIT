import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { CommentList } from '../comments/CommentList';
import type { Post } from '../../types';
import { getUsersByIds } from '../../lib/appwrite/users';
import { getCommentsByPostId } from '../../lib/appwrite/comments';
import { CommentUser } from '../../types/comment';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  users: Record<string, { $id: string; name: string; avatarUrl: string }>;
}

export function PostCard({ post, onLike, onShare, users }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentUsers, setCommentUsers] = useState<Record<string, CommentUser>>({});
  const [loading, setLoading] = useState(false);

  // Fetch user data for comments when comments are shown
  useEffect(() => {
    if (!showComments) return;

    const fetchCommentUsers = async () => {
      setLoading(true);
      try {
        // Get comments for this post
        const comments = await getCommentsByPostId(post.$id);
        
        // Extract unique user IDs from comments
        const userIds = [...new Set(comments.map(comment => comment.userId))];
        
        if (userIds.length > 0) {
          // Fetch user data for all comment authors
          const userDataMap = await getUsersByIds(userIds);
          setCommentUsers({...users, ...userDataMap});
        }
      } catch (error) {
        console.error('Error fetching comment users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommentUsers();
  }, [showComments, post.$id, users]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  console.log("PostCard ", post.$id);
  // console.log("onlike", onLike);
  
  

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
      <p className="text-muted-foreground mb-4">{post.content}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      {post.githubUrl && (
        <a
          href={post.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline mb-4 block"
        >
          View Project on GitHub
        </a>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex space-x-4">
          <button
            onClick={() => onLike(post.$id)}
            className="flex items-center space-x-1 hover:text-primary"
          >
            <Heart className="h-4 w-4" />
            <span>{post.likes}</span>
          </button>
          <button
            onClick={toggleComments}
            className="flex items-center space-x-1 hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Comments</span>
          </button>
          <button
            onClick={() => onShare(post.$id)}
            className="flex items-center space-x-1 hover:text-primary"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
        <span>{formatDistanceToNow(new Date(post.$createdAt))} ago</span>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t">
          <CommentList postId={post.$id} users={commentUsers} />
        </div>
      )}
    </div>
  );
}