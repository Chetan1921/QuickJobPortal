<div align="center">

# 🚀 QuickJob

### A modern, microservices-powered job portal connecting recruiters and job seekers — with AI built in.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-6366f1?style=for-the-badge&logo=vercel)](https://quick-job-portal-84t8tlfdy-chetan-sharmas-projects-c54422e2.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Kafka](https://img.shields.io/badge/Kafka-Event--Driven-231F20?style=flat-square&logo=apachekafka&logoColor=white)](https://kafka.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)

[Live Demo](https://quick-job-portal-84t8tlfdy-chetan-sharmas-projects-c54422e2.vercel.app/) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📖 Overview

QuickJob is a full-stack job portal built on a **microservices architecture**, designed the way a production job board actually works — separate services for auth, user profiles, job/application management, and AI-powered career tools, all talking to a React frontend through clean REST APIs.

Recruiters can create companies, post jobs, and manage applicants through a real hiring pipeline. Job seekers can search and filter jobs, apply with one click, track every application's status, and get AI-generated career guidance and resume ATS scoring — all in one place.

---

## ✨ Features

### For Job Seekers
- 🔍 Search and filter jobs by title, location, job type, and work mode
- 📄 One-click apply with resume tracking
- 📊 Track application status in real time (Submitted → Shortlisted → Hired/Rejected)
- 🧠 **AI Career Guidance** — personalized role recommendations and a learning roadmap based on your skills
- 📈 **AI Resume Analyzer** — ATS score with a category breakdown (formatting, keywords, structure, readability) and prioritized improvement suggestions
- 👤 Full profile management — skills, resume, profile picture, bio

### For Recruiters
- 🏢 Create and manage company profiles
- 📋 Post and update job listings
- 👥 Review applicants per job and update their status
- 📬 Automatic email notifications to candidates on status changes
- 📊 Hiring pipeline dashboard with live stats

### Platform-wide
- 🔐 JWT-based authentication with role-based access (job seeker / recruiter)
- 🌗 Light & dark theme, fully responsive across mobile, tablet, and desktop
- ⚡ Event-driven email delivery via Kafka — notifications never block the main request flow
- 🎨 Polished, glassmorphic UI built with Tailwind CSS

---

## 🏗️ Architecture

QuickJob is split into independent services, each with its own database connection and responsibility — frontend talks to each service directly over REST, authenticated with a shared JWT.

```
                              ┌─────────────────────┐
                              │   React Frontend     │
                              │  (Vite + Redux RTK)  │
                              └───────────┬───────────┘
                                          │
                     ┌────────────────────┼────────────────────┐
                     │                    │                    │
              ┌──────▼──────┐     ┌───────▼───────┐    ┌───────▼───────┐
              │ Auth Service │     │ User Service  │    │  Job Service  │
              │  (JWT, login)│     │ (profile,     │    │ (jobs, apps,  │
              │              │     │  skills,      │    │  companies)   │
              │              │     │  resume)      │    │               │
              └──────┬──────┘     └───────┬───────┘    └───────┬───────┘
                     │                    │                    │
                     └────────────────────┼────────────────────┘
                                          │
                                  ┌───────▼────────┐
                                  │   PostgreSQL    │
                                  │    (NeonDB)     │
                                  └─────────────────┘

              ┌──────────────┐                      ┌──────────────────┐
              │  AI Service   │                      │   Mail Service    │
              │ (career guide,│                      │  (Kafka consumer, │
              │  resume ATS)  │                      │  email delivery)  │
              │  Redis cache  │                      └─────────▲─────────┘
              │  Azure OpenAI │                                │
              └──────────────┘                         Kafka topic
                                                    (application status
                                                          updates)
```

**Why microservices?** Each domain — auth, user data, job/application logic, AI features — scales and fails independently. A spike in resume-analysis traffic doesn't touch login latency. An email backlog doesn't block a recruiter from updating an application status, because that write goes straight to Postgres while the notification is dropped onto a Kafka topic for the Mail service to pick up asynchronously.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Redux Toolkit, Tailwind CSS v4, React Router, React Hook Form + Zod |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL (NeonDB serverless) |
| **Caching** | Redis (AI response caching, 24h TTL) |
| **AI** | Azure OpenAI (GPT-4o-mini) |
| **Messaging** | Apache Kafka (event-driven email notifications) |
| **Auth** | JWT (JSON Web Tokens) |
| **File Uploads** | Multer + Cloud Storage |
| **Deployment** | Vercel (frontend), Render (backend services) |

---

## 📦 Microservices

| Service | Responsibility | Port |
|---|---|---|
| **Auth Service** | Registration, login, password reset, JWT issuance | `5000` |
| **User Service** | Profile, skills, resume & profile picture uploads | `8001` |
| **Job Service** | Companies, jobs, applications, status updates | `5003` |
| **AI Service** | Career guidance, resume ATS analysis | `5004` |
| **Mail Service** | Kafka consumer — sends transactional emails | internal |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- Running instances of the backend microservices (Auth, User, Job, and optionally AI)

### Frontend Setup

```bash
git clone https://github.com/Chetan1921/<your-repo-name>.git
cd job-portal-frontend
npm install
```

Create a `.env` file in the project root:

```env
VITE_AUTH_SERVICE_URL=http://localhost:8000
VITE_USER_SERVICE_URL=http://localhost:8001
VITE_JOB_SERVICE_URL=http://localhost:8002
VITE_AI_SERVICE_URL=http://localhost:5004
```

Run the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

---

## 📂 Project Structure

```
src/
├── app/                 # Top-level route definitions
├── components/
│   ├── ui/               # Reusable primitives (Button, Input, Badge, Skeleton...)
│   ├── cards/             # JobCard, StatCard, ScoreBar
│   └── layout/            # Navbar, Sidebar, Footer, layout shells
├── features/
│   ├── auth/              # Login, Register, password reset
│   ├── users/              # Profile management
│   ├── jobs/               # Job search, details, recruiter job management
│   ├── companies/          # Company CRUD, company overview
│   ├── applications/       # Application tracking & status management
│   └── ai/                 # Career Guidance & Resume Analyzer
├── services/axios/       # Per-microservice Axios instances + interceptors
├── store/                # Redux Toolkit store
├── schemas/              # Zod validation schemas
└── providers/            # Theme provider (light/dark mode)
```

---

## 🔐 Authentication Flow

1. User registers or logs in via the **Auth Service**, which issues a JWT
2. Token is stored in Redux + `localStorage` and persisted across sessions
3. An Axios request interceptor attaches `Authorization: Bearer <token>` to every outgoing request across all microservices
4. A response interceptor catches `401`/`403` globally, logs the user out, and redirects to `/login` — no manual error handling needed in individual components

---

## 🌐 Live Demo

**[quick-job-portal-84t8tlfdy-chetan-sharmas-projects-c54422e2.vercel.app](https://quick-job-portal-84t8tlfdy-chetan-sharmas-projects-c54422e2.vercel.app/)**

> Backend services are hosted on Render's free tier, which spins down after periods of inactivity — the first request after idle time may take 30–60 seconds while the service cold-starts.

---

## 🗺️ Roadmap

- [ ] Real-time notifications (WebSocket) for application status changes
- [ ] Recruiter analytics dashboard with hiring funnel charts
- [ ] Saved jobs / job alerts for job seekers
- [ ] In-app messaging between recruiters and candidates
- [ ] Bulk resume screening via AI Service

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](../../issues).

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Chetan Sharma**
Full-Stack Software Engineer

- 📍 Mathura, Uttar Pradesh, India
- 📧 [chetan.sharma200104022@gmail.com](mailto:chetan.sharma200104022@gmail.com)
- 💼 [LinkedIn](https://linkedin.com/in/chetan-sharma10)
- 💻 [GitHub](https://github.com/Chetan1921)
- 🌐 [Portfolio](https://v0-resume-analysis-xi-six.vercel.app/)

<div align="center">

If you found this project interesting, consider giving it a ⭐

</div>
