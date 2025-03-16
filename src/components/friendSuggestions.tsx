import React, { useEffect, useState } from 'react';
import { suggestFriends } from '../lib/appwrite/friendSuggester';

const FriendSuggestions: React.FC<{ userId: string; userInterests: string[] }> = ({ userId, userInterests }) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    console.log(`Fetching suggestions for userId: ${userId}, page: ${page}`);
    try {
      const newSuggestions = await suggestFriends(userId, userInterests);
      console.log(`Received ${newSuggestions.length} suggestions`);
      if (newSuggestions.length === 0) {
        setHasMore(false);
        console.log('No more suggestions available');
      }
      setSuggestions((prev) => [...prev, ...newSuggestions]);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Failed to fetch suggestions');
    } finally {
      setLoading(false);
      console.log('Finished fetching suggestions');
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [page]);

  const handleSeeMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
      console.log(`Loading more suggestions, new page: ${page + 1}`);
    }
  };

  return (
    <div>
      <h2>Friend Suggestions</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {suggestions.map((user) => (
          <li key={user.$id}>{user.name}</li>
        ))}
      </ul>
      {hasMore && <button className='text-zinc-400 font-semibold' onClick={handleSeeMore}>See More</button>}
    </div>
  );
};

export default FriendSuggestions;
