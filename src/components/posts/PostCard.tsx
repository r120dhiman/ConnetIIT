import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { CommentList } from '../comments/CommentList';
import type { Post } from '../../types';
import { getUsersByIds } from '../../lib/appwrite/users';
import { getCommentsByPostId } from '../../lib/appwrite/comments';
import { CommentUser } from '../../types/comment';
import { databases } from '../../lib/appwrite'
import { COLLECTIONS } from '../../lib/appwrite/config';
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
import { useAuth } from '../../contexts/AuthContext';



interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  users: Record<string, { $id: string; name: string; avatarUrl: string }>;
}

export function PostCard({ post, onLike, onShare, users }: PostCardProps) {
  const {user}=useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentUsers, setCommentUsers] = useState<Record<string, CommentUser>>({});
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);

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

  // Check if the post is liked by the user when the component mounts
  useEffect(() => {
    const checkIfLiked = async () => {
      if (user) {
        try {
          const userDoc = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            user.$id
          );
          setLiked(userDoc.posts_liked.includes(post.$id)); // Set liked state based on user's liked posts
        } catch (error) {
          console.error('Error fetching user liked posts:', error);
        }
      }
    };

    checkIfLiked();
  }, [user, post.$id]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleLike = async () => {
    try {
      const isLiked = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        user.$id
      );

      if (isLiked.posts_liked.includes(post.$id)) {
        // User is unliking the post
        post.likes -= 1;
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.POSTS,
          post.$id,
          {
            likes: post.likes // Correctly update the likes count
          }
        );
        isLiked.posts_liked = isLiked.posts_liked.filter(id => id !== post.$id);
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          user.$id,
          {
            posts_liked: isLiked.posts_liked // Update the user's posts_liked array
          }
        );
        setLiked(false);
      } else {
        // User is liking the post
        post.likes += 1;
        isLiked.posts_liked.push(post.$id);
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.POSTS,
          post.$id,
          {
            likes: post.likes // Correctly update the likes count
          }
        );
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          user.$id,
          {
            posts_liked: isLiked.posts_liked // Update the user's posts_liked array
          }
        );
        setLiked(true);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };
  
  

  return (
    <div className="bg-[#262438] text-[#fafafa] rounded-3xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
      <p className=" mb-4">{post.content}</p>
      
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
            onClick={handleLike}
            className={`flex items-center space-x-1 ${liked ? 'text-orange-500' : 'text-gray-500'}`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'text-orange-500/80' : ''}`} />
            <span>{post.likes}</span>
          </button>
          <button
            onClick={toggleComments}
            className="flex items-center space-x-1 hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Comments</span>
          </button>
          {/* <button
            onClick={() => onShare(post.$id)}
            className="flex items-center space-x-1 hover:text-primary"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button> */}
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