import { useState, useEffect } from 'react';
import { getChallenges, joinChallenge } from '../lib/appwrite/challenges';
import type { Challenge } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useChallenges() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const fetchedChallenges = await getChallenges();
      setChallenges(fetchedChallenges);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch challenges'));
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (challengeId: string) => {
    if (!user) return;
    
    try {
      await joinChallenge(challengeId, user.id);
      // Update local state
      setChallenges(challenges.map(challenge =>
        challenge.id === challengeId
          ? { ...challenge, participants: [...challenge.participants, user.id] }
          : challenge
      ));
    } catch (err) {
      console.error('Error joining challenge:', err);
    }
  };

  return { challenges, loading, error, handleJoin, refetch: fetchChallenges };
}