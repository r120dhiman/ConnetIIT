import React, { useState, useEffect } from 'react';
import { Github } from 'lucide-react';
import { linkGitHubAccount, unlinkGitHubAccount, isGitHubLinked } from '../../lib/appwrite/github';
import Loader from '../../components/shared/Loader';

export function GitHubSection() {
  const [linked, setLinked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkGitHubStatus();
  }, []);

  const checkGitHubStatus = async () => {
    try {
      const status = await isGitHubLinked();
      setLinked(status);
    } catch (error) {
      console.error('Error checking GitHub status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async () => {
    try {
      await linkGitHubAccount();
      // The page will redirect to GitHub for auth
    } catch (error) {
      console.error('Error linking GitHub:', error);
    }
  };

  const handleUnlink = async () => {
    try {
      await unlinkGitHubAccount();
      setLinked(false);
    } catch (error) {
      console.error('Error unlinking GitHub:', error);
    }
  };

  if (loading) {
    return <Loader size="small" message="Loading GitHub status..." showFacts={false} />;
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Github className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">GitHub Integration</h3>
            <p className="text-sm text-gray-600">
              {linked 
                ? 'Your GitHub account is connected' 
                : 'Connect your GitHub account to showcase your repositories'}
            </p>
          </div>
        </div>
        
        <button
          onClick={linked ? handleUnlink : handleLink}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            linked
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {linked ? 'Unlink GitHub' : 'Link GitHub'}
        </button>
      </div>
    </div>
  );
}