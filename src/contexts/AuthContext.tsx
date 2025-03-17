import { createContext, useContext, useEffect, useState } from 'react';
import { Models } from 'appwrite';
import { getCurrentUser, onboarding } from '../lib/appwrite/auth';
import { COLLECTIONS, databases } from '../lib/appwrite/config';
import { useNavigate } from 'react-router';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  userProfile: Models.Document | null;
  loading: boolean;
  handleOnboarding: (gender: string, interests: string, friendId: string) => Promise<void>; // Add the onboarding function type
}

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  handleOnboarding: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [userProfile, setUserProfile] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        console.log(currentUser,"cureent useer");
        

        if (currentUser) {
          const profile = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            currentUser.$id
          );
          setUserProfile(profile);
           // Redirect to /onboarding if userProfile.isOnBoarded is false
           if (!profile.isOnBoarded) {
            navigate('/onboarding') // Redirect to onboarding page
            return; // Ensure no further code is executed
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [navigate]);

  const handleOnboarding = async (gender: string, interests: string, friendId: string) => {
    try {
      await onboarding(gender, interests, friendId); // Call the onboarding function
      // Refresh the user profile after onboarding
      if (user) {
        const updatedProfile = await databases.getDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          user.$id
        );
        setUserProfile(updatedProfile); // Update the context with the new profile
      }
    } catch (error) {
      console.error('Error during onboarding:', error);
    }
  };

  console.log("user", user);
  console.log("userProfile", userProfile);
  

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, handleOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
