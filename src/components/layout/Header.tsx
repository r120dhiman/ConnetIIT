import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Laptop, MessageSquare, Trophy, LogOut, User, Home, Users, Plane } from 'lucide-react';

export function Header() {
  const {  user, signOut, userProfile } = useAuth();
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
<<<<<<< HEAD
    <header className="sticky top-0 z-50 w-full border-b border-gray-200" style={{ backgroundColor: '#1B1730' }}>
      <div className="container flex flex-wrap items-center justify-between max-w-7xl mx-auto px-4 h-16">
=======
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm lg:h-16">
      <div className="container flex items-center justify-between max-w-7xl mx-auto px-4 h-16 lg:flex-row">
>>>>>>> 84342f55e1ba18c56ea1a8f1564c495cd73d10c1
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 shrink-0">
          <Laptop className="h-8 w-8 text-white" />
          <span className="font-bold text-xl text-white hidden sm:inline-block">ConnectIIT</span>
        </Link>
<<<<<<< HEAD
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
=======
>>>>>>> 84342f55e1ba18c56ea1a8f1564c495cd73d10c1

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:justify-between lg:flex-1 lg:ml-8">
          <nav className="flex items-center space-x-6">
            <Link to="/" className="nav-link group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Home</span>
            </Link>
            <Link to="/chat" className="nav-link group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Messages</span>
            </Link>
            <Link to="/chat-anonymously" className="nav-link group">
<<<<<<< HEAD
              <span className="text-sm font-medium text-white group-hover:text-[#FE744D] transition-colors">Random Chat</span>
              <div className="h-0.5 w-0 group-hover:w-full bg-[#FE744D] transition-all duration-200" />
            </Link>
            <Link to="/communities" className="nav-link group">
              <span className="text-sm font-medium text-white group-hover:text-[#FE744D] transition-colors">Communities</span>
              <div className="h-0.5 w-0 group-hover:w-full bg-[#FE744D] transition-all duration-200" />
            </Link>
            <Link to="/travel" className="nav-link group">
              <span className="text-sm font-medium text-white group-hover:text-[#FE744D] transition-colors">Travel Along</span>
              <div className="h-0.5 w-0 group-hover:w-full bg-[#FE744D] transition-all duration-200" />
=======
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Random Chat</span>
            </Link>
            <Link to="/communities" className="nav-link group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Communities</span>
            </Link>
            <Link to="/travel" className="nav-link group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Travel Along</span>
>>>>>>> 84342f55e1ba18c56ea1a8f1564c495cd73d10c1
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
<<<<<<< HEAD
            <Link to="/chat" className="flex items-center space-x-1 text-white hover:text-[#FE744D] transition-colors">
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
                    <User className="h-5 w-5 text-[#FE744D]" />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-[#FE744D] transition-colors">{user.name}</span>
=======
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/profile" className="flex items-center space-x-2 group">
                  <User className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{userProfile!.name}</span>
>>>>>>> 84342f55e1ba18c56ea1a8f1564c495cd73d10c1
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-sm font-medium text-white hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-[#FE744D] text-white hover:bg-[#FE744D] transition-colors shadow-sm hover:shadow"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

<<<<<<< HEAD
        {/* Mobile menu container */}
        <div className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } lg:hidden flex-col w-full fixed top-16 right-0 bg-[#1B1730] h-[calc(100vh-4rem)] overflow-y-auto shadow-lg z-50`}>
          {/* Navigation links */}
          <nav className="flex flex-col lg:flex-row w-full lg:w-auto lg:ml-8 space-y-2 lg:space-y-0 lg:space-x-8 p-4 lg:p-0">
            {/* <Link to="/feed" className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 flex items-center px-4 py-2 lg:p-0">
              Feed
            </Link> */}
            <Link to="/chat-anonymously" className="text-sm font-medium text-white transition-colors hover:text-[#FE744D] flex items-center px-4 py-2 lg:p-0">
              Random Chat
            </Link>
            <Link to="/communities" className="text-sm font-medium text-white transition-colors hover:text-[#FE744D] flex items-center px-4 py-2 lg:p-0">
              Communities
            </Link>
            <Link to="/travel" className="text-sm font-medium text-white transition-colors hover:text-[#FE744D] flex items-center px-4 py-2 lg:p-0">
              Travel Along
            </Link>
            <Link to="/chat" className="text-sm font-medium text-white transition-colors hover:text-[#FE744D] flex items-center px-4 py-2 lg:p-0">
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
                  className="flex items-center space-x-2 text-sm font-medium text-white hover:text-[#FE744D] transition-colors px-4 py-2 lg:p-0"
                >
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-sm font-medium text-white hover:text-red-500 transition-colors px-4 py-2 lg:p-0"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="w-full lg:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium bg-[#FE744D] text-white hover:bg-[#FE744D] shadow-sm hover:shadow h-10 px-6"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
=======
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md flex items-center justify-around p-2 lg:hidden">
        <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-indigo-600">
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/chat" className="flex flex-col items-center text-gray-700 hover:text-indigo-600">
          <MessageSquare className="h-6 w-6" />
          <span className="text-xs">Messages</span>
        </Link>
        <Link to="/chat-anonymously" className="flex flex-col items-center text-gray-700 hover:text-indigo-600">
          <MessageSquare className="h-6 w-6" />
          <span className="text-xs">Random Chat</span>
        </Link>
        <Link to="/communities" className="flex flex-col items-center text-gray-700 hover:text-indigo-600">
          <Users className="h-6 w-6" />
          <span className="text-xs">Communities</span>
        </Link>
        <Link to="/travel" className="flex flex-col items-center text-gray-700 hover:text-indigo-600">
          <Plane className="h-6 w-6" />
          <span className="text-xs">Travel</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-gray-700 hover:text-indigo-600">
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
>>>>>>> 84342f55e1ba18c56ea1a8f1564c495cd73d10c1
      </div>
    </header>
  );
}
