import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createPost } from '../../lib/appwrite/posts';

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
  onCancel?: () => void;
}

export function CreatePost({ onPostCreated, onCancel }: CreatePostProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError('');

    try {
      const newPost = await createPost({
        userId: user.$id,
        title,
        content,
        githubUrl: githubUrl || undefined,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      });

      // Reset form
      setTitle('');
      setContent('');
      setGithubUrl('');
      setTags('');

      // Notify parent component
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#262438] rounded-lg shadow-md p-6 mb-6">
      {error && (
        <div className="mb-4 bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full  border-gray-300  bg-[#56517e] shadow-sm rounded-2xl focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-white">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-2xl bg-[#56517e] border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-white">
            GitHub URL (optional)
          </label>
          <input
            type="url"
            id="githubUrl"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="mt-1 block w-full rounded-2xl bg-[#56517e] border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-white">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="React, TypeScript, Frontend"
            className="mt-1 block w-full rounded-2xl bg-[#56517e] border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-[#392639] text-[#FE744D] rounded-3xl hover:bg-[#FE744D] hover:text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}