# 🚀 YatraBook — Deployment Guide

## Frontend: Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/yatrabook.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → "New Project"
2. Import your GitHub repo
3. Settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
5. Click "Deploy"

---

## Backend: Render

### Step 1: Create Web Service
1. Go to [render.com](https://render.com) → "New Web Service"
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
4. Add environment variables:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `your_atlas_connection_string`
   - `JWT_SECRET` = `your_production_secret_key`
   - `CLIENT_URL` = `https://your-app.vercel.app`
5. Click "Create Web Service"

### Step 2: Seed Production Database
After deployment, run the seed script via Render shell:
```bash
node data/seed.js
```

---

## Post-Deployment Checklist

- [ ] Frontend loads at Vercel URL
- [ ] API health check works: `https://backend-url.onrender.com/api/health`
- [ ] Register/Login works
- [ ] Search returns results
- [ ] Booking flow completes
- [ ] Dashboard shows bookings

---

## Common Deployment Issues

| Issue | Solution |
|-------|----------|
| CORS Error | Set `CLIENT_URL` in Render env vars to your Vercel domain |
| API requests fail | Ensure `VITE_API_URL` points to your Render URL |
| MongoDB timeout | Whitelist `0.0.0.0/0` in Atlas Network Access |
| Render sleeps | Free tier services sleep after 15min inactivity — first request may be slow |
