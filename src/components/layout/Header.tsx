import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Laptop, MessageSquare, Trophy, LogOut, User, Home, Users, Plane } from 'lucide-react';

export function Header() {
  const { user, signOut, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#262438] bg-[#1B1730] shadow-sm lg:h-16">
      <div className="container flex items-center justify-between max-w-7xl mx-auto px-4 h-16 lg:flex-row">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 shrink-0">
          <Laptop className="h-8 w-8 text-[#fafafa]" />
          <span className="font-bold text-xl text-[#fafafa] hidden sm:inline-block">ConnectIIT</span>
        </Link>
        <Link to="/chat-anonymously" className={`flex flex-col items-center lg:hidden ${location.pathname === '/chat-anonymously' ? 'text-orange-500' : 'text-gray-300'} hover:text-indigo-600 text-[#1B1730] font-semibold bg-[#FE744D] px-7 py-1 rounded-full`}>
          <MessageSquare className="h-6 w-6" />
          <span className="text-xs ">Random Chat</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:justify-between lg:flex-1 lg:ml-8">
          <nav className="flex items-center space-x-6">
            <Link to="/" className={`nav-link group ${location.pathname === '/' ? 'text-[#fafafa] font-semibold bg-[#FE744D] px-3 py-1 rounded-full': 'text-[#fafafa] font-medium'}`}>
              <span className="text-sm transition-colors">Home</span>
            </Link>
            <Link to="/chat" className={`nav-link group ${location.pathname === '/chat' ? 'text-[#fafafa] font-semibold bg-[#FE744D] px-3 py-1 rounded-full' : 'text-[#fafafa] font-medium'}`}>
              <span className="text-sm transition-colors">Messages</span>
            </Link>
            <Link to="/chat-anonymously" className={`nav-link group ${location.pathname === '/chat-anonymously' ? 'text-[#fafafa] font-semibold bg-[#FE744D] px-3 py-1 rounded-full' : 'text-[#fafafa] font-medium'}`}>
              <span className="text-sm  transition-colors">Random Chat</span>
            </Link>
            <Link to="/communities" className={`nav-link group ${location.pathname === '/communities' ? 'text-[#fafafa] font-semibold bg-[#FE744D] px-3 py-1 rounded-full' : 'text-[#fafafa] font-medium'}`}>
              <span className="text-sm transition-colors">Communities</span>
            </Link>
            <Link to="/travel" className={`nav-link group ${location.pathname === '/travel' ? 'text-[#fafafa] font-semibold bg-[#FE744D] px-3 py-1 rounded-full' : 'text-[#fafafa] font-medium'}`}>
              <span className="text-sm transition-colors">Travel Along</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/profile" className="flex items-center space-x-2 group">
                  <User className="h-5 w-5 text-[#FE744D]" />
                  <span className="text-sm font-semibold   text-gray-300 group-hover:text-[#FE744D] transition-colors">{userProfile!.name}</span>
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

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-[#262438] rounded-t-2xl shadow-md flex items-center justify-around p-2 lg:hidden">
        <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-orange-500' : 'text-gray-300'} hover:text-indigo-600`}>
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/chat" className={`flex flex-col items-center ${location.pathname === '/chat' ? 'text-orange-500' : 'text-gray-300'} hover:text-indigo-600`}>
          <MessageSquare className="h-6 w-6" />
          <span className="text-xs">Messages</span>
        </Link>
        <Link to="/communities" className={`flex flex-col items-center ${location.pathname === '/communities' ? 'text-orange-500' : 'text-gray-300'} hover:text-indigo-600`}>
          <Users className="h-6 w-6" />
          <span className="text-xs">Communities</span>
        </Link>
        <Link to="/travel" className={`flex flex-col items-center ${location.pathname === '/travel' ? 'text-orange-500' : 'text-gray-300'} hover:text-indigo-600`}>
          <Plane className="h-6 w-6" />
          <span className="text-xs">Travel</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-orange-500' : 'text-gray-300'} hover:text-indigo-600`}>
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </header>
  );
}
