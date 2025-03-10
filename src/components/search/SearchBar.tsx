import React, { useState, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { search, results, loading } = useSearch();

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts, users, or tags..."
          className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        />
      </div>

      {(results.posts.length > 0 || results.users.length > 0) && query && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg border p-2 z-50">
          {results.users.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Users</h4>
              {results.users.map((user) => (
                <div key={user.id} className="p-2 hover:bg-gray-50 rounded">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-gray-500 ml-2">{user.college}</span>
                </div>
              ))}
            </div>
          )}

          {results.posts.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Posts</h4>
              {results.posts.map((post) => (
                <div key={post.id} className="p-2 hover:bg-gray-50 rounded">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-sm text-gray-500">{post.content.substring(0, 100)}...</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}