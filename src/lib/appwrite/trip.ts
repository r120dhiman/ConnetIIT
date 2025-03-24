import { ID, Query } from 'appwrite';
import { databases } from './config';
import { COLLECTIONS } from './config';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export async function createTrip(tripData: {
  tripName: string;
  description: string;
  from: string;
  to: string;
  date: Date;
  isFlexibleDate: boolean;
  createdBy: string;
  modeOfTravel: string;
}) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.TRIPS,
      ID.unique(),
      tripData
    );
    // console.log("Trip created successfully:", response);
    return response;
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
}

export async function getTrip(tripId:string) {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.TRIPS,
      tripId // You can adjust the query as needed
    );
    // console.log("Trips retrieved successfully:", response);
    return response // Return the array of trips
  } catch (error) {
    console.error('Error retrieving trips:', error);
    throw error;
  }
}
export async function getTrips() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TRIPS,
      [Query.orderDesc('$createdAt')] // You can adjust the query as needed
    );
    // console.log("Trips retrieved successfully:", response);
    return response.documents; // Return the array of trips
  } catch (error) {
    console.error('Error retrieving trips:', error);
    throw error;
  }
}

export async function addParticipantToTrip(tripId: string, participantIds: string[]) {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.TRIPS,
      tripId,
      {
        participants: participantIds // Assuming participants is an array in the trip document
      }
    );
    console.log("Participant added successfully:", response);
    return response;
  } catch (error) {
    console.error('Error adding participant to trip:', error);
    throw error;
  }
}
