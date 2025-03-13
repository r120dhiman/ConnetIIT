import { PostCard } from '../components/posts/PostCard';
import { CreatePost } from '../components/posts/CreatePost';
import { usePosts } from '../hooks/usePosts';
import { Header } from '../components/layout/Header';
import { Loader2 } from 'lucide-react';

export function Feed() {
  const { posts, loading, error, handleLike } = usePosts();

  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-red-800 font-medium">Something went wrong</h3>
          <p className="text-red-600 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Feed</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <CreatePost />
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts yet. Be the first to share something!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}