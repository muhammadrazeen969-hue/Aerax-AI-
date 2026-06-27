# Free Deployment Guide — AeraX AI

Two free services: **Render** (API) + **Vercel** (Web App). Both are 100% free, no credit card needed.

---

## Step 1 — Push to GitHub

1. In Replit, click the **Git icon** in the left sidebar
2. Click **Connect to GitHub** → authorize your account
3. Click **Create new repository** → name it `aeraxai`
4. Click **Commit & Push**

---

## Step 2 — Deploy API on Render (free)

1. Go to [render.com](https://render.com) → **Sign up for free** (use GitHub login)
2. Click **New** → **Web Service**
3. Click **Connect a repository** → select `aeraxai`
4. Render will auto-detect `render.yaml` — click **Apply**
5. Add your OpenAI API key:
   - Go to **Environment** tab
   - Add: `OPENAI_API_KEY` = your key
6. Click **Deploy** — wait ~3 minutes
7. Copy your Render URL (looks like `aeraxai-api.onrender.com`)

---

## Step 3 — Deploy Web App on Vercel (free)

1. Go to [vercel.com](https://vercel.com) → **Sign up for free** (use GitHub login)
2. Click **Add New Project** → select `aeraxai`
3. Add Environment Variable:
   - `EXPO_PUBLIC_DOMAIN` = your Render URL from Step 2 (e.g. `aeraxai-api.onrender.com`)
4. Click **Deploy** — wait ~3 minutes
5. Your app is live at `aeraxai.vercel.app` 🎉

---

## Notes

- Render free tier may sleep after 15 mins of no traffic — first request takes ~30s to wake up
- Vercel free tier: unlimited static hosting, no sleep
- Both are **permanently free** with no expiry
