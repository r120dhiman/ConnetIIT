import mongoose, { Document, Schema } from 'mongoose';  

// Anonymous Chat Schema  
interface IAnonymousChat extends Document {  
  senderId: string;  
  receiverId: string;  
  chatlogs: string[];  
  status: 'active' | 'inactive' | 'archived';  
}  

const anonymousChatSchema: Schema = new Schema({  
  senderId: { type: String, required: true },  
  receiverId: { type: String, required: true },  
  chatlogs: { type: [String], default: [] },  
  status: { type: String, enum: ['active', 'inactive', 'archived'], required: true },  
}, { timestamps: true });  

const AnonymousChat = mongoose.model<IAnonymousChat>('AnonymousChat', anonymousChatSchema);  


// Challenges Schema  
interface IChallenges extends Document {  
  title: string;  
  description: string;  
  points: number;  
  deadline: Date;  
  participants: string[];  
  status: 'pending' | 'in-progress' | 'completed';  
}  

const challengesSchema: Schema = new Schema({  
  title: { type: String, required: true },  
  description: { type: String, required: true },  
  points: { type: Number, required: true },  
  deadline: { type: Date, required: true },  
  participants: { type: [String], default: [] },  
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },  
});  

const Challenges = mongoose.model<IChallenges>('Challenges', challengesSchema);  


// Comment Schema  
interface IComment extends Document {  
  postId: string;  
  userId: string;  
  content: string;  
  likes: number;  
  parentId?: string | null;  
  username?: string | null;  
}  

const commentSchema: Schema = new Schema({  
  postId: { type: String, required: true },  
  userId: { type: String, required: true },  
  content: { type: String, required: true },  
  likes: { type: Number, default: 0 },  
  parentId: { type: String, default: null },  
  username: { type: String, default: null },  
}, { timestamps: true });  

const Comment = mongoose.model<IComment>('Comment', commentSchema);  


// Communities Schema  
interface ICommunities extends Document {  
  name: string;  
  membersList: string[];  
  msgLogs: string[];  
  posts: string[];  
}  

const communitiesSchema: Schema = new Schema({  
  name: { type: String, required: true },  
  membersList: { type: [String], default: [] },  
  msgLogs: { type: [String], default: [] },  
  posts: { type: [String], default: [] },  
}, { timestamps: true });  

const Communities = mongoose.model<ICommunities>('Communities', communitiesSchema);  


// Message Schema  
interface IMessage extends Document {  
  senderId: string;  
  receiverId: string;  
  content: string;  
  isRead: boolean;  
}  

const messageSchema: Schema = new Schema({  
  senderId: { type: String, required: true },  
  receiverId: { type: String, required: true },  
  content: { type: String, required: true },  
  isRead: { type: Boolean, default: false },  
}, { timestamps: true });  

const Message = mongoose.model<IMessage>('Message', messageSchema);  


// New Post Schema  
interface INewPost extends Document {  
  userId: string;  
  title: string;  
  content: string;  
  tags: string[];  
  githubUrl?: string;  
  likes: number;  
  comments: string[];  
}  

const newPostSchema: Schema = new Schema({  
  userId: { type: String, required: true },  
  title: { type: String, required: true },  
  content: { type: String, required: true },  
  tags: { type: [String], default: [] },  
  githubUrl: { type: String, default: '' },  
  likes: { type: Number, default: 0 },  
  comments: { type: [String], default: [] },  
}, { timestamps: true });  

const NewPost = mongoose.model<INewPost>('NewPost', newPostSchema);  


// All Post Schema  
interface IAllPost extends Document {  
  userId: string;  
  title: string;  
  content: string;  
  tags: string[];  
  likes: number;  
  githubUrl?: string;  
}  

const allPostSchema: Schema = new Schema({  
  userId: { type: String, required: true },  
  title: { type: String, required: true },  
  content: { type: String, required: true },  
  tags: { type: [String], default: [] },  
  likes: { type: Number, default: 0 },  
  githubUrl: { type: String, default: '' },  
}, { timestamps: true });  

const AllPost = mongoose.model<IAllPost>('AllPost', allPostSchema);  


// Queue Schema  
interface IQueue extends Document {  
  userId: string;  
  interests: string[];  
  mode: 'mode1' | 'mode2' | 'mode3';  
  timestamp: Date;  
  status: 'active' | 'inactive' | 'pending';  
}  

const queueSchema: Schema = new Schema({  
  userId: { type: String, required: true },  
  interests: { type: [String], default: [] },  
  mode: { type: String, enum: ['mode1', 'mode2', 'mode3'], required: true },  
  timestamp: { type: Date, default: Date.now },  
  status: { type: String, enum: ['active', 'inactive', 'pending'], required: true },  
}, { timestamps: true });  

const Queue = mongoose.model<IQueue>('Queue', queueSchema);  


// Room Chat Schema  
interface IRoomChat extends Document {  
  roomId: string;  
  content: string;  
  senderId: string;  
}  

const roomChatSchema: Schema = new Schema({  
  roomId: { type: String, required: true },  
  content: { type: String, required: true },  
  senderId: { type: String, required: true },  
}, { timestamps: true });  

const RoomChat = mongoose.model<IRoomChat>('RoomChat', roomChatSchema);  


// Total Room Schema  
interface ITotalRoom extends Document {  
  roomId: string;  
  createdBy: string;  
  members: string[];  
  lastMessage: string[];  
  isActive: boolean;  
}  

const totalRoomSchema: Schema = new Schema({  
  roomId: { type: String, required: true },  
  createdBy: { type: String, required: true },  
  members: { type: [String], default: [] },  
  lastMessage: { type: [String], default: [] },  
  isActive: { type: Boolean, default: false },  
}, { timestamps: true });  

const TotalRoom = mongoose.model<ITotalRoom>('TotalRoom', totalRoomSchema);  


// Trip Schema  
interface ITrip extends Document {  
  createdBy: string;  
  to: string;  
  date: Date;  
  participants: string[];  
  description: string;  
  tripName: string;  
  from: string;  
  isFlexibleDate: boolean;  
  modeOfTravel?: string;  
  msgLogs: string[];  
}  

const tripSchema: Schema = new Schema({  
  createdBy: { type: String, required: true },  
  to: { type: String, required: true },  
  date: { type: Date, required: true },  
  participants: { type: [String], default: [] },  
  description: { type: String, required: true },  
  tripName: { type: String, required: true },  
  from: { type: String, required: true },  
  isFlexibleDate: { type: Boolean, default: false },  
  modeOfTravel: { type: String, required: false },  
  msgLogs: { type: [String], default: [] },  
}, { timestamps: true });  

const Trip = mongoose.model<ITrip>('Trip', tripSchema);  


// User Schema  
interface IUser extends Document {  
  email: string;  
  name: string;  
  password?: string;  
  isOnBoarded: boolean;  
  gender?: string;  
  anonymousId?: string;  
  interests: string[];  
  friendsId: string[];  
  id?: string;  
  msgLogs: string[];  
  profileUrl: string;  
  isOnline: boolean;  
  lastSeen?: string;  
  bio?: string;  
  college?: string;  
  postsLiked: string[];  
}  

const userSchema: Schema = new Schema({  
  email: { type: String, required: true },  
  name: { type: String, required: true },  
  password: { type: String, required: false },  
  isOnBoarded: { type: Boolean, default: false },  
  gender: { type: String, required: false },  
  anonymousId: { type: String, required: false },  
  interests: { type: [String], default: [] },  
  friendsId: { type: [String], default: [] },  
  id: { type: String, required: false },  
  msgLogs: { type: [String], default: [] },  
  profileUrl: { type: String, default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png' },  
  isOnline: { type: Boolean, default: false },  
  lastSeen: { type: String, required: false },  
  bio: { type: String, required: false },  
  college: { type: String, required: false },  
  postsLiked: { type: [String], default: [] },  
}, { timestamps: true });  

const User = mongoose.model<IUser>('User', userSchema);  

export {  
  AnonymousChat,  
  Challenges,  
  Comment,  
  Communities,  
  Message,  
  NewPost,  
  AllPost,  
  Queue,  
  RoomChat,  
  TotalRoom,  
  Trip,  
  User
};  