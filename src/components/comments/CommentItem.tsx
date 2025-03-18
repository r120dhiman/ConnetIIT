
import { formatDistanceToNow } from 'date-fns';
import { Heart } from 'lucide-react';
import type { Comment, CommentUser } from '../../types/comment';
import { useEffect } from 'react';

interface CommentItemProps {
  comment: Comment;
  // user: CommentUser;
  onLike: (commentId: string) => void;
  onReply: (commentId: string) => void;
}

export function CommentItem({ comment, user, onLike, onReply }: CommentItemProps) {
  console.log(comment);
  
  return (
    <div className="flex space-x-3 py-3">
      {/* <img
        src={user.profileUrl}
        alt={user.name}
        className="h-8 w-8 rounded-full"
      /> */}
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between">
            {/* <span className="font-medium">{comment.username}</span> */}
            <span className="text-sm text-gray-500">
              {/* {formatDistanceToNow(new Date(comment.createdAt))} ago */}
            </span>
          </div>
          <p className="mt-1 text-gray-800">{comment.content}</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-1 text-sm">
          <button
            onClick={() => onLike(comment.id)}
            className="flex items-center space-x-1 text-gray-500 hover:text-primary"
          >
            <Heart className="h-4 w-4" />
            <span>{comment.likes}</span>
          </button>
          <button
            onClick={() => onReply(comment.id)}
            className="text-gray-500 hover:text-primary"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}