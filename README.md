<p align="center">
  <strong>Pulse</strong>
</p>

<p align="center">
  Your Vercel deployments, on your home screen.
</p>

<p align="center">
  A mobile-first PWA that turns deployment monitoring into a native-app experience — installable, glanceable, and built for the moment between pushes.
</p>

---

## Why Pulse

Vercel’s dashboard is built for desktop. Pulse is built for the pocket check: a quick look at what shipped, what failed, and how traffic is moving — without opening a browser tab.

Install it once. Tap the icon. Close it when you’re done.

---

## Highlights

**Home-screen native** — Add to your iPhone or Android home screen. No App Store, no browser chrome. Pulse runs as a standalone app with its own icon and splash.

**Real Vercel data** — Projects, deployments, and Web Analytics pulled live from the Vercel REST API. Connect a personal access token once; everything updates from there.

**Designed for touch** — Swipe between tabs, pull to refresh, drag-to-dismiss sheets, and directional view transitions that respect `prefers-reduced-motion`.

**Your look, your scheme** — Light, dark, or auto. Eight accent palettes, each derived from four seed colors. Deployment statuses stay semantic — green ready, amber building, red error — regardless of accent.

**Security by default** — Vercel tokens are verified, encrypted via Supabase Vault, and decrypted only on the server. Plaintext never reaches the browser.

---

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), JavaScript |
| Auth & data | Supabase — email/password, magic link, GitHub OAuth, Postgres with RLS, Vault |
| Integrations | Vercel REST API — projects, deployments, Web Analytics |
| UI | Tailwind CSS v4, shadcn/ui, `@animateicons/react` |
| PWA | Dynamic manifest + icons (`next/og`), production service worker for static assets |

---

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API Keys → publishable key (`sb_publishable_...`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API Keys → secret key (`sb_secret_...`) — server-only |
| `NEXT_PUBLIC_SITE_URL` | Your app URL with scheme (`http://localhost:3000` locally). **Must include `https://` in production** — auth redirects depend on it. |

Apply the database schema from `supabase/migrations/` after linking your project:

```bash
npx supabase link
npx supabase db push
```

Auth emails (signup, magic links, password resets) use Supabase’s built-in templates. If a custom Send Email hook was previously pointed at this app, remove it in [Auth Hooks](https://supabase.com/dashboard/project/_/auth/hooks) so the default mailer is used.

### GitHub sign-in

Two callback URLs — mixing them produces `No API key found in request`.

| Where | Value |
| --- | --- |
| GitHub OAuth App → Redirect URI | `https://<project-ref>.supabase.co/auth/v1/callback` |
| Supabase → URL Configuration | `https://your-domain.com/auth/callback**` |
| Vercel env `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |

1. Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers). Set the Redirect URI to the **Supabase** callback — not your app URL.
2. Enable GitHub under Supabase → Authentication → Providers. Paste the Client ID and Secret.
3. Add your app’s `/auth/callback**` URL to Supabase’s redirect allow list.

### Connecting Vercel

Sign in, open **Settings**, and paste a [personal access token](https://vercel.com/account/tokens). Pulse verifies it against the Vercel API, then stores it encrypted in Supabase Vault.

---

## Scripts

```bash
npm run dev              # development server
npm run build            # production build
npm run start            # serve production build
npm run lint             # eslint
npm run boneyard:build   # regenerate mobile loading skeletons (dev)
```

---

## Deploying

1. Import this repo into a new Vercel project.
2. Set all environment variables in the Vercel project settings (`NEXT_PUBLIC_SITE_URL` must match the deployed URL, including `https://`).
3. In Supabase → Authentication → URL Configuration, add the deployed URL and `{deployed URL}/auth/callback**` to allowed redirect URLs.
4. Remove any custom Send Email auth hook so confirmation and reset emails use Supabase’s default mailer.

---

<p align="center">
  <sub>Personal tool. One Vercel account per user. Built for the deploy check, not the full dashboard.</sub>
</p>
