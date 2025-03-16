export interface User {
  id: string;
  socketId: string;
  interests: string[];
  mode: 'interest' | 'random';
}

export interface Room {
  id: string;
  users: string[];
  createdAt: Date;
}

class RoomManager {
  private rooms: Map<string, Room> = new Map();
  
  // Create a new room for two users
  createRoom(user1: User, user2: User): string {
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      this.rooms.set(roomId, { 
          id: roomId, 
          users: [user1.socketId, user2.socketId],
          createdAt: new Date()
      });
      
      console.log(`Room created: ${roomId} for users ${user1.id} and ${user2.id}`);
      console.log(`Total rooms: ${this.rooms.size}`); // Log total room count
      return roomId;
  }
  
  // Find a room by socket ID
  getRoomByUser(socketId: string): Room | undefined {
      for (const room of this.rooms.values()) {
          if (room.users.includes(socketId)) {
              return room;
          }
      }
      return undefined;
  }
  
  // Get all users in a room
  getUsersInRoom(roomId: string): string[] {
      const room = this.rooms.get(roomId);
      return room ? room.users : [];
  }
  
  // Remove a room
  removeRoom(roomId: string): boolean {
      console.log(`Removing room: ${roomId}`);
      const result = this.rooms.delete(roomId);
      console.log(`Total rooms: ${this.rooms.size}`); // Log total room count after removal
      return result;
  }
  
  // Clean up inactive rooms (optional, could be called periodically)
  cleanupInactiveRooms(maxAgeMinutes: number = 60): void {
      const now = new Date();
      for (const [roomId, room] of this.rooms.entries()) {
          const ageMinutes = (now.getTime() - room.createdAt.getTime()) / 60000;
          if (ageMinutes > maxAgeMinutes) {
              console.log(`Cleaning up inactive room: ${roomId}`);
              this.rooms.delete(roomId);
              console.log(`Total rooms: ${this.rooms.size}`); // Log total room count after cleanup
          }
      }
  }
}

export const roomManager = new RoomManager();