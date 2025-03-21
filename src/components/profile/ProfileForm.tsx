import React, { useState } from 'react';
import { User } from '../../types';
import { updateProfile } from '../../lib/appwrite/users';
import { GitHubSection } from './GitHubSection';
import { profile } from 'console';

interface ProfileFormProps {
  user: User;
  onCancel: () => void;
}

export function ProfileForm({ user, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    id: user.id,
    name: user.name,
    email: user.email,
    college: user.college || '',
    interests: user.interests.join(', ') || '',
    bio: user.bio || '',
    gender: user.gender || 'Prefer not to say', // Add default gender
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateProfile({
        ...formData,
        interests: formData.interests.split(',').map(skill => skill.trim()).filter(Boolean),
      });
      onCancel();
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-[#262438] rounded-lg shadow-md p-6" style={{ color: 'white' }}>
        {error && (
          <div className="mb-4 bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 px-3 py-1 block w-full rounded-xl border-gray-300 bg-[#1B1730] text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-300">
              College
            </label>
            <input
              type="text"
              id="college"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="mt-1 block px-3 py-1  w-full rounded-xl border-gray-300 bg-[#1B1730] text-white"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="mt-1 px-3 py-1  block w-full rounded-xl border-gray-300 bg-[#1B1730] text-white"
            />
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-300">
              Interests (comma-separated)
            </label>
            <input
              type="text"
              id="skills"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              className="mt-1 px-3 py-1  block w-full rounded-xl border-gray-300 bg-[#1B1730] text-white"
              placeholder="React, TypeScript, Node.js"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-md rounded-3xl text-[#FE744D] bg-[#392639]   hover:bg-[#FE744D] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-md rounded-3xl text-[#FE744D] bg-[#392639]   hover:bg-[#FE744D] hover:text-white"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      {/* <GitHubSection /> */}
    </div>
  );
}