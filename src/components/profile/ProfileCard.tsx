import React from 'react';
import { User } from '../../types';
import { Github, Linkedin, Trophy } from 'lucide-react';

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  console.log("user", user);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <img
          src={user.profileUrl}
          alt={user.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.college}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-semibold mb-2">About</h3>
        <p className="text-sm text-muted-foreground text-red-300">{user.bio}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Friends</h3>
        <div className="flex flex-wrap gap-2">
          {user.friendsId.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {user.interests.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        {/* <div className="flex items-center">
          <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
          <span className="text-sm">Rank #{user.currentRank}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Best: #{user.bestRank}
        </div> */}
      </div>

      {/* <div className="mt-4 flex space-x-4">
        {user.githubUrl && (
          <a
            href={user.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="h-5 w-5" />
          </a>
        )}
        {user.linkedinUrl && (
          <a
            href={user.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        )}
      </div> */}
    </div>
  );
}