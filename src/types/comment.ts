export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: number;
  parentId?: string; // For nested comments
}

export interface CommentUser {
  id: string;
  name: string;
  avatarUrl: string;
}