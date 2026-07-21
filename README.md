# Community Event Management System

A simple full-stack MERN application for creating, browsing, searching, and managing community events.

## Features
- User authentication with JWT
- Event creation, editing, deletion, and browsing
- Search and filter events
- Event registration and cancellation
- Dashboard and profile management
- Responsive UI with Tailwind CSS

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express.js, Mongoose, JWT
- Database: MongoDB Atlas

## Folder Structure
- client/ - React frontend
- server/ - Express backend

## Local Setup
```bash
npm install
npm run install:all
```

Create a `.env` file in the server folder using `.env.example` as a template.

Run locally:
```bash
npm run dev
```

## Deployment Guide
### Backend (Render)
1. Create a new Web Service from the server folder.
2. Set environment variables:
   - PORT
   - MONGO_URI
   - JWT_SECRET
   - CLIENT_URL
3. Deploy.

### Frontend (Vercel)
1. Import the client folder into Vercel.
2. Set environment variable:
   - VITE_API_URL = your backend URL
3. Deploy.

### MongoDB Atlas
1. Create a MongoDB Atlas cluster.
2. Get the connection string.
3. Use it as `MONGO_URI`.
