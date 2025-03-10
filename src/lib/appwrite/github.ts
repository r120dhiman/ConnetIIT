import { account } from './config';

export async function linkGitHubAccount() {
  try {
    // Create OAuth session for GitHub
    await account.createOAuth2Session(
      'github',
      'http://localhost:5173/profile', // Success URL
      'http://localhost:5173/profile', // Failure URL
      ['read:user', 'repo'] // Scopes we need
    );
  } catch (error) {
    console.error('Error linking GitHub account:', error);
    throw error;
  }
}

export async function unlinkGitHubAccount() {
  try {
    await account.deleteIdentity('github');
  } catch (error) {
    console.error('Error unlinking GitHub account:', error);
    throw error;
  }
}

export async function isGitHubLinked(): Promise<boolean> {
  try {
    const account = await getCurrentAccount();
    return account.identities?.some(identity => identity.provider === 'github') ?? false;
  } catch (error) {
    return false;
  }
}

async function getCurrentAccount() {
  return await account.get();
}