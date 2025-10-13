<p align="center">
  <img src="https://github.com/user-attachments/assets/f4d7f82f-8d6e-4392-a01e-ff99e1c6bad7" alt="MusIQ Logo" width="400"/>
</p>

<p align="center">
  <b>MusIQ — A Full-Stack Real-Time Multiplayer Music Guessing Game</b> <br/>
  Compete with friends, guess songs, and use AI-powered hints!
</p>

---

## 🎵 Overview

**MusIQ** is a full-stack real-time multiplayer music guessing game where players compete to identify songs as quickly as possible.  
It integrates **Spotify**, **YouTube**, and **AI-powered hints** for a dynamic and engaging experience.  

Players can join rooms, chat, and earn points in real time — all within a modern, responsive web app.

---

## 🚀 Features

- 🎧 **Spotify Playlist Integration** – Source songs from Spotify playlists  
- ▶️ **YouTube Audio Streaming** – Stream tracks directly from YouTube  
- 🤖 **AI-Powered Hints** – Get hints powered by Gemini/OpenAI  
- ⚡ **Real-Time Guessing & Chat** – Powered by Socket.IO  
- 🔍 **Typo-Tolerant Matching** – Implemented via Fuse.js  
- 🔐 **Secure Authentication** – Using Firebase Authentication  
- 💻 **Modern Frontend Stack** – Built with React + Vite + Tailwind CSS  
- 🏆 **Live Leaderboard** – Real-time score tracking  
- 🌐 **Scalable Backend** – Node.js, Express.js, MongoDB Atlas  

---

## 🧠 Tech Stack

### **Frontend**
- React + Vite  
- Tailwind CSS  
- Firebase Authentication  
- Socket.IO Client  

### **Backend**
- Node.js + Express.js  
- MongoDB (Mongoose)  
- Firebase Admin SDK  
- Socket.IO Server  
- Spotify API + YouTube API  
- Gemini API (AI hints)  
- Bruno (API testing)  

---

## ☁️ Deployment

| Component | Default Port | Suggested Hosting |
|------------|--------------|-------------------|
| Frontend   | 5173         | Vercel / Netlify / Local |
| Backend    | 5000         | Render / Railway / Local |
| Database   | —            | MongoDB Atlas / Local |

---

## 🛠️ Local Development

### **1️⃣ Prerequisites**
- Node.js 18+ and npm (or yarn/pnpm)
- MongoDB (local or Atlas)
- Firebase project (for authentication)
- Optional (recommended):
  - Spotify API credentials  
  - YouTube API key  
  - Gemini/OpenAI key  

---

### **2️⃣ Clone the Repository**
```bash
git clone <your-fork-or-repo-url>
cd MusIQ
