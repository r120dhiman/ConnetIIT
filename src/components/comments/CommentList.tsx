import React, { useState } from 'react';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';
import { useComments } from '../../hooks/useComments';
import type { CommentUser } from '../../types/comment';
import { useAuth } from '../../contexts/AuthContext';
interface CommentListProps {
  postId: string;
  users: Record<string, CommentUser>;
}

export function CommentList({ postId, users }: CommentListProps) {
  const {user}=useAuth();
  const { comments, loading, addComment, likeComment } = useComments(postId);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  if (loading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const submitReply = async (content: string) => {
    if (replyingTo) {
      await addComment(content, replyingTo);
      setReplyingTo(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <CommentInput onSubmit={(content,user) => addComment(content,user)} />
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id}>
            <CommentItem
              comment={comment}
              user={users[comment.userId]}
              onLike={likeComment}
              onReply={handleReply}
            />
            
            {replyingTo === comment.id && (
              <div className="ml-11 mt-2">
                <CommentInput
                  onSubmit={submitReply}
                  placeholder="Write a reply..."
                />
              </div>
            )}
            
            {/* Nested comments */}
            {comments
              .filter(c => c.parentId === comment.id)
              .map(reply => (
                <div key={reply.id} className="ml-11 mt-2">
                  <CommentItem
                    comment={reply}
                    user={users[reply.userId]||" "}
                    onLike={likeComment}
                    onReply={handleReply}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}