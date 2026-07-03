# Session: Platform QA Workflow + Defect Fixes

- **Date:** 2026-07-04
- **Author:** Claude (with Gabriel Fordan)
- **Status:** Approved
- **Last Updated:** 2026-07-04

## Summary

Ran an 18-agent QA workflow over the launched platform (audit → mutating E2E
suite in production → adversarial verification → synthesis), AI features
excluded by scope. Core flows passed (job limits, RLS isolation, applications).
Eight confirmed defects were found; all code/DB fixes below are applied.

## Defects fixed

1. **Invoice rendering 500** — `src/lib/invoice/generate.ts` read
   `unitPrice`/`total` (dollars) while the webhook writes `{description,
   quantity, amount}` (cents). Now consumes the real shape; a 2999-cent invoice
   renders $29.99.
2. **Support tickets broken end-to-end** — the page fetched a non-existent
   `/api/user/profile` AND the API inserted with an unauthenticated anon client
   that RLS rejected. Page now queries the profile directly;
   `/api/support/create-ticket` authenticates via session, derives identity
   server-side, generates `ticket_number` via RPC, and inserts with the service
   role so employers (no jobseeker profile) can file tickets too.
3. **Jobseekers stranded on employer dashboard** — `AuthContext` set
   `loading=false` before `refreshProfile()` resolved; `/dashboard` redirected
   on the transient null profile. Now awaits the profile.
4. **Application counts never incremented / user deletion aborted** —
   `increment/decrement_application_count` were SECURITY INVOKER; RLS blocked
   the jobs UPDATE (silent 0 rows) and `supabase_auth_admin` cascades got
   42501. Migration `021_fix_application_count_triggers.sql` makes both
   SECURITY DEFINER with pinned search_path (applied to production).
5. **Sign-in ignored `?redirectedFrom=`** and blocked already-registered users
   on the wrong tab — now routes by actual account type and honors safe
   internal redirects.
6. **Password reset dead-ended** — recovery emails now route through
   `/auth/callback?next=/auth/update-password`; the callback route was fixed to
   use the cookie-aware server client (it previously used the browser singleton
   and could never exchange codes server-side); update-password shows a
   friendly "request a new link" card when the session is missing.

## Outstanding

- **BLOCKER (needs Gabriel):** Netlify silently drops secret-flagged env
  writes on this plan, so `WHOP_API_KEY` / `WHOP_WEBHOOK_SECRET` are still
  missing in production → webhook 401s and paid subscriptions cannot activate.
  Store them as plain env vars (like the other credentials) or add via the
  Netlify UI, then rebuild and re-run the webhook E2E (tests 6-7 of the flow
  suite).
- Cross-device password reset remains a Supabase PKCE limitation (friendly
  error + re-request link instead of raw failure).
