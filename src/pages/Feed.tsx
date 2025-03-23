import { PostCard } from '../components/posts/PostCard';
import { CreatePost } from '../components/posts/CreatePost';
import { usePosts } from '../hooks/usePosts';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import FriendSuggestions from '../components/friendSuggestions'; // Importing FriendSuggestions component
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../components/shared/LoadingScreen';
import { Header } from '../components/layout/Header';

export function Feed() {
  const { posts, loading, error, handleLike, addNewPost, refreshPosts } = usePosts();
  
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [showFriendSuggestions, setShowFriendSuggestions] = useState(false); // State to manage visibility of FriendSuggestions
  const { user, userProfile } = useAuth();

  const toggleCreatePost = () => {
    setIsCreatingPost((prev) => !prev);
  };

  const toggleFriendSuggestions = () => {
    setShowFriendSuggestions((prev) => !prev); // Toggle visibility of FriendSuggestions
  };

  const handlePostCreated = (newPost: any) => {
    addNewPost(newPost);
    setIsCreatingPost(false); // Close the create post form
  };

  if (loading) {
    return <LoadingScreen message="Loading your feed..." />;
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
    <div className="min-h-screen bg-[#1B1730]">
      <Header/>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Adding Friend Suggestions section at the top */}
        {showFriendSuggestions && (
          <div>
            <FriendSuggestions userId={user!.$id} userInterests={userProfile!.interests} />
          </div>
        )}
            <button onClick={toggleFriendSuggestions} className="text-[#FE744D]">
              {showFriendSuggestions ? 'Close Online Users' : 'Show Online Users'}
            </button>

        <div className="flex items-center   justify-between">
          <h1 className="text-3xl font-bold text-white">Feed</h1>
          <button 
            onClick={toggleCreatePost} 
            className="bg-[#FE744D] text-white px-4 py-2 rounded-full"
          >
            {isCreatingPost ? 'Cancel' : 'Create Post'}
          </button>
        </div>
        
        {isCreatingPost && (
          <div className="bg-[#262438] rounded-xl shadow-sm p-6">
            <CreatePost 
              onPostCreated={handlePostCreated}
              onCancel={() => setIsCreatingPost(false)}
            />
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.$id}
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