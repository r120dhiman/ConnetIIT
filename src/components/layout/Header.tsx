import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../lib/appwrite/auth';
import { Laptop, MessageSquare, Trophy, LogOut, User, Menu, X } from 'lucide-react';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div className="container flex flex-wrap items-center justify-between max-w-7xl mx-auto px-4 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 shrink-0">
          <Laptop className="h-8 w-8 text-indigo-600" />
          <span className="font-bold text-xl text-gray-800 hidden sm:inline-block">ConnectIT</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:justify-between lg:flex-1 lg:ml-8">
          <nav className="flex items-center space-x-6">
            <Link to="/feed" className="nav-link group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Feed</span>
              <div className="h-0.5 w-0 group-hover:w-full bg-indigo-600 transition-all duration-200" />
            </Link>
            <Link to="/chat-anonymously" className="nav-link group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Random Chat</span>
              <div className="h-0.5 w-0 group-hover:w-full bg-indigo-600 transition-all duration-200" />
            </Link>
            <Link to="/communities" className="nav-link group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Communities</span>
              <div className="h-0.5 w-0 group-hover:w-full bg-indigo-600 transition-all duration-200" />
            </Link>
            <Link to="/travel" className="nav-link group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Travel Along</span>
              <div className="h-0.5 w-0 group-hover:w-full bg-indigo-600 transition-all duration-200" />
            </Link>
          </nav>

          {/* User actions for desktop */}
          <div className="flex items-center space-x-6">
            <Link to="/chat" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm font-medium">Messages</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-6">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 group"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{user.name}</span>
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
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm hover:shadow"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu container */}
        <div className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } lg:hidden flex-col w-full fixed top-16 right-0 bg-white h-[calc(100vh-4rem)] overflow-y-auto shadow-lg z-50`}>
          {/* Navigation links */}
          <nav className="flex flex-col lg:flex-row w-full lg:w-auto lg:ml-8 space-y-2 lg:space-y-0 lg:space-x-8 p-4 lg:p-0">
            {/* <Link to="/feed" className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 flex items-center px-4 py-2 lg:p-0">
              Feed
            </Link> */}
            <Link to="/chat-anonymously" className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 flex items-center px-4 py-2 lg:p-0">
              Random Chat
            </Link>
            <Link to="/communities" className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 flex items-center px-4 py-2 lg:p-0">
              Communities
            </Link>
            <Link to="/travel" className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 flex items-center px-4 py-2 lg:p-0">
              Travel Along
            </Link>
            <Link to="/chat" className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 flex items-center px-4 py-2 lg:p-0">
              <MessageSquare className="h-4 w-4 inline-block mr-2" />
              Messages
            </Link>
          </nav>

          {/* User actions */}
          <div className="border-t lg:border-none mt-2 lg:mt-0 p-4 lg:p-0 w-full lg:w-auto">
            {user ? (
              <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-6">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors px-4 py-2 lg:p-0"
                >
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors px-4 py-2 lg:p-0 w-full lg:w-auto"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="w-full lg:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow h-10 px-6"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}