# NoteKaro 📝

A modern, full-stack note-taking application built with React, TypeScript, and Node.js. Create, edit, and manage your notes with a clean, intuitive interface.

## ✨ Features

- **User Authentication**: Secure signup/signin with JWT tokens
- **Note Management**: Create, read, update, and delete notes
- **Responsive Design**: Clean UI that works on all devices
- **Real-time Updates**: Instant note synchronization
- **Modern UI**: Built with React Bootstrap and custom styling
- **TypeScript**: Full type safety throughout the application

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **React Bootstrap** - UI components
- **JWT Decode** - Token handling
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **TypeScript** - Type-safe backend development


## 📱 Usage

### Getting Started
1. **Sign Up**: Create a new account with your email and password
2. **Sign In**: Log in to your account
3. **Create Notes**: Click "Create note" to add new notes
4. **Manage Notes**: Edit or delete existing notes using the action buttons

### Features Overview
- **Dashboard**: View all your notes in one place
- **Create Notes**: Add notes with title and content
- **Edit Notes**: Click the edit icon to modify existing notes
- **Delete Notes**: Remove notes you no longer need
- **User Profile**: View your profile information in the welcome section
```
## 🎨 UI Components

- **Clean Dashboard**: Modern interface with gradient welcome card
- **Responsive Forms**: Mobile-friendly authentication forms
- **Interactive Notes**: Easy-to-use note management interface
- **Custom Icons**: SVG icons for edit and delete actions
- **Loading States**: User feedback during API operations

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for secure authentication:
- Tokens are stored in localStorage
- Automatic token validation on protected routes
- Secure logout functionality

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Notes
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## 🚀 Deployment

### Frontend (Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables in your hosting dashboard

### Backend (Render)
1. Push your backend code to your hosting platform
2. Set environment variables
3. Ensure MongoDB connection is configured


**Happy Note Taking! 📝✨**