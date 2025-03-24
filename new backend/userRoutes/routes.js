// const mongoose = require("mongoose");


// const anonymouschatSchema = new mongoose.Schema({  
//     senderId: {  
//       type: String,  
//       required: true,  
//     },  
//     receiverId: {  
//       type: String,  
//       required: true,  
//     },  
//     chatlogs: {  
//       type: [String], // Array of strings for chat messages  
//       default: [], // Default to an empty array  
//     },  
//     status: {  
//       type: String,  
//       enum: ['active', 'inactive', 'archived'], // Replace with actual enum values  
//       required: true,  
//     }  
//   }, {  
//     timestamps: true // Automatically add createdAt and updatedAt fields  
//   });  
  
//   const anonymousChat = mongoose.model('anonymousChat', anonymouschatSchema);


// const challengesSchema = new mongoose.Schema({  
//     title: {  
//         type: String,  
//         required: true  
//     },  
//     description: {  
//         type: String,  
//         required: true  
//     },  
//     points: {  
//         type: Number,  
//         required: true  
//     },  
//     deadline: {  
//         type: Date,  
//         required: true  
//     },  
//     participants: {  
//         type: [String],  // Array of strings  
//         default: []  
//     },  
//     status: {  
//         type: String,  
//         enum: ['pending', 'in-progress', 'completed'], // Example enum values  
//         default: 'pending'  
//     }  
// });  

// const challenges = mongoose.model('challenges', challengesSchema);

// const commentSchema = new mongoose.Schema({  
//     postId: {  
//         type: String,  
//         required: true,  
//     },  
//     userId: {  
//         type: String,  
//         required: true,  
//     },  
//     content: {  
//         type: String,  
//         required: true,  
//     },  
//     likes: {  
//         type: Number,  
//         default: 0,  
//     },  
//     parentId: {  
//         type: String,  
//         default: null,  
//     },  
//     username: {  
//         type: String,  
//         default: null,  
//     },  
// }, { timestamps: true });  

// const comment = mongoose.model('Post', commentSchema); 

// const communitiesSchema = new mongoose.Schema({  
//     name: {  
//         type: String,  
//         required: true,  
//     },  
//     membersList: {  
//         type: [String],  
//         default: [],  
//     },  
//     msgLogs: {  
//         type: [String],  
//         default: [],  
//     },  
//     posts: {  
//         type: [String],  
//         default: [],  
//     },  
// }, { timestamps: true });  

// const communities = mongoose.model('Group', communitiesSchema); 


// const messageSchema = new mongoose.Schema({  
//     senderId: {  
//       type: String,  
//       required: true,  
//     },  
//     receiverId: {  
//       type: String,  
//       required: true,  
//     },  
//     content: {  
//       type: String,  
//       required: true,  
//     },  
//     isRead: {  
//       type: Boolean,  
//       default: false,  
//     }  
//   }, {  
//     timestamps: true // Automatically add createdAt and updatedAt fields  
//   });  
  
//   const Message = mongoose.model('Message', messageSchema);

//   const newpostSchema = new mongoose.Schema({  
//     userId: {  
//       type: String,  
//       required: true,  
//     },  
//     title: {  
//       type: String,  
//       required: true,  
//     },  
//     content: {  
//       type: String,  
//       required: true,  
//     },  
//     tags: {  
//       type: [String], // Array of strings  
//       default: [],  
//     },  
//     githubUrl: {  
//       type: String,  
//       default: '',  
//     },  
//     likes: {  
//       type: Number,  
//       default: 0,  
//     },  
//     comment: {  
//       type: [String], // Array of strings for comments  
//       default: [],  
//     }  
//   }, {  
//     timestamps: true // Automatically add createdAt and updatedAt fields  
//   });  
  
//   const newPost = mongoose.model('newPost', newpostSchema);

//   const allpostSchema = new mongoose.Schema({  
//     userId: {  
//       type: String,  
//       required: true,  
//     },  
//     title: {  
//       type: String,  
//       required: true,  
//     },  
//     content: {  
//       type: String,  
//       required: true,  
//     },  
//     tags: {  
//       type: [String], // Array of strings  
//       default: [], // Default to an empty array  
//     },  
//     likes: {  
//       type: Number,  
//       default: 0, // Default value for likes  
//     },  
//     githubUrl: {  
//       type: String,  
//       default: '', // Default to an empty string  
//     }  
//   }, {  
//     timestamps: true // Automatically add createdAt and updatedAt fields  
//   });  
  
//   const allPost = mongoose.model('allPost', allpostSchema); 


//   const queueSchema = new mongoose.Schema({  
//     userId: {  
//       type: String,  
//       required: true,  
//     },  
//     interests: {  
//       type: [String], // Array of strings  
//       default: [], // Default to an empty array  
//     },  
//     mode: {  
//       type: String,  
//       enum: ['mode1', 'mode2', 'mode3'], // Replace with actual enum values  
//       required: true,  
//     },  
//     timestamp: {  
//       type: Date,  
//       default: Date.now, // Defaults to current date and time  
//     },  
//     status: {  
//       type: String,  
//       enum: ['active', 'inactive', 'pending'], // Replace with actual enum values  
//       required: true,  
//     }  
//   }, {  
//     timestamps: true // Automatically add createdAt and updatedAt fields  
//   });  
  
//   const queue = mongoose.model('queue', queueSchema);

//   const roomchatSchema = new mongoose.Schema({  
//     roomId: {  
//       type: String,  
//       required: true,  
//     },  
//     content: {  
//       type: String,  
//       required: true,  
//     },  
//     senderId: {  
//       type: String,  
//       required: true,  
//     },  
//     timestamp: {  
//       type: Date,  
//       default: Date.now, // Defaults to current date and time  
//     }  
//   }, {  
//     timestamps: true // Automatically add createdAt and updatedAt fields  
//   });  
  
//   const roomchat = mongoose.model('roomchat', roomchatSchema); 


//   const totalroomSchema = new mongoose.Schema({  
//     roomId: {  
//       type: String,  
//       required: true,  
//     },  
//     createdBy: {  
//       type: String,  
//       required: true,  
//     },  
//     members: {  
//       type: [String], // Array of strings for members  
//       default: [], // Default to an empty array  
//     },  
//     lastMessage: {  
//       type: [String], // Array of strings for messages  
//       default: [], // Default to an empty array  
//     },  
//     isActive: {  
//       type: Boolean,  
//       default: false, // Defaults to false  
//     }  
//   }, {  
//     timestamps: true // Automatically add createdAt and updatedAt fields  
//   });  
  
//   const totalRoom = mongoose.model('totalRoom', totalroomSchema); 

//   const tripSchema = new mongoose.Schema({  
//     createdBy: {  
//       type: String,  
//       required: true,  
//     },  
//     to: {  
//       type: String,  
//       required: true,  
//     },  
//     date: {  
//       type: Date,  
//       required: true,  
//     },  
//     participants: {  
//       type: [String], // Array of strings for participant IDs  
//       default: [], // Default to an empty array  
//     },  
//     description: {  
//       type: String,  
//       required: true,  
//     },  
//     tripName: {  
//       type: String,  
//       required: true,  
//     },  
//     from: {  
//       type: String,  
//       required: true,  
//     },  
//     isFlexibleDate: {  
//       type: Boolean,  
//       default: false, // Defaults to false  
//     },  
//     modeOfTravel: {  
//       type: String,  
//       required: false, // Optional field  
//     },  
//     msgLogs: {  
//       type: [String], // Array of strings for messages or logs  
//       default: [], // Default to an empty array  
//     }  
//   }, {  
//     timestamps: true // Automatically add createdAt and updatedAt fields  
//   });  
  
//   const Trip = mongoose.model('Trip', tripSchema); 


//   const userSchema = new mongoose.Schema({  
//     email: {  
//       type: String,  
//       required: true,  
//     },  
//     name: {  
//       type: String,  
//       required: true,  
//     },  
//     password: {  
//       type: String,  
//       required: false, // Optional for security reasons  
//     },  
//     isOnBoarded: {  
//       type: Boolean,  
//       default: false, // Defaults to false  
//     },  
//     gender: {  
//       type: String,  
//       required: false, // Optional  
//     },  
//     anonymousId: {  
//       type: String,  
//       required: false, // Optional  
//     },  
//     interests: {  
//       type: [String], // Array of strings for interests  
//       default: [], // Default to an empty array  
//     },  
//     friendsId: {  
//       type: [String], // Array of strings for friend IDs  
//       default: [], // Default to an empty array  
//     },  
//     id: {  
//       type: String,  
//       required: false, // Optional  
//     },  
//     msgLogs: {  
//       type: [String], // Array of strings for message logs  
//       default: [], // Default to an empty array  
//     },  
//     profileUrl: {  
//       type: String,  
//       default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png', // Default profile image  
//     },  
//     isOnline: {  
//       type: Boolean,  
//       default: false, // Defaults to false  
//     },  
//     lastSeen: {  
//       type: String,  
//       required: false, // Optional  
//     },  
//     bio: {  
//       type: String,  
//       required: false, // Optional  
//     },  
//     college: {  
//       type: String,  
//       required: false, // Optional  
//     },  
//     postsLiked: {  
//       type: [String], // Array of strings for liked posts  
//       default: [], // Default to an empty array  
//     }  
//   }, {  
//     timestamps: true // Automatically add createdAt and updatedAt fields  
//   });  
  
//   const User = mongoose.model('User', userSchema); 