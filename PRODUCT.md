# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A single developer (the product's owner) monitoring their own Vercel projects from their phone — and occasionally desktop — instead of opening vercel.com in a mobile browser. Personal tool, not built for onboarding other people; each account is fully isolated (see RLS below), so there is no shared/team audience today.

## Product Purpose

Pulse is a mobile-first PWA dashboard for monitoring Vercel deployments and Web Analytics. Installable to the home screen with no App Store, it gives an at-a-glance, native-app-like view of deployment status, recent activity, and per-project analytics without needing a browser tab open to vercel.com.

## Positioning

Unlike checking vercel.com in a mobile browser, Pulse installs to the home screen as a standalone app — its own icon, no browser chrome, offline-safe app shell — purpose-built for a phone-sized "check my deploys" glance rather than the full desktop-oriented Vercel dashboard.

## Operating Context

Single Vercel account per sign-in. The user authenticates via Supabase (email/password, magic link, or GitHub), then connects one personal Vercel access token — verified against the live Vercel API before being encrypted via Supabase Vault — to pull real project and deployment data.

Views: **Deploys** (stat cards, weekly activity, deploy timeline), **Analytics** (per-project Vercel Web Analytics — visitors, pageviews, 7-day trend, top pages — only for projects with Web Analytics enabled on Vercel), **Domains** (not yet built), **Settings** (Vercel connection, appearance).

## Capabilities and Constraints

- JavaScript only across the codebase — no TypeScript, by explicit decision.
- One Vercel personal access token per Supabase user account; no multi-account switching yet.
- Supabase is the fixed backend and is not swappable: Auth (email/password, magic link, and GitHub), Postgres with RLS from day one (`profiles`, `vercel_tokens` tables), and Vault for encrypting the stored Vercel token. The plaintext token is decrypted only server-side (via a security-definer Postgres function reachable solely through the service role) and never reaches the browser. Auth emails use Supabase's default templates.
- Real Vercel REST API integration for projects/deployments (`/v9/projects`, `/v6/deployments`) and Web Analytics (`/v1/query/web-analytics/...`). Web Analytics is opt-in per Vercel project, so the UI must handle the "not enabled for this project" case as a distinct, calm state — not an error.
- The dashboard's "Team Collaboration" card currently renders fake/mock teammates. Confirmed: this must be removed — Pulse has no real multi-user/team feature, and per-user RLS isolation means there is no "team" to show.
- Known non-functional placeholders still in the UI: the Domains tab, and the desktop topbar's search input and Mail/Bell icon buttons.
- Light and dark themes are both first-class and user-toggleable (not just a system-preference passthrough), persisted in localStorage with system-preference as the fallback default.
- PWA installability is real, not decorative: dynamically generated manifest + icons (via `next/og`, no static placeholder assets), and a minimal service worker that caches static assets only — the app itself is auth-gated and dynamic, so it does not pretend to work offline.

## Brand Commitments

- Name: **Pulse**.
- Mark: a green-gradient rounded-square badge with a white/dark ▲ (triangle) glyph — echoes Vercel's own triangle mark since the product is explicitly Vercel-focused.
- Primary accent: mint green — deep forest green `#0E4B36` in light mode, bright mint `#2FD9A8` in dark mode.

## Evidence on Hand

No marketing content, testimonials, or case studies — this is a personal tool, not a marketed product. The original design brief and an HTML mockup seeded the initial build; both were working documents, not durable brand assets to re-derive from.

## Product Principles

1. Real data over mock data — once connected, every dashboard element reflects the user's actual Vercel account; any sample/placeholder data must be clearly labeled as such and never presented as if real.
2. Native-app feel on the phone — PWA installability, no browser chrome, a fast glance-and-close usage pattern.
3. Security-first credential handling — the Vercel token is encrypted at rest, decrypted only server-side, and never logged or exposed to the client.
4. Dark and light are equally first-class, not an afterthought toggle.
5. Graceful degradation — not-yet-connected or not-yet-enabled features explain themselves (a "connect Vercel" banner, a "Web Analytics not enabled" state) instead of erroring or silently failing.
