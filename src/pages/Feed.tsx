import { PostCard } from '../components/posts/PostCard';
import { CreatePost } from '../components/posts/CreatePost';
import { usePosts } from '../hooks/usePosts';
import { Header } from '../components/layout/Header';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import FriendSuggestions from '../components/friendSuggestions'; // Importing FriendSuggestions component
import { useAuth } from '../contexts/AuthContext';

export function Feed() {
  const { posts, loading, error, handleLike } = usePosts();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [showFriendSuggestions, setShowFriendSuggestions] = useState(true); // State to manage visibility of FriendSuggestions
  const { user, userProfile } = useAuth();

  const toggleCreatePost = () => {
    setIsCreatingPost((prev) => !prev);
  };

  const toggleFriendSuggestions = () => {
    setShowFriendSuggestions((prev) => !prev); // Toggle visibility of FriendSuggestions
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
        {/* Adding Friend Suggestions section at the top */}
        {/* {showFriendSuggestions && (
          <div>
            <FriendSuggestions userId={user!.$id} userInterests={userProfile!.interests} />
          </div>
        )}
            <button onClick={toggleFriendSuggestions} className="text-indigo-600">
              {showFriendSuggestions ? 'Close Friend Suggestions' : 'Show Friend Suggestions'}
            </button> */}

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Feed</h1>
          <button 
            onClick={toggleCreatePost} 
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {isCreatingPost ? 'Cancel' : 'Create Post'}
          </button>
        </div>
        
        {isCreatingPost && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <CreatePost />
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
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