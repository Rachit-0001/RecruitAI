# RecruitAI — AI-Powered Recruitment CRM (MySQL Edition)

A production-style Recruitment CRM backend built with Node.js, Express, MySQL, JWT auth, RBAC,
and Google Gemini for AI features. This is a fresh, standalone build (separate from any
Prisma/Postgres version) using **MySQL + raw SQL (mysql2)**, per the original spec.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL (via `mysql2/promise`, connection pool, raw parameterized SQL — no ORM)
- **Auth:** JWT + bcrypt password hashing
- **Authorization:** Role-Based Access Control (`admin`, `recruiter`)
- **AI:** Google Gemini API (`gemini-2.5-flash`)
- **Frontend (next phase):** React.js, React Router, Axios

## Project Structure

```
recruitai-mysql/
├── backend/
│   ├── config/          # db.js (MySQL pool), gemini.js (AI client)
│   ├── controllers/     # business logic per module
│   ├── middlewares/      # auth, RBAC, validation, error handling
│   ├── models/           # raw SQL data-access layer
│   ├── routes/           # Express routers
│   ├── utils/             # helpers (JWT, async handler, seed script)
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── database/
│   ├── schema.sql        # CREATE TABLE statements
│   └── seed.sql           # reference sample data (see utils/seed.js for real hashed version)
└── README.md
```

## Setup

1. **Create the database**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. **Configure environment**
   ```bash
   cd backend
   cp .env.example .env
   # then edit .env with your MySQL credentials and Gemini API key
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Seed sample data** (creates admin/recruiter users with a real bcrypt hash)
   ```bash
   npm run seed
   ```
   Login credentials after seeding:
   - `admin@recruitai.com` / `Password123`
   - `recruiter@recruitai.com` / `Password123`

5. **Run the server**
   ```bash
   npm run dev     # nodemon, development
   npm start       # production
   ```

   Server runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

## API Overview (15 endpoints)

| Module | Method | Endpoint | Access |
|---|---|---|---|
| Auth | POST | `/api/auth/register` | Public |
| Auth | POST | `/api/auth/login` | Public |
| Auth | GET | `/api/auth/profile` | Authenticated |
| Users | GET | `/api/users` | Admin only |
| Candidates | POST | `/api/candidates` | Admin, Recruiter |
| Candidates | GET | `/api/candidates` | Admin, Recruiter |
| Candidates | GET | `/api/candidates/:id` | Admin, Recruiter |
| Candidates | PUT | `/api/candidates/:id` | Admin, Recruiter |
| Candidates | DELETE | `/api/candidates/:id` | Admin, Recruiter |
| Jobs | POST/GET/GET:id/PUT/DELETE | `/api/jobs...` | Admin, Recruiter |
| Applications | POST/GET/PUT | `/api/applications...` | Admin, Recruiter |
| Interviews | POST/GET | `/api/interviews...` | Admin, Recruiter |
| Dashboard | GET | `/api/dashboard` | Admin, Recruiter |
| AI | POST | `/api/ai/resume-summary` | Admin, Recruiter |
| AI | POST | `/api/ai/job-match` | Admin, Recruiter |
| AI | POST | `/api/ai/interview-questions` | Admin, Recruiter |

All protected routes require `Authorization: Bearer <token>`.

## Deployment

- **Backend:** Render (Web Service) — set env vars from `.env.example` in the Render dashboard,
  use a managed MySQL instance (e.g. Railway, PlanetScale, or Render's own MySQL add-on/external host).
- **Frontend:** Vercel (once the React app is built in the next phase).

## Frontend

React 18 + Vite + Tailwind v4, React Router, Axios, Recharts, lucide-react.

```
frontend/
├── src/
│   ├── components/   # AppLayout (sidebar shell), StageTrack (pipeline visual), ui.jsx (primitives), ProtectedRoute
│   ├── pages/         # Login, Dashboard, Candidates(+Detail), Jobs, Applications, Interviews, AiResumeAnalyzer, Settings
│   ├── services/       # api.js (axios + JWT interceptor), index.js (per-module service calls)
│   ├── context/        # AuthContext (login/register/logout, persisted token)
│   └── index.css       # design tokens (colors, fonts) as Tailwind v4 @theme
```

### Setup

```bash
cd frontend
cp .env.example .env   # set VITE_API_URL if backend isn't on localhost:5000
npm install
npm run dev             # http://localhost:5173
```

### Design

Warm paper background, deep-teal primary with a burnt-sienna accent, Fraunces for display
headings paired with Inter body text and JetBrains Mono for data/timestamps. The signature
element is a small pipeline "stage tracker" (dot-and-line) used on the Applications table to
visualize where each candidate sits in the hiring funnel — applied → shortlisted → interview → selected.

## Status

- [x] Project structure, DB schema, seed data
- [x] Auth module (register/login/profile, JWT, bcrypt)
- [x] RBAC middleware
- [x] Candidates, Jobs, Applications, Interviews modules (full CRUD)
- [x] Dashboard analytics endpoint + charts
- [x] AI module (resume summary, job match, interview questions) via Gemini
- [x] React frontend — all 9 pages, builds clean
- [x] Deployment configs (`render.yaml`, `frontend/vercel.json`) — see `DEPLOYMENT.md` for full steps
