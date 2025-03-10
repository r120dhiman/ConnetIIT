import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProfileCard } from '../components/profile/ProfileCard';
import { Header } from '../components/layout/Header';
import { Pencil } from 'lucide-react';
import { ProfileForm } from '../components/profile/ProfileForm';

export function Profile() {
  const { user, userProfile } = useAuth();  // Extracting userProfile from context
  const [isEditing, setIsEditing] = useState(false);

  if (!user || !userProfile) {  // Checking if both user and userProfile are available
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
        <Header/>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <Pencil className="h-4 w-4" />
          {isEditing ? 'View Profile' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <ProfileForm user={userProfile} onCancel={() => setIsEditing(false)} />
      ) : (
        <ProfileCard user={userProfile} />
      )}
    </div>
  );
}
