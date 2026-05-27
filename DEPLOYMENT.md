# Deploying RKLAF (Legal Aid) — Vercel + Render

This project has two parts:

| Part | Host | Why |
|------|------|-----|
| **Frontend** (React + Vite) | [Vercel](https://vercel.com) | Fast CDN, free tier, great for SPAs |
| **Backend** (Express + MongoDB) | [Render](https://render.com) or [Railway](https://railway.app) | Node API; data in MongoDB Atlas; uploads still on server disk |

Vercel alone cannot run this Express API — the API must live elsewhere. Set **MONGODB_URI** on the API host (e.g. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier).

---

## 1. Deploy the backend (Render)

### Option A — Blueprint (recommended)

1. Push `legal-aid/` to GitHub (see [Git setup](#git-setup) below).
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
3. Connect the repo; Render reads `render.yaml` and creates **legal-aid-api**.
4. Set **FRONTEND_URL** after you have your Vercel URL, e.g. `https://your-project.vercel.app`
5. Set **MONGODB_URI** (Atlas connection string) and optional env vars from `backend/.env.example` (Razorpay, SMTP).
6. Wait for deploy; copy the service URL, e.g. `https://legal-aid-api.onrender.com`.

### Option B — Manual web service

1. **New** → **Web Service** → connect repo.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Environment variables:**
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `FRONTEND_URL` = your Vercel site URL (set after step 2)
   - `JWT_SECRET` = long random string
   - `PORT` is set automatically by Render

6. Open `https://<your-service>.onrender.com/api/health` — should return `{"status":"ok",...}`.

### First-time admin

1. Visit `https://your-vercel-app.vercel.app/admin/setup` and create the super admin.
2. Or use invite flow from `/admin/users` after login.

> **Note:** Content lives in **MongoDB** (required). Uploaded images/PDFs still use the server `uploads/` folder — on free tiers that folder can reset on redeploy; use S3 or similar for production file storage if needed.

---

## 2. Deploy the frontend (Vercel)

### Option A — Vercel website (easiest)

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → **Import** your repository.
3. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` ← important
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables** (Production + Preview):

   | Name | Value |
   |------|--------|
   | `VITE_API_BASE_URL` | `https://legal-aid-api.onrender.com/api` (your Render URL + `/api`) |

5. Click **Deploy**.

6. In Render, set **FRONTEND_URL** to your Vercel URL (e.g. `https://rklaf.vercel.app`) and redeploy the API so CORS allows the site.

### Option B — Vercel CLI

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local: VITE_API_BASE_URL=https://your-api.onrender.com/api

npm i -g vercel
vercel login
vercel          # first deploy (follow prompts)
vercel --prod   # production
```

Set `VITE_API_BASE_URL` in the Vercel dashboard for production, or add it when prompted.

`frontend/vercel.json` already configures SPA routing so React Router paths (`/about`, `/our-work/impact`, `/admin`, etc.) work on refresh.

---

## 3. Git setup

If `legal-aid` is not its own repo yet:

```bash
cd /Users/kapil/Documents/legal-aid
git init
git add .
git commit -m "Initial commit: RKLAF site"
git branch -M main
git remote add origin https://github.com/YOUR_USER/legal-aid.git
git push -u origin main
```

Use that repo for both Vercel and Render.

---

## 4. Checklist after deploy

- [ ] `https://your-app.vercel.app` loads the homepage
- [ ] `https://your-api.onrender.com/api/health` returns OK
- [ ] Map pins load on **Our Impact** (proves API + `VITE_API_BASE_URL`)
- [ ] `/admin/setup` works once (then use `/admin/login`)
- [ ] **FRONTEND_URL** on Render matches the exact Vercel URL (no trailing slash)
- [ ] Razorpay keys set if using donations

---

## 5. Custom domain (optional)

**Vercel:** Project → Settings → Domains → add `www.yourdomain.org`.

**Render:** Service → Settings → Custom Domain for `api.yourdomain.org`, then set:

`VITE_API_BASE_URL=https://api.yourdomain.org/api`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Map/admin empty | Wrong or missing `VITE_API_BASE_URL`; rebuild Vercel after changing env |
| CORS errors | Set `FRONTEND_URL` on Render to exact Vercel origin; redeploy API |
| 404 on refresh | Ensure `frontend/vercel.json` is deployed (root = `frontend`) |
| API sleeps (free Render) | First request after idle can take ~30s; upgrade or use a cron ping |
| API won’t start | Missing or invalid `MONGODB_URI`; check Atlas IP allowlist (0.0.0.0/0 for Render) |
| Uploads lost | Free tier disk is ephemeral; use cloud storage for production |

---

## Local development

```bash
# Terminal 1 — API
cd backend && cp .env.example .env && npm install && npm run dev
# Set MONGODB_URI in .env (local MongoDB or Atlas)

# Terminal 2 — site
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

Frontend: http://localhost:5173 · API: http://localhost:5000
