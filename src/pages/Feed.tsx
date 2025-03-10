
import { PostCard } from '../components/posts/PostCard';
import { CreatePost } from '../components/posts/CreatePost';
import { usePosts } from '../hooks/usePosts';
import { Header } from '../components/layout/Header';

export function Feed() {
  const { posts, loading, error, handleLike } = usePosts();
// const [Posts, setPosts] = useState(posts);
  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
  };

  if (loading) {
    return <div className="text-center">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }
  // useEffect(() => {
  //   if (posts) {
  //     setPosts(posts);
  //   }
  // }, [posts])
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Header/>
      <h1 className="text-2xl font-bold mb-6">Feed</h1>
      <CreatePost />
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      ))}
    </div>
  );
}