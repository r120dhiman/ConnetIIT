# ConnectIT Platform

A networking platform exclusively for IIT students and alumni, focusing on project showcasing and skill development.

## Features

1. **Authentication**
   - IIT email domain verification
   - Secure sign-up/login with Appwrite

2. **Profile Dashboard**
   - Skills management
   - Ranking system
   - Project showcase

3. **Posts**
   - Create/edit posts
   - Share GitHub projects
   - Tag system
   - Real-time comments

4. **Real-time Features**
   - Chat system
   - Comment notifications
   - Challenge updates

5. **Challenges**
   - Participate in coding challenges
   - Leaderboard system
   - Points tracking

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Backend**: Appwrite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ installed
- Appwrite Cloud account or self-hosted instance

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd connectit-platform
npm install
```

### 2. Appwrite Setup

1. Create a new project in [Appwrite Console](https://cloud.appwrite.io)
2. Note down your Project ID
3. Create a new Web platform:
   - Register your localhost URL (e.g., http://localhost:5173)

4. Create the following collections:

#### Posts Collection
- Create collection with ID: `posts`
- Attributes:
  ```
  userId (string, required)
  title (string, required)
  content (string, required)
  tags (string[], required)
  githubUrl (string)
  likes (integer, default: 0)
  createdAt (datetime)
  ```
- Indexes:
  - Create index on `tags` (array)
  - Create index on `title` (fulltext)
  - Create index on `userId`

#### Comments Collection
- Create collection with ID: `comments`
- Attributes:
  ```
  postId (string, required)
  userId (string, required)
  content (string, required)
  likes (integer, default: 0)
  parentId (string)
  createdAt (datetime)
  ```
- Indexes:
  - Create index on `postId`
  - Create index on `userId`
  - Create index on `parentId`

#### Challenges Collection
- Create collection with ID: `challenges`
- Attributes:
  ```
  title (string, required)
  description (string, required)
  points (integer, required)
  deadline (datetime, required)
  participants (string[])
  status (string, required) [enum: active, completed]
  ```
- Indexes:
  - Create index on `status`
  - Create index on `participants` (array)

#### Messages Collection
- Create collection with ID: `messages`
- Attributes:
  ```
  senderId (string, required)
  receiverId (string, required)
  content (string, required)
  isRead (boolean, default: false)
  createdAt (datetime)
  ```
- Indexes:
  - Create compound index on `senderId` and `receiverId`
  - Create index on `createdAt`

5. Set up authentication:
   - Go to Auth > Settings
   - Enable Email/Password authentication
   - Configure password settings (min length, etc.)
   - Add `@itbhu.ac.in` to allowed email domains

### 3. Environment Setup

Create a `.env` file in the project root:

```env
VITE_APPWRITE_ENDPOINT=https://auth.connectiit.tech/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
```

### 4. Development

Start the development server:

```bash
npm run dev
```

### 5. Building for Production

```bash
npm run build
```

## Security Features

1. **Authentication**
   - Domain-restricted email signup
   - Secure session management via Appwrite

2. **Data Access**
   - Collection-level security rules
   - User-specific data protection

3. **API Security**
   - Request validation
   - CORS configuration
   - Rate limiting via Appwrite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify email domain is @itbhu.ac.in
   - Check Appwrite project settings
   - Ensure environment variables are set correctly

2. **Real-time Features**
   - Check WebSocket connection
   - Verify collection permissions
   - Check subscription settings

3. **Database Issues**
   - Verify collection structure
   - Check index configurations
   - Ensure proper attribute types

## License

MIT License - see LICENSE file for details