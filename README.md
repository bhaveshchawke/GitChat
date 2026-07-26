# 🚀 GitChatAI

GitChatAI is an advanced AI-powered SaaS dashboard that allows users to seamlessly ingest GitHub repositories and chat with their codebase. Built with modern web technologies, it features a premium black-and-white dual-tone UI and intelligent backend processing.

---

## ✨ Features
- **Repository Ingestion**: Paste any public GitHub repository URL, and GitChatAI will automatically fetch, process, and chunk the codebase.
- **AI Codebase Chat**: Ask complex questions about the architecture, logic, or functions within the repository.
- **Premium UI/UX**: A sleek, dark-themed interface built for developers, featuring smooth animations and a responsive design.
- **Monorepo Architecture**: Clean separation between the React Frontend and Node.js Backend.

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS (or Custom CSS), Lucide-React Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB.
- **AI Processing**: LangChain, OpenAI / Google Gemini APIs.

---

## 💻 Local Setup Instructions

### Prerequisites
Make sure you have **Node.js** and **npm** installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/bhaveshchawke/GitChat.git
cd GitChat
```

### 2. Setup the Backend
Open a terminal and navigate to the Backend folder:
```bash
cd Backend
npm install
```
Create a `.env` file inside the `Backend` directory and add your API keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_or_gemini_key
GITHUB_TOKEN=your_github_personal_access_token
```
Start the backend server:
```bash
npm start
```

### 3. Setup the Frontend
Open a new terminal and navigate to the Frontend folder:
```bash
cd Frontend
npm install
```
Create a `.env` file inside the `Frontend` directory (optional for local, but good for reference):
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

---

## 🌐 Deployment Guide

### Option 1: Frontend on Vercel, Backend on Koyeb (Recommended)
Because repository ingestion involves downloading and processing files, the backend requires a longer execution time than Vercel's standard 10-second serverless limit.
1. **Backend**: Host the `Backend` folder on [Koyeb](https://www.koyeb.com/) or [Render](https://render.com/). Add your `.env` variables there.
2. **Frontend**: Host the `Frontend` folder on [Vercel](https://vercel.com/). Add the `VITE_API_URL` environment variable pointing to your deployed backend URL (e.g., `https://your-backend.onrender.com/api`).

### Option 2: Both on Vercel (For smaller repositories)
1. Deploy the `Frontend` folder as a project on Vercel.
2. Deploy the `Backend` folder as a separate project on Vercel (the provided `vercel.json` will handle serverless routing and increase `maxDuration` to 60 seconds).
3. Connect the Frontend to the Backend by setting the `VITE_API_URL` in the Frontend project's Vercel settings.

---

## 👨‍💻 Developer
Developed by **Bhavesh Chawke**
- 📸 [Instagram](https://www.instagram.com/bhaavesh.dev/)
- 🔗 [LinkedIn](https://www.linkedin.com/in/bhavesh-chawke-607785317/?isSelfProfile=true)
- 📧 [Email](mailto:bhaveshchawke4321@gmail.com)
