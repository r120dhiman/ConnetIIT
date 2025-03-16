import { ID, OAuthProvider, Query} from 'appwrite';
import { account, COLLECTIONS, databases } from './config';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

function generateUniqueId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString(); // Generates 8-digit number
}

export async function signUp(email: string, password: string, name: string) {
  try {
    // Create account
    const user = await account.create(ID.unique(), email, password, name);
    
    // Important: Create session immediately after signup
    await account.createEmailPasswordSession(email, password);

    const randomId = generateUniqueId();
    
    // Create User document
    const userDoc = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      user.$id,
      {
        id: user.$id,
        name, 
        email,
        password,
        isOnBoarded: false,
        anonymousId: randomId
      }
    );

    return {
      user: user,
      userDoc: userDoc
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    await account.createEmailPasswordSession(email, password);  
    return account.get();
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// export async function onboarding(gender: string, interests: string, friendId: string) {
//   try {
//     const user = await account.get();
//    console.log(user);
//    const interestsArray = interests.split(',');
//    const friendIdArray = friendId.split(',');


//     const userOnBoarded = await databases.updateDocument(
//       DATABASE_ID,
//       COLLECTIONS.USERS,
//       user.$id,
//       {isOnBoarded: true, gender:gender, interests:interestsArray, friendsId:friendIdArray}
//     );
//     return userOnBoarded;
    
//   } catch (error) {
//     console.error('Onboarding error:', error);
//     throw error;
//   }
// }

export async function onboarding(gender: string, interests: string, friendId: string) {
  try {
    const user = await account.get();
    const interestsArray = interests.split(',');
    const friendIdArray = friendId.split(',');

    // Onboard the user
    const userOnBoarded = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      user.$id,
      {
        isOnBoarded: true,
        gender: gender,
        interests: interestsArray,
        friendsId: friendIdArray
      }
    );

    // Add the user to respective communities
    await Promise.all(
      interestsArray.map(async (interest) => {
        const communities = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.COMMUNITIES,
          [Query.equal('name', interest)]
        );

        if (communities.total > 0) {
          // Community exists: Add user to it
          const community = communities.documents[0];
          const updatedMembers = Array.isArray(community.membersList)
            ? [...new Set([...community.membersList, user.$id])]
            : [user.$id];

          await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.COMMUNITIES,
            community.$id,
            { membersList: updatedMembers }
          );

        } else {
          // Community doesn't exist: Create a new one
          await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.COMMUNITIES,
            ID.unique(),
            {
              name: interest,
              membersList: [user.$id],
              msgLogs: []  // Initialize with an empty array for consistency
            }
          );
        }
      })
    );

    return userOnBoarded;

  } catch (error) {
    console.error('Onboarding error:', error);
    throw error;
  }
}


export async function onboardingverification(){
  try {
    const user = await account.get();
    const existingUser = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      user.$id
    );
    return existingUser.isOnBoarded;
  } catch (error) {
    console.error('Onboarding error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function isAuthenticated() {
  try {
    const user = await account.get();
    return !!user;
  } catch {
    return false;
  }
}


export async function signInWithGoogle() {
  try {
    const redirectUrl = `${window.location.origin}/`;
    const res = await account.createOAuth2Session(
      OAuthProvider.Google,
      redirectUrl,
      `${window.location.origin}/sign-in`
    );
    console.log("res", res);
    
  } catch (error) {
    console.error('Google auth error:', error);
    throw error;
  }
}