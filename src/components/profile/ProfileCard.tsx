import { User } from '../../types';

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  console.log("user", user);
  
  return (
    <div className="bg-[#262438] rounded-lg shadow-md p-6" style={{ color: 'white' }}>
      <div className="flex items-center space-x-4">
        <img
          src={user.profileUrl}
          alt={user.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-300">{user.college}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-semibold mb-2">About</h3>
        <p className="text-sm text-gray-300">{user.bio}</p>
      </div>

      {/* <div className="mt-4">
        <h3 className="font-semibold mb-2">Friends</h3>
        <div className="flex flex-wrap gap-2">
          {user.friendsId.map((friendId) => (
            <span
              key={friendId}
              className="px-2 py-1 bg-primary text-primary-foreground rounded-md text-sm"
            >
              {friendId}
            </span>
          ))}
        </div>
      </div> */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {user.interests.map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 bg-[#392639] text-[#FE744D] rounded-xl text-md"
            >
              {interest}
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