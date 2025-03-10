import React, { useState } from 'react';
import { User } from '../../types';
import { updateProfile } from '../../lib/appwrite/users';
import { GitHubSection } from './GitHubSection';

interface ProfileFormProps {
  user: User;
  onCancel: () => void;
}

export function ProfileForm({ user, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    id:user.id,
    name: user.name,
    college: user.college || '',
    bio: user.bio || '',
    skills: user.skills?.join(', ') || '',
    githubUrl: user.githubUrl || '',
    linkedinUrl: user.linkedinUrl || '',
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
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
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
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>

          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-700">
              College
            </label>
            <input
              type="text"
              id="college"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
              placeholder="React, TypeScript, Node.js"
            />
          </div>

          <div>
            <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">
              LinkedIn URL
            </label>
            <input
              type="url"
              id="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      <GitHubSection />
    </div>
  );
}