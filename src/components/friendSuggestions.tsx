import React, { useEffect, useState } from 'react';
import { suggestFriends } from '../lib/appwrite/friendSuggester';
import { Card, CardContent, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { Users } from "lucide-react";

const FriendSuggestions: React.FC<{ userId: string; userInterests: string[] }> = ({ userId, userInterests }) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [displayedSuggestions, setDisplayedSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const newSuggestions = await suggestFriends(userId, userInterests, page);
      if (newSuggestions.length < 10) {
        setHasMore(false);
      }
      setSuggestions((prev) => [...prev, ...newSuggestions]);
    } catch (err) {
      setError('Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [page]);

  useEffect(() => {
    const startIndex = (page - 1) * 5;
    const endIndex = startIndex + 5;
    setDisplayedSuggestions(suggestions.slice(startIndex, endIndex));
  }, [suggestions, page]);

  const handleSeeMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="p-6 max-w-md bg-white rounded-2xl shadow-md space-y-4">
      <Typography variant="h5" className="text-zinc-800 font-bold flex items-center gap-2">
        <Users /> Friend Suggestions
      </Typography>
      {loading && <CircularProgress className="block" />}
      {error && <Alert severity="error">{error}</Alert>}
      <div className="space-y-1">
        {displayedSuggestions.map((user) => (
          <Card key={user.$id} className="">
            <CardContent>
              <Typography variant="body1">{user.name}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
      {hasMore && (
        <Button onClick={handleSeeMore} variant="contained" color="primary" fullWidth>
          See More
        </Button>
      )}
    </div>
  );
};

export default FriendSuggestions;