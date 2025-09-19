# FSAB Notes

Simple note-taking app Final deliverable.

## Tech Stack
- **Frontend**: NextJS + React
- **Backend**: Express.js
- **Database**: Firebase Firestore

## How to Run

### 1. Start Backend
```bash
cd backend
node index.js
```
Backend runs on http://localhost:8080

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000 (or 3001/3002 if 3000 is busy)

### 3. Open Browser
Go to http://localhost:3000 (or whatever port the frontend shows)

## Features
- Add notes with title and content
- View all notes
- Delete notes
- Data stored in Firebase

## Setup
1. Install dependencies: `npm install` in both folders
2. Set up Firebase project and add credentials to `backend/.env`
3. Run both servers
4. Open browser
