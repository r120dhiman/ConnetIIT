import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { suggestFriends } from '../lib/appwrite/friendSuggester';
import { Card, CardContent, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { Users,CheckCircle } from "lucide-react";

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
    <div className="p-6 max-w-[80%] bg-white rounded-2xl shadow-md space-y-4">
      <Typography variant="h5" className="text-zinc-800 font-bold flex items-center gap-2">
        <Users /> Friend Suggestions
      </Typography>
      {loading && <CircularProgress className="block" />}
      {error && <Alert severity="error">{error}</Alert>}
      <div className="space-y-1 flex flex-row  gap-3">
        {displayedSuggestions.map((user) => (
           <Card key={user.$id} className="relative w-24 p-2 shadow-md rounded-lg flex flex-col items-center bg-white">
           {/* Avatar with Green Dot */}
           <div className="relative w-16 h-16">
  <Avatar className="w-full h-full rounded-full overflow-hidden">
    <AvatarImage src={user.avatar || "/default-avatar.png"} alt={user.name} className="w-full h-full object-cover" />
    <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-600 text-lg rounded-full">
      {user.name[0]}
    </AvatarFallback>
  </Avatar>
  {/* Green Online Dot */}
  <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
</div>
 
           {/* Username */}
           <div className="text-center mt-1">
             <p className="text-sm font-semibold text-gray-800">{user.name}</p>
           </div>
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