# English Writing Analyzer

A private, single-user web app for analyzing your own writing samples over
time: overused/basic word flags with stronger alternatives, repetition
detection, sentence-structure stats, and trend tracking across submissions.

## Stack

- Next.js (App Router, TypeScript), Tailwind CSS
- Supabase — Postgres for samples/analysis history, Auth (magic link) gating
  the whole app to a single user
- [wink-nlp](https://winkjs.org/wink-nlp/) for POS tagging, lemmatization,
  and sentence/clause analysis (runs locally, no external API calls)

## Local development

1. Copy `.env.example` to `.env.local` and fill in your Supabase project's
   URL and anon key (Project Settings -> API).
2. `npm install`
3. `npm run dev`, then open [http://localhost:3000](http://localhost:3000).

Sign-in uses a Supabase magic link sent to your email; the app redirects
unauthenticated requests to `/login`.

## Database schema

See `supabase/migrations/` for the `samples` / `analysis_results` tables and
their row-level security policies (every row is scoped to `auth.uid()`).

## Deployment

Deployed on Vercel, connected to this GitHub repo for auto-deploy on push to
`main`. Required environment variables: `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (see
`.env.example`). The Supabase project's Auth redirect URL allowlist must
include `<site-url>/auth/callback` for both local and production URLs.
