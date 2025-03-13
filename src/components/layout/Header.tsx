import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../lib/appwrite/auth';
import { Laptop, MessageSquare, Trophy, LogOut, User } from 'lucide-react';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Laptop className="h-6 w-6" />
          <span className="font-bold">ConnectIT</span>
        </Link>
        
        <nav className="flex items-center space-x-6 ml-6">
          <Link to="/feed" className="text-sm font-medium transition-colors hover:text-primary">
            Feed
          </Link>
          <Link to="/chat-anonymously" className="text-sm font-medium transition-colors hover:text-primary">
            Random Chat
          </Link>
          {/* <Link to="/challenges" className="text-sm font-medium transition-colors hover:text-primary">
            <Trophy className="h-4 w-4 inline-block mr-1" />
            Challenges
          </Link> */}
          <Link to="/chat" className="text-sm font-medium transition-colors hover:text-primary">
            <MessageSquare className="h-4 w-4 inline-block mr-1" />
            Messages
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-sm font-medium hover:text-primary"
              >
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/sign-in"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}