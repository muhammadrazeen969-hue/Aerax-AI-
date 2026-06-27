# AeraX AI — Replit Independence Migration Report

Generated: June 2025

---

## Summary

**Verdict: ✅ The application can run completely without Replit.**

All Replit-specific dependencies have been identified and either removed or made optional. The app uses a standard Node.js/Express backend and an Expo React Native frontend — both industry-standard stacks that run on any cloud provider.

---

## 1. Replit Dependencies Found

### A. Environment Variables (Replit-injected)

| Variable | Where Used | Type |
|----------|-----------|------|
| `REPLIT_EXPO_DEV_DOMAIN` | `mobile/package.json` dev script | Dev only |
| `REPLIT_DEV_DOMAIN` | `mobile/package.json` dev script | Dev only |
| `REPL_ID` | `mobile/package.json` dev script | Dev only |
| `REPLIT_INTERNAL_APP_DOMAIN` | `mobile/scripts/build.js` | Build only |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | `api-server/src/routes/ai.ts` | AI proxy |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | `api-server/src/routes/ai.ts` | AI proxy |
| `PORT` | Both services | Generic (not Replit-specific) |

### B. Hardcoded References

| File | What | Impact |
|------|------|--------|
| `artifacts/mobile/app.json` | `"origin": "https://replit.com/"` in expo-router plugin | App routing origin wrong outside Replit |
| `artifacts/mobile/scripts/build.js` | Only checked Replit domain vars | Build fails outside Replit |

### C. Platform Files (Replit metadata — no code impact)

| File | Purpose |
|------|---------|
| `.replit` | Replit workspace config |
| `.replitignore` | Replit ignore file |
| `artifacts/*/`.replit-artifact/artifact.toml` | Replit service routing config |
| `pnpm-workspace.yaml` | Standard pnpm workspace config (not Replit-specific) |

---

## 2. Replit Dependencies Removed / Fixed

| Item | Action Taken | Status |
|------|-------------|--------|
| `"origin": "https://replit.com/"` in `app.json` | Removed — Expo now uses actual hosting domain | ✅ Done |
| `scripts/build.js` domain detection | Updated to support `APP_DOMAIN`, `EXPO_PUBLIC_DOMAIN`, `VERCEL_URL`, `RENDER_EXTERNAL_URL` — Replit vars still work as fallback | ✅ Done |
| `REPL_ID` required in build | Made optional (returns empty string if not set) | ✅ Done |
| `dev:local` script added | `pnpm run dev:local` works without any Replit env vars | ✅ Done |
| `.env.example` files created | `artifacts/api-server/.env.example` and `artifacts/mobile/.env.example` | ✅ Done |

---

## 3. Remaining Dependencies

### A. AI Provider (Action Required)

| Item | Status | Action |
|------|--------|--------|
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Replit-managed proxy | Outside Replit: set `OPENAI_API_KEY` in your host's env vars |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | Replit proxy URL | Outside Replit: leave unset — SDK uses official OpenAI API |

**The code already handles this correctly.** `ai.ts` uses:
```ts
const apiKey = process.env["AI_INTEGRATIONS_OPENAI_API_KEY"] ?? process.env["OPENAI_API_KEY"];
const baseURL = process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"]; // undefined = use official API
```
When `AI_INTEGRATIONS_OPENAI_BASE_URL` is not set, the OpenAI SDK automatically uses `https://api.openai.com`. No code change required — just set `OPENAI_API_KEY` in your deployment.

### B. Replit Platform Files (Safe to Keep or Delete)

These files exist only for Replit's platform and have zero effect on the running application outside Replit:

| File | Can Delete? | Notes |
|------|------------|-------|
| `.replit` | Yes | Replit workspace launcher config |
| `.replitignore` | Yes | Like .gitignore but for Replit |
| `artifacts/*/`.replit-artifact/artifact.toml` | Yes | Replit routing/preview config |

**Recommendation:** Keep them if you want to continue developing on Replit, or delete them when fully migrated.

### C. Dev Script (Replit-only, non-blocking)

The default `pnpm run dev` script in `mobile/package.json` still references Replit vars — **but this only affects development on Replit**. Outside Replit, use `pnpm run dev:local` instead.

---

## 4. Database

**Current:** No backend database. All user data (auth, conversations) is stored in `AsyncStorage` on the device.

**Impact:** Zero migration needed. There is no database to move.

**Future consideration:** If you add a backend database later, use [Supabase](https://supabase.com) (free tier, PostgreSQL) or [PlanetScale](https://planetscale.com) — both are host-agnostic.

---

## 5. Authentication

**Current:** Email/password stored in device `AsyncStorage`. No server-side auth.

**Impact:** Zero migration needed. Auth works identically on any host because it's entirely client-side.

**Founder access** (admin dashboard) is controlled by hardcoded email list in `contexts/AuthContext.tsx`:
```
muhammadrazeen969@gmail.com
inforezocreative123@gmail.com
```
This is independent of any hosting provider.

---

## 6. Independence Checklist

| Feature | Works Outside Replit? | Notes |
|---------|----------------------|-------|
| Landing page (web) | ✅ Yes | Static Expo web export |
| User registration | ✅ Yes | Client-side AsyncStorage |
| User login | ✅ Yes | Client-side AsyncStorage |
| AI Chat (streaming) | ✅ Yes | Needs `OPENAI_API_KEY` |
| Image generation | ✅ Yes | Needs `OPENAI_API_KEY` |
| Voice chat | ✅ Yes | Client-side only |
| 14 AI tool modes | ✅ Yes | Uses same API |
| Admin dashboard | ✅ Yes | Founder email check is client-side |
| Premium system | ✅ Yes | Client-side AsyncStorage |
| Founder page | ✅ Yes | Static content |
| About page | ✅ Yes | Static content |
| Native iOS app | ✅ Yes | EAS Build |
| Native Android app | ✅ Yes | EAS Build |

---

## 7. Migration Steps for You

### Step 1: Get an OpenAI API Key
- Go to https://platform.openai.com/api-keys
- Create a key with at least GPT-4o-mini and DALL-E 3 access
- Budget: ~$5–10/month for moderate usage

### Step 2: Deploy the API Server
- Recommended: [Railway](https://railway.app) (free 500 hrs/month)
- Set env vars: `OPENAI_API_KEY`, `PORT=8080`, `NODE_ENV=production`
- See `DEPLOYMENT.md` for step-by-step instructions

### Step 3: Deploy the Web App
- Recommended: [Vercel](https://vercel.com) (free hobby plan)
- Set env var: `EXPO_PUBLIC_DOMAIN=your-api.railway.app`
- See `DEPLOYMENT.md` for step-by-step instructions

### Step 4: (Optional) Build Native Apps
- Use Expo EAS Build for iOS/Android binaries
- EAS free tier: 30 builds/month

### Step 5: Point Domain (Optional)
- Buy a domain (~$10/year at Namecheap or Cloudflare)
- Point it to your Vercel deployment
- Update `EXPO_PUBLIC_DOMAIN` to your domain

---

## 8. Exported Source Code

All source code is in this repository:

```
/
├── artifacts/
│   ├── api-server/          # Node.js / Express API (deploy this)
│   │   ├── src/
│   │   │   ├── routes/ai.ts  # AI endpoints (chat, image gen)
│   │   │   └── app.ts        # Express app setup
│   │   ├── .env.example      # ← copy to .env, fill in OPENAI_API_KEY
│   │   └── package.json
│   └── mobile/              # Expo React Native app (deploy this)
│       ├── app/             # All screens
│       ├── contexts/        # Auth + Chat state
│       ├── components/      # Shared UI components
│       ├── .env.example     # ← copy to .env, fill in EXPO_PUBLIC_DOMAIN
│       └── package.json
├── DEPLOYMENT.md            # Step-by-step deployment guide
├── MIGRATION_REPORT.md      # This file
└── pnpm-workspace.yaml      # Workspace config
```

**Everything you need to self-host is in this repository. No Replit account required to run it.**
