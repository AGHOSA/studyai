# 🎓 StudyAI Platform

> An AI-powered study platform built for students — summarize notes, solve doubts, generate quizzes, and plan your study schedule.

---

## 🌐 Live Demo

| Part | Platform |
|------|----------|
| Frontend | Deployed on Vercel |
| Backend API | Deployed on Render |

---

## ✨ Features

- 📝 **Note Summarizer** — Paste your notes and get a clean summary instantly
- 📄 **PDF Upload** — Upload PDF files and summarize them (Pro only)
- 🤖 **Doubt Solver** — Chat with AI to clear your doubts
- 📊 **Quiz Generator** — Auto-generate MCQ quizzes from your notes
- 📅 **Study Planner** — Get a personalized study plan
- 🔐 **Auth System** — Signup/Login with JWT

---

## 💰 Freemium Model

| Feature | Free | Pro (₹99/mo) |
|---------|------|--------------|
| AI calls/day | 3 | Unlimited |
| PDF upload | ❌ | ✅ |
| Chat history | Last 10 msgs | Full history |
| Notes & Quiz | Unlimited | Unlimited |
| Priority support | ❌ | ✅ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + React Router |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (free cloud) |
| AI | Groq AI (llama-3.3-70b-versatile) |
| Auth | JWT |
| File Upload | Multer + pdf-parse |

---

## 🚀 Deployment

| Part | Platform |
|------|----------|
| Frontend | Vercel (free forever) |
| Backend | Render (free tier) |
| Database | MongoDB Atlas (free 512MB) |

---

## 📁 Project Structure
studyai/
├── backend/
│   ├── models/         # MongoDB schemas (User, Note, Quiz, Chat)
│   ├── routes/         # API routes (auth, ai, notes, quiz, planner)
│   ├── middleware/     # JWT auth + Pro check
│   ├── server.js       # Express entry point
│   └── .env.example    # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── pages/      # Dashboard, Summarizer, ChatBot, Quiz, Planner
│   │   ├── components/ # Sidebar + Navbar
│   │   ├── context/    # AuthContext (global user state)
│   │   └── utils/      # Axios API calls
│   └── vercel.json
├── render.yaml
└── README.md

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- Git
- MongoDB (local) or MongoDB Atlas
- Groq API key (free at console.groq.com)

### Step 1 — Clone the repo
```bash
git clone https://github.com/AGHOSA/studyai.git
cd studyai
```

### Step 2 — Backend setup
```bash
cd backend
cp .env.example .env
npm install
```

Fill in `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri_here
JWT_SECRET=any_long_random_string
GROQ_API_KEY=your_groq_api_key_here
CLIENT_URL=http://localhost:3000
```

### Step 3 — Frontend setup
```bash
cd ../frontend
cp .env.example .env
npm install
```

Fill in `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4 — Run
```bash
# Terminal 1 - Backend
cd backend && node server.js

# Terminal 2 - Frontend
cd frontend && npm start
```

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get logged in user |

### AI
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai/summarize` | Summarize text notes |
| POST | `/api/ai/summarize-pdf` | Upload and summarize PDF |
| POST | `/api/ai/chat` | Doubt solver chat |
| POST | `/api/ai/generate-quiz` | Generate MCQ quiz |
| POST | `/api/ai/study-plan` | Generate study plan |

### Notes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/:id` | Get single note |
| PATCH | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### Quiz
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/quiz` | Save a quiz |
| POST | `/api/quiz/:id/submit` | Submit quiz score |
| GET | `/api/quiz` | Get quiz history |

---

## ⚠️ Common Issues

| Problem | Fix |
|---------|-----|
| MongoDB connection failed | Check your MONGODB_URI in .env |
| Groq AI not working | Check your GROQ_API_KEY in .env |
| Port already in use | Kill the process or change PORT in .env |
| Frontend not connecting | Check REACT_APP_API_URL in frontend/.env |

---

## ✅ What's Built

- [x] JWT Auth (signup/login)
- [x] AI Note Summarizer
- [x] PDF Upload + Parse
- [x] Doubt Solver Chatbot
- [x] Quiz Generator + Scoring
- [x] Study Planner
- [x] Freemium credit system
- [x] Fully deployed on cloud (free)

---

## 📄 License

MIT License — free to use and modify.

---

Built with ❤️ for Indian students.