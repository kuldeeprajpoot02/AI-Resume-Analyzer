# AI Resume Analyzer & Interview Preparation Platform

An AI-powered Resume Analyzer and Interview Preparation platform built using the MERN stack. The application allows users to upload their resumes, provide a job description and self-description, and generate a personalized interview preparation report using Google Gemini AI.

## 🚀 Features

- User registration and login
- JWT-based authentication
- HTTP-only authentication cookies
- Resume PDF upload
- Resume text extraction
- AI-powered resume and job description analysis
- Resume-job match score
- Technical interview questions
- Behavioral interview questions
- Skill gap analysis
- Personalized 7-day preparation roadmap
- Interview report storage using MongoDB
- User-specific protected interview reports
- PDF generation

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- SCSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- pdf-parse
- Puppeteer

### AI
- Google Gemini API
- Structured AI responses
- AI-generated interview preparation reports

## 📂 Project Structure

```text
Mern_Project-main/
├── BACKEND/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── FRONTEND/
│   ├── src/
│   │   ├── features/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## ⚙️ Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/kuldeeprajpoot02/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

### 2. Install backend dependencies

```bash
cd BACKEND
npm install
```

Create a `.env` file in the `BACKEND` directory and configure the required environment variables.

### 3. Install frontend dependencies

Open another terminal:

```bash
cd FRONTEND
npm install
```

### 4. Configure environment variables

Add your MongoDB connection string, Google Gemini API key, authentication secrets, and other required settings to the appropriate `.env` files. Never commit real credentials to GitHub.

### 5. Run the application

Start the backend and frontend using the development scripts defined in their respective `package.json` files.

Make sure the required environment variables are configured before starting the application.

## 👨‍💻 Author

**Kuldeep Rajpoot**