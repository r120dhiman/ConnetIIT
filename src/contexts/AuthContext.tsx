import { createContext, useContext, useEffect, useState } from 'react';
import { Models } from 'appwrite';
import { getCurrentUser } from '../lib/appwrite/auth';
import { COLLECTIONS, databases } from '../lib/appwrite/config';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  userProfile: Models.Document | null;
  loading: boolean;
}

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [userProfile, setUserProfile] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const profile = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            currentUser.$id
          );
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // console.log("user", user);
  // console.log("userProfile", userProfile);
  

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
