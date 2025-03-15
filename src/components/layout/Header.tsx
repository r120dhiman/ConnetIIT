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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center max-w-7xl mx-auto px-4">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Laptop className="h-7 w-7 text-indigo-600" />
          <span className="font-bold text-xl text-gray-800">ConnectIT</span>
        </Link>
        
        <nav className="flex items-center space-x-8 ml-8">
          <Link to="/feed" className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 flex items-center">
            Feed
          </Link>
          <Link to="/chat-anonymously" className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 flex items-center">
            Random Chat
          </Link>
          <Link to="/communities" className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 flex items-center">
            Communities
          </Link>
          <Link to="/travel" className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 flex items-center">
            Travel Along
          </Link>
          {/* <Link to="/challenges" className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 flex items-center">
            <Trophy className="h-4 w-4 inline-block mr-2" />
            Challenges
          </Link> */}
          <Link to="/chat" className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 flex items-center">
            <MessageSquare className="h-4 w-4 inline-block mr-2" />
            Messages
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-6">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>{user.name}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/sign-in"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow h-10 px-6 py-2"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}