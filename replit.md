# AeraX AI

An advanced AI platform mobile app (Expo React Native) with AI chat, image generation, voice chat, 14+ AI tool modes, admin panel, premium system, and a dark futuristic design. Also includes a web-first landing page (visible on web/browser).

**Founder:** Muhammad Razeen, CEO & Founder  
**Tagline:** Smart AI For Everyone

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/mobile run dev` — run the Expo mobile app
- `pnpm run typecheck` — full typecheck across all packages
- Required env: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY` — auto-set by Replit AI Integration

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo 54 + Expo Router 6 (React Native 0.81)
- API: Express 5 + OpenAI SDK (Replit-managed integration)
- State: AsyncStorage (local) — no backend DB in v1
- Auth: AsyncStorage-based email/password (local only)
- Build: esbuild (CJS bundle for api-server)

## Where things live

- `artifacts/mobile/` — Expo React Native app
  - `app/_layout.tsx` — root layout (providers: Auth, Chat, QueryClient, Keyboard, Gesture)
  - `app/index.tsx` — web → full landing page (hero/features/about/contact); native → splash animation + redirect
  - `app/(auth)/` — login, register screens
  - `app/(tabs)/` — main tab navigation (Home, Chat, Tools, Profile)
  - `app/chat/[id].tsx` — streaming AI chat session
  - `app/image-gen.tsx` — AI image generation
  - `app/voice.tsx` — voice chat UI
  - `app/settings.tsx` — user settings
  - `app/admin.tsx` — founder admin dashboard
  - `app/about.tsx` — about page
  - `app/founder.tsx` — Muhammad Razeen founder page
  - `components/AeraLogo.tsx` — AeraX AI logo component (shows "AX" letters)
  - `contexts/AuthContext.tsx` — auth state (AsyncStorage)
  - `contexts/ChatContext.tsx` — conversation state (AsyncStorage)
  - `constants/colors.ts` — AeraX AI brand colors (always dark)
- `artifacts/api-server/` — Express API
  - `src/routes/ai.ts` — POST /api/ai/chat (SSE streaming), POST /api/ai/image, GET /api/ai/admin/stats

## Architecture decisions

- **Always-dark theme:** both `light` and `dark` keys in `constants/colors.ts` use the same dark palette (`#050d1a` background, `#00b4ff` primary)
- **Local auth v1:** email/password stored in AsyncStorage. Founder emails (`muhammadrazeen969@gmail.com`, `inforezocreative123@gmail.com`) get `isFounder: true` + unlimited premium automatically
- **Web landing page:** `app/index.tsx` uses `Platform.OS === "web"` to show a full landing page on web (navbar, hero, features, about, contact, footer) and a splash animation on native
- **AI streaming:** SSE via Express → parsed with `ReadableStream.getReader()` + `TextDecoder` on the mobile client using global `fetch` (not `expo/fetch`)
- **No backend DB in v1:** conversations persist in AsyncStorage on device
- **AI provider:** Replit-managed OpenAI integration (`AI_INTEGRATIONS_OPENAI_BASE_URL` + `AI_INTEGRATIONS_OPENAI_API_KEY`); falls back to `OPENAI_API_KEY` if set
- **API base URL on mobile:** `https://${process.env.EXPO_PUBLIC_DOMAIN}/api/...`
- **AsyncStorage keys:** `aera_user`, `aera_users` (kept for backward compat); `aerax_announcements` for admin announcements

## Product

- **Landing page (web)** — full landing page with navbar, hero CTA, features grid, about section, contact info, footer; routes to auth screens
- **Splash screen (native)** — animated AX logo (fade + scale + glow) with loading dots → redirects to tabs or login
- **Auth** — email/password login and registration; founder emails get auto-admin access
- **Home tab** — greeting, hero CTA, 8-tool grid, recent chats list
- **Chat tab** — conversation list with search, delete on long-press, mode badges
- **AI Chat session** — streaming responses (SSE), inverted FlatList, keyboard avoidance
- **Tools tab** — 14 AI modes in 5 categories (Learning, Productivity, Business/Career, Tech, Media)
- **Profile tab** — user stats, premium badge, founder access to admin
- **Image Generator** — prompt input, AI image generation, suggestion pills
- **Voice Chat** — mic UI with pulse animation, fallback text input
- **Admin Dashboard** — founder-only: stats grid, platform status, announcement system
- **About** — mission, vision, founder bio, contact info
- **Founder page** — detailed Muhammad Razeen bio, vision, business goals
- **Settings** — display name edit, notifications toggle

## User preferences

- Founder: Muhammad Razeen, CEO & Founder of AeraX AI
- Founder emails: muhammadrazeen969@gmail.com, inforezocreative123@gmail.com
- Design: always dark, black + dark blue + electric blue (#050d1a, #00b4ff, #0066ff)
- No comparisons to other AI platforms (no ChatGPT, Gemini mentions)
- Tagline: "Smart AI For Everyone"
- Brand name: AeraX AI (not "Aera AI")
- Logo: "AX" letters in a rounded rectangle icon

## Gotchas

- The `(tabs)` group must not include any screen registered as a top-level Stack screen. Only `index`, `chat`, `tools`, `profile` tabs exist.
- `useNativeDriver: true` in Animated falls back to JS on web — harmless warning
- The API server uses `gpt-5-mini` and `gpt-image-1` models via the Replit AI Integration proxy
- Do NOT change the `AI_INTEGRATIONS_OPENAI_*` env vars — they are managed by Replit
- `Platform.OS === "web"` check used throughout for padding offsets (web adds 67px top, 34px bottom)
- AsyncStorage keys `aera_user` / `aera_users` kept for backward compatibility — do not rename them

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `expo` skill for Expo-specific patterns and design guidance
