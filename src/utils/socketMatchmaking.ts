import { roomManager, User } from "./roomManager";

// Queue to store users waiting to be matched
const queue: User[] = [];

export const handleMatchmaking = (socket: any, io: any) => {
    // Handle user joining the matchmaking queue
    socket.on("join-queue", (user: User) => {
        console.log(`User ${user.id} joined queue with interests: ${user.interests.join(', ')} and mode: ${user.mode}`);
        
        // Update the user's socketId to ensure it's current
        user.socketId = socket.id;
        
        // Find a match based on mode (random or interest-based)
        let match: User | undefined;
        
        if (user.mode === 'random') {
            // For random mode, match with any available user
            match = queue.length > 0 ? queue[0] : undefined;
        } else if (user.mode === 'interest') {
            // For interest mode, find a user with at least one matching interest
            match = queue.find(queuedUser => 
                queuedUser.mode === 'interest' && 
                queuedUser.interests.some(interest => 
                    user.interests.includes(interest)
                )
            );
        }
        
        if (match) {
            console.log(`Match found for user ${user.id} with user ${match.id}`);
            
            // Create a room for the matched users
            const roomId = roomManager.createRoom(user, match);
            
            // Join both users to the room
            socket.join(roomId);
            const matchSocket = io.sockets.sockets.get(match.socketId);
            if (matchSocket) {
                matchSocket.join(roomId);
            }
            
            // Notify both users of the match
            io.to(match.socketId).emit("matched", { 
                roomId, 
                matchedUser: { id: user.id, interests: user.interests } 
            });
            
            io.to(socket.id).emit("matched", { 
                roomId, 
                matchedUser: { id: match.id, interests: match.interests } 
            });
            
            // Remove matched user from the queue
            const matchIndex = queue.findIndex(u => u.socketId === match!.socketId);
            if (matchIndex !== -1) {
                queue.splice(matchIndex, 1);
            }
            
            console.log(`Users ${user.id} and ${match.id} removed from queue. Queue length: ${queue.length}`);
        } else {
            // If no match, add user to queue
            queue.push(user);
            
            // Notify user they're in queue
            socket.emit("queued", { 
                position: queue.length,
                message: "Waiting for a match..." 
            });
            
            console.log(`User ${user.id} added to queue. Queue length: ${queue.length}`);
        }
        console.log(`Current queue length: ${queue.length}`); // Log the current queue length
    });
    
    // Handle user canceling the matchmaking
    socket.on("leave-queue", () => {
        const index = queue.findIndex(u => u.socketId === socket.id);
        if (index !== -1) {
            const user = queue[index];
            console.log(`User ${user.id} left the queue`);
            queue.splice(index, 1);
            socket.emit("queue-left", { message: "You have left the queue" });
            console.log(`Current queue length after leaving: ${queue.length}`); // Log the current queue length after leaving
        }
    });
    
    // Handle chat messages within a room
    socket.on("send-message", ({ roomId, message }) => {
        console.log(`Message in room ${roomId}: ${message.text}`);
        // Broadcast the message to everyone in the room except the sender
        socket.to(roomId).emit("receive-message", message);
    });
    
    // Handle user disconnection
    socket.on("disconnect", () => {
        // Remove user from queue if they're in it
        const queueIndex = queue.findIndex(u => u.socketId === socket.id);
        if (queueIndex !== -1) {
            const user = queue[queueIndex];
            console.log(`User ${user.id} disconnected while in queue`);
            queue.splice(queueIndex, 1);
            console.log(`Current queue length after disconnection: ${queue.length}`); // Log the current queue length after disconnection
        }
        
        // Notify room partners if user was in a chat
        const room = roomManager.getRoomByUser(socket.id);
        if (room) {
            console.log(`User disconnected from room ${room.id} in mm.ts`);
            // Notify other users in the room
            socket.to(room.id).emit("user-disconnected", { 
                message: "Your chat partner has disconnected" 
            });
            // Clean up the room
            roomManager.removeRoom(room.id);
        }
    });
};