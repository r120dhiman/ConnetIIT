
import { Challenge } from '../../types';
import { Calendar, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: (challengeId: string) => void;
}

export function ChallengeCard({ challenge, onJoin }: ChallengeCardProps) {
  const isActive = challenge.status === 'active';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{challenge.title}</h3>
        <span className={`px-2 py-1 rounded-full text-sm ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {challenge.status}
        </span>
      </div>
      
      <p className="text-muted-foreground mb-4">{challenge.description}</p>
      
      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Ends {formatDistanceToNow(new Date(challenge.deadline))} ago</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          <span>{challenge.participants.length} participants</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold text-primary">
          {challenge.points} points
        </div>
        {isActive && (
          <button
            onClick={() => onJoin(challenge.id)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Join Challenge
          </button>
        )}
      </div>
    </div>
  );
}