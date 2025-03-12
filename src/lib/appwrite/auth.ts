import { ID, OAuthProvider} from 'appwrite';
import { account, COLLECTIONS, databases } from './config';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export async function signUp(email: string, password: string, name: string) {
  try {
    // Create account
    const user = await account.create(ID.unique(), email, password, name);
    console.log("account created", user);
    console.log("account created", user.$id);
    
    // Create session
    await account.createEmailPasswordSession(email, password);

    //Create User
    const usercreated = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      user.$id,
      {id:user.$id,name, email,isOnBoarded:false}
    )
    console.log("user created", usercreated);
    
    
    return account.get();
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

export async function onboarding(gender: string, interests: string, friendId: string) {
  try {
    const user = await account.get();
   console.log(user);
   const interestsArray = interests.split(',');
   const friendIdArray = friendId.split(',');


    const userOnBoarded = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      user.$id,
      {isOnBoarded: true, gender:gender, interests:interestsArray, friendsId:friendIdArray}
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