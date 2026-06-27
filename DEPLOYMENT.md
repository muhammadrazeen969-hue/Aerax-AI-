# AeraX AI — Deployment Guide

This guide explains how to deploy **AeraX AI** completely outside of Replit on free or low-cost hosting providers.

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                    AeraX AI Stack                      │
├─────────────────────────┬──────────────────────────────┤
│   API Server            │   Mobile / Web App           │
│   (Node.js / Express)   │   (Expo React Native)        │
│                         │                              │
│   artifacts/api-server/ │   artifacts/mobile/          │
│   Port: 8080            │   Web: Port 8081             │
│                         │   Native: iOS / Android      │
└─────────────────────────┴──────────────────────────────┘
```

**No database required** — v1 uses AsyncStorage (client-side only).

---

## Prerequisites

- **Node.js 18+** and **pnpm 8+**
- **OpenAI API key** — get one at https://platform.openai.com/api-keys
- A hosting account (see provider options below)

---

## Part 1 — Deploy the API Server

The API server is a standard **Node.js / Express** app. It works on any Node.js host.

### Option A: Railway (Recommended — free tier available)

1. Go to https://railway.app and create an account.
2. Click **New Project → Deploy from GitHub repo** and connect your repository.
3. Select `artifacts/api-server` as the root directory **or** set the start command:
   ```
   pnpm --filter @workspace/api-server run build && node artifacts/api-server/dist/index.mjs
   ```
4. Add these environment variables in Railway's dashboard:
   ```
   OPENAI_API_KEY=sk-...
   PORT=8080
   NODE_ENV=production
   SESSION_SECRET=your_long_random_secret
   ```
5. Railway assigns a public URL like `https://aeraxai-api.railway.app`. **Copy this URL.**

### Option B: Render (free tier available)

1. Go to https://render.com → New → **Web Service**.
2. Connect your GitHub repo.
3. Set **Build Command**: `pnpm install && pnpm --filter @workspace/api-server run build`
4. Set **Start Command**: `node artifacts/api-server/dist/index.mjs`
5. Add environment variables:
   ```
   OPENAI_API_KEY=sk-...
   PORT=10000
   NODE_ENV=production
   SESSION_SECRET=your_long_random_secret
   ```
6. Render provides a URL like `https://aeraxai-api.onrender.com`. **Copy this URL.**

### Option C: Fly.io (free tier available)

1. Install the Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. From the project root:
   ```bash
   fly launch --name aeraxai-api --region sin --no-deploy
   fly secrets set OPENAI_API_KEY=sk-... SESSION_SECRET=your_secret NODE_ENV=production
   fly deploy
   ```

### Option D: Run Locally (development)

```bash
cd artifacts/api-server
cp .env.example .env        # then edit .env with your OPENAI_API_KEY
PORT=8080 pnpm run dev
```

---

## Part 2 — Deploy the Web App (Expo Web)

The mobile app includes a full **web version** (landing page + full app) that can be deployed as a static site.

### Step 1: Build the web export

```bash
# From the project root
EXPO_PUBLIC_DOMAIN=your-api-domain.com pnpm --filter @workspace/mobile exec expo export --platform web
```

This creates `artifacts/mobile/dist/` — a standard static web build.

### Option A: Vercel (Recommended — free tier)

1. Install Vercel CLI: `npm i -g vercel`
2. From `artifacts/mobile/`:
   ```bash
   EXPO_PUBLIC_DOMAIN=your-api-domain.com npx expo export --platform web
   cd dist
   vercel --prod
   ```
3. Add environment variable in Vercel dashboard:
   - `EXPO_PUBLIC_DOMAIN` = your API server domain (without `https://`)

Or deploy via GitHub integration:
1. Push code to GitHub.
2. Go to https://vercel.com → New Project → import repo.
3. Set **Root Directory**: `artifacts/mobile`
4. Set **Build Command**: `npx expo export --platform web`
5. Set **Output Directory**: `dist`
6. Add env var: `EXPO_PUBLIC_DOMAIN=your-api-domain.com`

### Option B: Netlify (free tier)

1. Push to GitHub.
2. Go to https://app.netlify.com → Add new site → Import from Git.
3. Set **Base directory**: `artifacts/mobile`
4. Set **Build command**: `npx expo export --platform web`
5. Set **Publish directory**: `artifacts/mobile/dist`
6. Add env var: `EXPO_PUBLIC_DOMAIN=your-api-domain.com`

### Option C: Cloudflare Pages (free tier)

1. Push to GitHub.
2. Go to https://pages.cloudflare.com → Create a project.
3. **Build settings**:
   - Framework preset: None
   - Build command: `npx expo export --platform web`
   - Build output directory: `dist`
   - Root directory: `artifacts/mobile`
4. Add env var: `EXPO_PUBLIC_DOMAIN=your-api-domain.com`

---

## Part 3 — Native Mobile App (iOS / Android)

For distributing on the App Store / Google Play, use **EAS Build** (Expo's build service).

### Setup EAS

```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Build for Android

```bash
cd artifacts/mobile
eas build --platform android --profile production
```

### Build for iOS

```bash
cd artifacts/mobile
eas build --platform ios --profile production
```

### Create `eas.json` (if not present)

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_DOMAIN": "your-api-domain.com"
      }
    }
  }
}
```

---

## Part 4 — Connect Everything

After deploying both the API server and web app:

1. **Set `EXPO_PUBLIC_DOMAIN`** in your web host's env vars to your API server domain (e.g. `aeraxai-api.railway.app`).
2. **CORS**: The API server accepts all origins by default. To restrict to your domain, edit `artifacts/api-server/src/app.ts` and add:
   ```ts
   app.use(cors({ origin: "https://yourdomain.com" }));
   ```
3. **Test the connection**:
   ```bash
   curl https://your-api-domain.com/api/healthz
   # Should return: {"status":"ok"}
   ```

---

## Environment Variables Reference

### API Server (`artifacts/api-server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ Yes | Your OpenAI API key |
| `PORT` | ✅ Yes | Port to listen on (default: 8080) |
| `NODE_ENV` | ✅ Yes | `development` or `production` |
| `SESSION_SECRET` | Recommended | Random string for session signing |

### Mobile App (`artifacts/mobile/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_DOMAIN` | ✅ Yes | API server domain (no `https://`, no trailing slash) |
| `APP_DOMAIN` | Build only | Your web app domain for asset URL generation |

---

## Running Locally (Full Stack)

```bash
# Terminal 1 — API Server
cd artifacts/api-server
cp .env.example .env           # edit with your OPENAI_API_KEY
PORT=8080 pnpm run dev

# Terminal 2 — Mobile / Web App
cd artifacts/mobile
cp .env.example .env           # edit EXPO_PUBLIC_DOMAIN=localhost:8080
pnpm run dev:local
# Open http://localhost:8081 in your browser
```

---

## Founder Access

Admin dashboard is accessible to founder emails only (no code change needed):
- `muhammadrazeen969@gmail.com`
- `inforezocreative123@gmail.com`

Register with either email → automatically gets `isFounder: true` + premium access.

---

## Checklist Before Going Live

- [ ] `OPENAI_API_KEY` set in API server host
- [ ] `PORT` set correctly for your host
- [ ] `EXPO_PUBLIC_DOMAIN` set in web/mobile build pointing to your API server
- [ ] API server health check passes: `GET /api/healthz`
- [ ] Web app loads in browser and shows landing page
- [ ] Sign in / register works
- [ ] AI chat sends and receives messages
- [ ] Image generation works

---

## Cost Estimates

| Service | Provider | Estimated Cost |
|---------|----------|----------------|
| API Server | Railway | Free (500 hrs/mo) |
| Web App | Vercel | Free (hobby plan) |
| AI (OpenAI) | OpenAI | ~$0.15–$0.60 per 1M tokens |
| Native builds | EAS | Free (limited builds) |
| Domain | Namecheap / Cloudflare | ~$10/year |

**Total for low traffic: $0–$15/month** (only OpenAI usage costs apply at scale).
