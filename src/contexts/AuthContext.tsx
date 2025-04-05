import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Models, OAuthProvider, Query } from "appwrite";
import { account, databases } from "../lib/appwrite";
import { addMember } from "../lib/appwrite/community";
// const{ COMMUNITIES} = import.meta.env.VITE_APPWRITE_COMMUNITTIES;


const USER=import.meta.env.VITE_APPWRITE_USERS;
const COMMUNITIES=import.meta.env.VITE_APPWRITE_COMMUNITTIES;
import { ID } from "appwrite";
import { toast } from "react-toastify"; // Import toast
import { isIITEmail } from "../lib/utils";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  userProfile: Models.Document | null;
  loading: boolean;

  signInWithGoogle: () => Promise<void>;
  CreateEmailPasswordSession: (userId: string, secret: string) => Promise<void>;
  signOut: () => Promise<void>;
  handleOnboarding: ( 
    gender: string,
    interests: string,
    friendId: string
  ) => Promise<void>;
}

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  // signIn: async () => {},
  // signUp: async () => {},
  signInWithGoogle: async () => {},
  CreateEmailPasswordSession: async () => {},
  signOut: async () => {},
  handleOnboarding: async () => {},
});

function generateUniqueId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString(); // Generates 8-digit number
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);

  // Add this flag to prevent duplicate calls
  const isAuthenticating = useRef(false);

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await databases.getDocument(
        DATABASE_ID,
        USER,
        userId
      );
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const setIsOnline = async (userId: string) => {
    try {
      const UserProfile = await databases.updateDocument(
        DATABASE_ID,
        USER,
        userId,
        { isOnline: true }
      );
      setUserProfile(UserProfile);
    } catch (error) {
      console.log(error);
    }
  };
  const setIsOffline = async (userId: string) => {
    try {
      const UserProfile = await databases.updateDocument(
        DATABASE_ID,
        USER,
        userId,
        { isOnline: false }
      );
      setUserProfile(UserProfile);
    } catch (error) {
      console.log(error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      // Skip initialization if we're already in the process of authenticating
      if (isAuthenticating.current) {
        return;
      }

      setLoading(true);
      try {
        const currentUser = await account.get();
        setUser(currentUser);

        if (currentUser) {
          await fetchUserProfile(currentUser.$id);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // User is not logged in - clear state
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Sign in function
  // const signIn = async (email: string, password: string) => {
  //   setLoading(true);
  //   console.log("Starting sign-in process..."); // Log for status
  //   // Set flag to prevent useEffect from running redundantly
  //   isAuthenticating.current = true;
  //   try {
  //     console.log("Creating email/password session..."); // Log for status)
  //     await account.createEmailPasswordSession(email, password);
  //     console.log("Session created, fetching current user..."); // Log for status
  //     const currentUser = await account.get();
  //     setUser(currentUser);

  //     // Fetch user profile in the same function
  //     console.log("Fetching user profile..."); // Log for status
  //     const profile = await fetchUserProfile(currentUser.$id);
  //     setIsOnline(profile.$id);
  //     // Handle redirection based on onboarding status
  //     console.log("Sign in successful!"); // Log for status

  //     toast.success("Sign in successful!"); // Add success toast
  //     if (!profile?.isOnBoarded) {
  //       console.log("User not onboarded, redirecting to onboarding..."); // Log for status
  //       window.location.href = "/onboarding";
  //     } else {
  //       console.log("User onboarded, redirecting to home..."); // Log for status
  //       window.location.href = "/";
  //     }
  //   } catch (error) {
  //     console.error("Sign in error:", error);
  //     toast.error("Sign in failed. Please try again."); // Add error toast
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //     console.log("Sign-in process completed."); // Log for status
  //     // Reset flag after authentication process is complete
  //     isAuthenticating.current = false;
  //   }
  // };

  // Sign up function
  // const signUp = async (email: string, password: string, name: string) => {
  //   setLoading(true);
  //   try {
  //     // Create account
  //     const newUser = await account.create(ID.unique(), email, password, name);

  //     // Create session immediately after signup
  //     await account.createEmailPasswordSession(email, password);

  //     // Set user state
  //     setUser(newUser);

  //     const randomId = generateUniqueId();

  //     // Create User document
  //     const userDoc = await databases.createDocument(
  //       DATABASE_ID,
  //       COLLECTIONS.USERS,
  //       newUser.$id,
  //       {
  //         id: newUser.$id,
  //         name,
  //         email,
  //         password,
  //         isOnBoarded: false,
  //         anonymousId: randomId,
  //         isOnline: true,
  //       }
  //     );

  //     setUserProfile(userDoc);

  //     // Always redirect to onboarding for new users
  //     window.location.href = "/onboarding";
  //     toast.success("Sign up successful!"); // Add success toast

  //     return;
  //   } catch (error) {
  //     console.error("Sign up error:", error);
  //     toast.error("Sign up failed. Please try again."); // Add error toast
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const CreateEmailPasswordSession = async (userId: string, secret: string) => {
    try {

      // Create a session using the token
      console.log("creating session...");
      
      await account.createSession(userId, secret);
      console.log("session created!");
      console.log("fetching user...");
      // Fetch user details after Google sign-in
      const user: Models.User<Models.Preferences> = await account.get();
      console.log("User details:", user);

      const email: string = user.email;
      const name = user.name;
      if(!isIITEmail(email)){
        toast.error("Only IIT institute IDs are allowed!")
        return;
      }
      // const secret = user.$id;s

      // Create an email/password session
      // const session = await account.createSession(email, secret);
      // console.log("Email/password session created:", session);

      // Check if user exists in the database
      const query = await databases.listDocuments(
        DATABASE_ID,
        USER,
        [Query.equal("$id", user.$id)]
      );

      console.log("query user", query);

      if (query.documents.length === 0) {
        console.log("creating new user...");
        
        const randomId = generateUniqueId();
        // Create User document
        const userDoc = await databases.createDocument(
          DATABASE_ID,
          USER,
          user.$id,
          {
            id: user.$id,
            name,
            email,
            isOnBoarded: false,
            anonymousId: randomId,
            isOnline: true,
          }
        );

        setUserProfile(userDoc);
        console.log("New user created", userDoc);
        window.location.href = "/onboarding";
      } else {
        console.log("User logged in");
        // Fetch user profile in the same function
        console.log("Fetching user profile..."); // Log for status
        const profile = await fetchUserProfile(user.$id);
        setIsOnline(profile!.$id);
        // Handle redirection based on onboarding status
        console.log("Sign in successful!"); // Log for status

        toast.success("Sign in successful!"); // Add success toast
        if (!profile?.isOnBoarded) {
          console.log("User not onboarded, redirecting to onboarding..."); // Log for status
          window.location.href = "/onboarding";
        } else {
          console.log("User onboarded, redirecting to home..."); // Log for status
          window.location.href = "/";
        }
      }
    } catch (error) {
      console.error("Error creating email/password session:", error);
    }
  };

  // GAuth
  async function signInWithGoogle() {
    try {
      console.log("gauth initializing");
      console.log("Google auth initializing");
    const baseUrl = window.location.origin;
    
    // Use createOAuth2Token instead of createOAuth2Session
     await account.createOAuth2Token(
      OAuthProvider.Google,
      `${baseUrl}/callback`,
      `${baseUrl}/sign-in?error=auth_failed`
    );
    
      // console.log("res", res);
    } catch (error) {
      console.error("Google auth error:", error);
      throw error;
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      setIsOffline(userProfile!.$id);
      await account.deleteSession("current");
      setUser(null);
      setUserProfile(null);
      window.location.href = "/sign-in";
      toast.success("Sign out successful!"); // Add success toast
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Sign out failed. Please try again."); // Add error toast
      throw error;
    }
  };

  // Onboarding function
  const handleOnboarding = async (
    gender: string,
    interests: string,
    friendId: string
  ) => {
    try {
      console.log("🚀 Onboarding started...");

      if (!user) throw new Error("User not authenticated");

      console.log("✅ User authenticated:", user.$id);

      const interestsArray = interests.split(",");
      const friendIdArray = friendId.split(",");

      console.log("📌 Parsed interests:", interestsArray);
      console.log("📌 Parsed friend IDs:", friendIdArray);

      // Update user profile with onboarding info
      console.log("📝 Updating user profile...");
      const updatedProfile = await databases.updateDocument(
        DATABASE_ID,
        USER,
        user.$id,
        {
          isOnBoarded: true,
          gender: gender,
          interests: interestsArray,
          friendsId: friendIdArray,
        }
      );

      console.log("✅ User profile updated:", updatedProfile);
      setUserProfile(updatedProfile);

      // Process community memberships
      console.log("🔄 Processing community memberships...");
      await Promise.all(
        interestsArray.map(async (interest) => {
          console.log(`🔍 Checking community for interest: ${interest}`);
          const communities = await databases.listDocuments(
            DATABASE_ID,
            COMMUNITIES,
            [Query.equal("name", interest)]
          );

          if (communities.total > 0) {
            console.log(`✅ Community found for ${interest}:`, communities.documents[0]);

            // Community exists: Add user to it
            const community = communities.documents[0];
            await addMember(community.$id, user.$id);
            console.log(`👥 User added to existing community: ${community.$id}`);

            // Fetch the latest membersCount
            const res = await databases.getDocument(DATABASE_ID, COMMUNITIES, community.$id);
            console.log(`📊 Current members count: ${res.members}`);

            const newCount = (res.members || 0) + 1;
            await databases.updateDocument(DATABASE_ID, COMMUNITIES, community.$id, {
                members: newCount,
            });

            console.log(`✅ Updated members count for ${community.$id}: ${newCount}`);
          } else {
            console.log(`❌ No community found for ${interest}, creating a new one...`);
            
            const newCommunityId = ID.unique();
            await databases.createDocument(
              DATABASE_ID,
              COMMUNITIES,
              newCommunityId,
              {
                name: interest,
                members: 1, // New community starts with 1 member
              }
            );

            console.log(`✅ New community created: ${newCommunityId}`);

            // Add the user to the new community
            await addMember(newCommunityId, user.$id);
            console.log(`👥 User added to new community: ${newCommunityId}`);
          }
        })
      );

      console.log("🎉 Onboarding process completed!");
      // Redirect to home page after successful onboarding
      window.location.href = "/";
      toast.success("Onboarding completed successfully!");
    } catch (error) {
      console.error("❌ Onboarding error:", error);
      window.location.href = "/";
      toast.error("Onboarding failed. Please try again.");
      throw error;
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        // signIn,
        // signUp,
        signOut,
        signInWithGoogle,
        handleOnboarding,
        CreateEmailPasswordSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
