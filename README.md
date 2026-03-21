# ISTQB QA MCQ Exam Platform

A modern full-stack web application for an ISTQB QA MCQ exam platform using React, Tailwind CSS v4, and Firebase (Firestore + Authentication).

## Features
- **Admin Panel**: Create, edit, and delete exam papers. Protected by Firebase Authentication.
- **Practice Mode**: Immediate feedback on answers with detailed explanations. No timer.
- **Exam Mode**: Simulate real exam conditions with a strict timer, navigation map, and auto-submission.
- **Responsive UI**: Clean, modern, and mobile-friendly interface built with Tailwind CSS.

## Step-by-Step Setup Instructions

### 1. Firebase Project Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** and add the **Email/Password** sign-in method.
3. Enable **Firestore Database**:
   - Start in **Test Mode** (or update security rules as shown below).
   - Create a user in the Authentication tab to use as your Admin account.

### 2. Firestore Security Rules
Go to the "Rules" tab in Firestore and paste the following to allow public reading of papers but restrict writing to authenticated admins:

```ruby
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /papers/{paper} {
      // Anyone can read papers to take exams
      allow read: if true;
      // Only authenticated users (Admins) can modify papers
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Local Environment Variables
Create a `.env` file in the root of the project (`QuizAPP` folder) and add your Firebase config keys:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Locally
Install dependencies and start the Vite development server:
```bash
npm install
npm run dev
```

### 5. Deployment to Vercel
This single-codebase React App is ready for Vercel.
1. Push this repository to GitHub.
2. Log in to [Vercel](https://vercel.com/) and "Add New Project" from your GitHub repo.
3. In the Vercel project configuration, add all the `VITE_FIREBASE_*` environment variables.
4. Click **Deploy**.

## Example Firestore Data Structure
The platform dynamically creates this structure inside Firestore when the Admin saves a paper.
```json
{
  "title": "Foundation Level Mock 1",
  "description": "Standard 40 question mock exam",
  "timeLimit": 60,
  "questions": [
    {
      "questionText": "What is the main objective of testing?",
      "options": [
        "To find defects",
        "To prevent defects",
        "To execute code",
        "To debug"
      ],
      "correctAnswerIndex": 0,
      "explanation": "Testing is primarily executed to find defects, while QA is meant to prevent them."
    }
  ]
}
```
