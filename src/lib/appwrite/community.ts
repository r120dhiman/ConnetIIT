import { ID, Query } from 'appwrite';
import { DATABASE_ID, databases } from "./config";
import { COLLECTIONS } from "./config";

export async function addMember(communityId, userId) {
  await databases.createDocument(
    DATABASE_ID,  // Replace with your database ID
    COLLECTIONS.COMMUNITY_MEMBERS,  // Replace with your collection ID
    ID.unique(),
    {
      communityId: communityId,
      userId: userId,
    }
  );
}


export async function removeMember(communityId, userId) {
    const response = await databases.listDocuments(
        DATABASE_ID,  // Replace with your database ID
        COLLECTIONS.COMMUNITY_MEMBERS,
      [
        Query.equal("communityId", communityId),
        Query.equal("userId", userId)
      ]
    );
  
    if (response.documents.length > 0) {
      await databases.deleteDocument(
        DATABASE_ID,  // Replace with your database ID
        COLLECTIONS.COMMUNITY_MEMBERS,
        response.documents[0].$id
      );
    }
  }

  export async function getCommunityMembers(communityId) {
    const response = await databases.listDocuments(
        DATABASE_ID,  // Replace with your database ID
        COLLECTIONS.COMMUNITY_MEMBERS,
      [
        Query.equal("communityId", communityId)
      ]
    );
  
    return response.documents;  // List of members
  }
  
  
