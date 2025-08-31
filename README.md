# NoteKaro 📝

A modern, full-stack note-taking application built with React, TypeScript, and Node.js.  
Create, edit, and manage your notes with a clean, intuitive interface.

---

![Stars](https://img.shields.io/github/stars/therajeshyadav/Notes-Karo?style=social)
![Forks](https://img.shields.io/github/forks/therajeshyadav/Notes-Karo?style=social)
![Issues](https://img.shields.io/github/issues/therajeshyadav/Notes-Karo)
![Pull Requests](https://img.shields.io/github/issues-pr/therajeshyadav/Notes-Karo)
![Last Commit](https://img.shields.io/github/last-commit/therajeshyadav/Notes-Karo)
![Build](https://img.shields.io/github/actions/workflow/status/therajeshyadav/Notes-Karo/nodejs.yml?branch=main)

---

## ✨ Features

- 🔐 **User Authentication** – Secure signup/signin with JWT  
- 📝 **Note Management** – Create, read, update, and delete notes  
- 📱 **Responsive Design** – Works seamlessly on desktop & mobile  
- ⚡ **Real-time Updates** – Instant note synchronization  
- 🎨 **Modern UI** – React Bootstrap + Tailwind styling  
- ✅ **TypeScript** – Full type safety on frontend & backend  

---

## 🚀 Tech Stack

### Frontend
- React 18 + TypeScript  
- Vite (fast dev/build)  
- React Router  
- React Bootstrap + Tailwind CSS  
- JWT Decode  

### Backend
- Node.js + Express.js  
- MongoDB (Mongoose)  
- JWT (Authentication)  
- TypeScript  

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)  
- npm or yarn  
- MongoDB (local or Atlas)  
- (Optional) Google OAuth and SMTP if you plan to extend auth

---

### Clone the Project
```bash
# Clone repository
git clone https://github.com/therajeshyadav/notekaro.git

# Navigate into project
cd notekaro

🔹 Frontend Setup
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev

🔹 Backend Setup
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start backend server
npm run dev

🔧 Environment Variables
🌐 Frontend (.env)
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id

⚙️ Backend (backend/.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notekaro
JWT_SECRET=your-secret-key
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email/OTP Sending
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
️ If using Gmail, generate an App Password (required when 2FA is enabled).

🏃‍♂️ Running the Application

Start Backend

cd backend
npm run dev


Start Frontend

npm run dev


Open → http://localhost:3000
```

📱 Usage
```
Sign Up → Register with email/password or Google

Sign In → Login with email/password, Google, or OTP

Create Notes → Add notes with title & content

Edit/Delete Notes → Manage existing notes

Profile Dashboard → View your account info
```
📸 Screenshots
```

![Signin Page](https://github.com/therajeshyadav/Notes-Karo/raw/main/Signinpage.jpg)
![Signup Page](https://github.com/therajeshyadav/Notes-Karo/raw/main/Signup%20Page.jpg)
![Dashboard Page](https://github.com/therajeshyadav/Notes-Karo/raw/main/DashBoard%20page.jpg)

```
Note Detail / OTP (if added later)
```
🌍 Live Demo
```
Try it live here: https://notes-karo.vercel.app/
```

🌐 API Endpoints
```
Authentication
POST /auth/signup → User registration

POST /auth/signin → User login

POST /auth/signout → Logout

Notes
GET /notes → Fetch all notes

POST /notes → Create a note

PUT /notes/:id → Update a note

DELETE /notes/:id → Delete a note
```

🤝 Contributing
```
Contributions are welcome!

Fork this repo

Create a branch: git checkout -b feature/your-feature

Commit your changes

Push branch & open a PR

🙏 Acknowledgments
Frontend: React, Vite, Tailwind, React Bootstrap

Backend: Node.js, Express, MongoDB

Deployment: Frontend Vercel  and Backend Render

Support Libraries: JWT, etc.
```
Happy Note Taking with NoteKaro! 📝✨
