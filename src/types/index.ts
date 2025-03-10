export interface User {
  id: string;
  email: string;
  name: string;
  college: string;
  skills: string[];
  currentRank: number;
  bestRank: number;
  avatarUrl: string;
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
  isOnline:boolean;
  lastSeen:string;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  githubUrl?: string;
  likes: number;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  deadline: string;
  participants: string[];
  status: 'active' | 'completed';
}