import React from 'react';
import { ChallengeCard } from '../components/challenges/ChallengeCard';
import { useChallenges } from '../hooks/useChallenges';
import { Header } from '../components/layout/Header';

export function Challenges() {
  const { challenges, loading, error, handleJoin } = useChallenges();

  if (loading) {
    return <div className="text-center">Loading challenges...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Header/>
      <h1 className="text-2xl font-bold mb-6">Challenges</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onJoin={handleJoin}
          />
        ))}
      </div>
    </div>
  );
}