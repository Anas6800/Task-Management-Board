# Task Management Board (Kanban)

A modern, responsive Kanban board application built with React, TypeScript, Firebase, and Tailwind CSS.

## Features

- **Authentication**: Email/password signup and login
- **Board Management**: Create, view, and delete boards
- **Task Management**: Create, edit, delete, and drag-and-drop tasks
- **Real-time Updates**: Live updates across devices using Firebase
- **Responsive Design**: Works on desktop and mobile devices
- **Priority Levels**: High, medium, and low priority tasks
- **Due Dates**: Set and track task deadlines
- **Status Tracking**: To Do, In Progress, and Done columns

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Drag & Drop**: @dnd-kit (React 19 compatible)
- **Routing**: React Router DOM

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Copy your Firebase config and update `src/firebase.ts`

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 4. Firebase Security Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Boards collection
    match /boards/{boardId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── Board/
│   │   ├── KanbanBoard.tsx
│   │   ├── Column.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskModal.tsx
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── BoardCard.tsx
│   │   └── CreateBoardModal.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── types/
│   └── Task.ts
├── firebase.ts
└── App.tsx
```

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Create Board**: Click "Create New Board" to add a new project board
3. **Add Tasks**: Click "Add Task" to create tasks with title, description, priority, and due date
4. **Drag & Drop**: Move tasks between columns (To Do → In Progress → Done)
5. **Edit Tasks**: Click "Edit" on any task to modify its details
6. **Delete**: Remove tasks or boards as needed

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init hosting
```

4. Build and deploy:
```bash
npm run build
firebase deploy
```

## Development Roadmap

- [ ] User profile management
- [ ] Task search and filtering
- [ ] Team collaboration features
- [ ] Task templates
- [ ] Export/import functionality
- [ ] Mobile app (React Native)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details