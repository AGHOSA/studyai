# 🎓 StudyAI Platform

> An AI-powered study platform built for students — summarize notes, solve doubts, generate quizzes, and plan your study schedule.

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
| Database | MongoDB (Railway hosted) |
| AI | Groq AI (llama-3.3-70b-versatile) |
| Auth | JWT |
| File Upload | Multer + pdf-parse |

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
└── package.json

---

## ⚙️ Local Setup (Run on your PC)

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or Railway MongoDB
- A [Groq](https://console.groq.com/) API key (free)

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/AGHOSA/studyai.git
cd studyai
```

### Step 2 — Install dependencies

```bash
npm install
npm run install:all
```

### Step 3 — Setup Backend environment

```bash
cd backend
cp .env.example .env
```

Now open `backend/.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studyai
JWT_SECRET=any_long_random_string_here
GROQ_API_KEY=gsk_your_groq_key_here
CLIENT_URL=http://localhost:3000
```

> ⚠️ Never share your `.env` file or push it to GitHub!

### Step 4 — Setup Frontend environment

```bash
cd frontend
cp .env.example .env
```

Open `frontend/.env` and add:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5 — Start MongoDB locally

Make sure MongoDB is running on your PC:

```bash
mongod
```

### Step 6 — Run the app

```bash
cd ..
npm run dev
```

- 🌐 Frontend → http://localhost:3000
- ⚙️ Backend → http://localhost:5000
- ✅ Health check → http://localhost:5000/api/health

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get logged in user info |

### AI (requires login + credits)
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
| MongoDB connection failed | Make sure `mongod` is running locally or check Railway MongoDB URL |
| Groq AI not working | Check your `GROQ_API_KEY` in `.env` — get a free key at console.groq.com |
| Port already in use | Kill the process using that port or change `PORT` in `.env` |
| Frontend not connecting | Make sure `REACT_APP_API_URL` is correct in `frontend/.env` |

---

## ✅ What's Built

- [x] JWT Auth (signup/login)
- [x] AI Note Summarizer
- [x] PDF Upload + Parse
- [x] Doubt Solver Chatbot
- [x] Quiz Generator + Scoring
- [x] Study Planner
- [x] Freemium credit system

---

## 🚀 Deployment

| Part | Platform |
|------|----------|
| Frontend | Vercel (free) |
| Backend | Railway (free) |
| Database | Railway MongoDB (free) |

---

## 📄 License

MIT License — free to use and modify.

---

Built with ❤️ for Indian students.