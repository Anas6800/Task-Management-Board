# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "task-management-board"
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In the Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 3: Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select Web (</>) icon
4. Register your app with a nickname
5. Copy the Firebase configuration object

## Step 5: Update Firebase Config

Replace the placeholder values in `src/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## Step 6: Set Up Security Rules

Go to Firestore Database → Rules and replace with:

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

## Step 7: Test Your Setup

1. Run `npm start` in your project directory
2. Open http://localhost:3000
3. Try creating an account
4. Create a board and add some tasks
5. Test drag-and-drop functionality

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Double-check your API key in firebase.ts

2. **"Missing or insufficient permissions"**
   - Verify your Firestore security rules are correct

3. **"Firebase: Error (auth/email-already-in-use)"**
   - This is normal - the email is already registered

4. **Drag and drop not working**
   - Make sure you're using a modern browser
   - Check browser console for errors

### Need Help?

- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review the [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks) documentation
- Check the browser console for detailed error messages
