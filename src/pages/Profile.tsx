import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProfileCard } from '../components/profile/ProfileCard';
import { Header } from '../components/layout/Header';
import { Pencil, User, Loader } from 'lucide-react';
import { ProfileForm } from '../components/profile/ProfileForm';
import { LoadingScreen } from '../components/shared/LoadingScreen';

export function Profile() {
  const { user, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user || !userProfile) {
    return <LoadingScreen message="Loading your profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 text-sm">
                  {isEditing ? 'Edit your profile information' : 'View and manage your profile'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg
                hover:bg-primary/90 transition-colors duration-200 
                active:transform active:scale-95"
            >
              <Pencil className="h-4 w-4" />
              {isEditing ? 'View Profile' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            {isEditing ? (
              <div className="max-w-2xl mx-auto">
                <ProfileForm user={userProfile} onCancel={() => setIsEditing(false)} />
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <ProfileCard user={userProfile} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
