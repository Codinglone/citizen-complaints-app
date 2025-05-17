```
├── README.md
├── .gitignore
├── package.json
├── package-lock.json
├── client/
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── vite-env.d.ts
│   │   ├── components/
│   │   ├── pages/
│   │   └── assets/
│   ├── index.html
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── eslint.config.js
├── server/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── data-source.ts
│   │   ├── entities/
│   │   │   └── User.ts
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── migrations/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── seeds/
│   │   └── utils/
│   └── node_modules/
├── libs/
├── fastapi-ai/
├── .github/
│   └── workflows/
```
---

# README.md

## 🏛️ Citizen Engagement Platform (MVP)

An AI-powered citizen complaint submission and routing system. Citizens can submit feedback, view status updates, and government agencies can respond. AI routes submissions to the right department and performs sentiment analysis.

---

## 📦 Architecture Overview

```
Frontend (React + DaisyUI)
    ⬇️
Backend (Fastify + TypeORM + PostgreSQL)
    ⬇️
AI Layer (FastAPI + Hugging Face API)
```

---

## 🧠 Features

- 📝 Complaint submission + tracking
- 🧠 AI classification & routing (via FastAPI + Hugging Face)
- 📊 Sentiment analysis on submissions
- 📈 Analytics dashboard (charts for admin)
- 🔁 CI/CD using GitHub Actions + Render

---

## 🛠️ Development

Install root dependencies if using workspace tools like `npm workspaces`.

```bash
cd apps/fastify-api
npm install
cd ../react-dashboard
npm install
```

Create `.env` in each app:

### apps/fastify-api/.env
```
DB_URL=postgres://user:password@localhost:5432/db
AI_API_URL=https://your-fastapi-deployment-url/classify
SENTIMENT_API_URL=https://your-fastapi-deployment-url/analyze
```

### apps/fastapi-ai/.env
```
HF_API_KEY=your_huggingface_key
```

---

## ⚙️ GitHub Actions (CI/CD)

`.github/workflows/ci.yml` contains build + deploy steps.
Customize with Render deploy hooks or Railway CLI.

---

## 📊 Analytics Preview

- Bar chart: Complaint count per agency
- Pie chart: Sentiment distribution
- Table: All tickets with status
- Line chart: Submission trends (coming soon)

---

## 🧪 Tech Stack

- **Frontend**: React, DaisyUI, Chart.js / Recharts
- **Backend**: Fastify, TypeORM, PostgreSQL
- **AI**: FastAPI, Hugging Face API (zero-shot & sentiment)
- **CI/CD**: GitHub Actions, Render (free tier)
- **Database**: PostgreSQL

---

## 💡 Future Improvements

- Role-based admin dashboard
- Authentication via Clerk/Auth0
- Email notifications
- Historical analytics

---

Built with ❤️ by Niyokwizerwa Fabrice for civic innovation and government transparency.
