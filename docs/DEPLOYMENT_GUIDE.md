# 🚀 Production Deployment Guide

This guide covers deploying the **AI Code Review Assistant** to modern cloud platforms (Render, Vercel, Railway, or Docker).

---

## Architecture Overview
- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons + Recharts
- **Backend**: Node.js 24 + Express + Native `node:sqlite` + JWT + AST Linters
- **Database**: Zero-dependency SQLite database stored in persistent disk volume.

---

## Option 1: Docker (Single or Multi-Container)

### Build & Run
```bash
# Build production Docker image
docker build -t ai-code-review-assistant .

# Run container with SQLite volume mounted
docker run -d -p 5000:5000 -v ai_data:/app/server/data ai-code-review-assistant
```

---

## Option 2: Render Deployment (Full-Stack or Web Service)

Use the included `render.yaml` Blueprint specification:

1. Push code to your GitHub repository:
   `https://github.com/Saumya-01git/AI-Code-Review-Assistant-Project.git`
2. In Render Dashboard, click **New +** > **Blueprint**.
3. Select your repository.
4. Render will auto-detect `render.yaml` and provision:
   - Web Service with Node.js runtime.
   - Persistent Disk mount at `/app/server/data` to safeguard your SQLite database across restarts.
   - Automatic SSL certificate.

---

## Option 3: Vercel (Frontend) + Render/Railway (Backend)

### Frontend Deployment on Vercel:
1. In Vercel, import your GitHub repository.
2. Set Root Directory to `client`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Environment Variables:
   - `VITE_API_URL`: URL of your deployed backend service.

### Backend Deployment on Railway / Render:
1. Root Directory: `server`.
2. Start Command: `node src/server.js`.
3. Set Environment Variables:
   - `PORT=5000`
   - `JWT_SECRET=production_super_secret_jwt_key`
   - `NODE_ENV=production`

---

## Environment Variables Reference

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `5000` | Port for Express API server |
| `JWT_SECRET` | `ai_code_review_secret_key_2026` | Cryptographic secret for signing JWT tokens |
| `NODE_ENV` | `development` | Set to `production` in production deployment |
| `DATABASE_PATH` | `./data/codereview.db` | Filepath to SQLite database file |
