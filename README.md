# Pulse

A mobile-first PWA dashboard for monitoring your Vercel deployments and Web
Analytics — installable to your phone's home screen, no App Store required.
Personal tool, single Vercel account per user.

## Stack

- **Next.js 16** (App Router), plain JavaScript — no TypeScript
- **Supabase** — Auth (email/password, magic link, GitHub), Postgres with RLS,
  Vault for encrypting the stored Vercel access token
- **Vercel REST API** — real projects, deployments, and Web Analytics
- Tailwind CSS v4, shadcn/ui, `@animateicons/react`
- PWA: dynamically generated manifest + icons (`next/og`), a minimal service
  worker (static assets only, production-only)

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in the values below
npm run dev
```

### Environment variables

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → API Keys → "publishable" key (`sb_publishable_...`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → API Keys → "secret" key (`sb_secret_...`) — server-only, never exposed to the browser |
| `NEXT_PUBLIC_SITE_URL` | The app's own URL (`http://localhost:3000` locally). Feeds auth email redirects — **must be the real production URL when deployed**, or magic link / password reset will break. |

Database schema and RLS policies live in `supabase/migrations/` — apply them
with `npx supabase db push` after linking the project (`npx supabase link`).

Auth emails (signup confirmation, magic links, password resets) use Supabase's
built-in templates. If a **Send Email** Auth Hook was previously pointed at
this app (`/api/auth/send-email`), delete that hook in
[Auth Hooks](https://supabase.com/dashboard/project/_/auth/hooks) so the
default mailer is used again.

### GitHub sign-in

1. Create a GitHub OAuth App at
   [github.com/settings/developers](https://github.com/settings/developers).
   Set the Authorization callback URL to your project's
   `https://<project-ref>.supabase.co/auth/v1/callback`
   (copied from Supabase → Authentication → Sign In / Providers → GitHub).
2. Enable GitHub under Supabase → Authentication → Providers and paste the
   Client ID and Client Secret.
3. In Supabase → Authentication → URL Configuration, add
   `{NEXT_PUBLIC_SITE_URL}/auth/callback**` to the allowed redirect URLs.

### Connecting Vercel

Sign in, then go to Settings and paste a
[personal access token](https://vercel.com/account/tokens). It's verified
against the Vercel API, then encrypted via Supabase Vault — the plaintext
token never reaches the browser and is only decrypted server-side.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Deploying

1. Import this repo into a new Vercel project.
2. Set the environment variables above in the Vercel project's settings
   (`NEXT_PUBLIC_SITE_URL` set to the real deployed URL).
3. In Supabase → Authentication → URL Configuration, add the deployed URL
   (and `{deployed URL}/auth/callback**`) to the allowed redirect URLs.
4. If you previously used a custom Send Email hook, delete it so confirmation
   and reset emails go through Supabase's default mailer.
