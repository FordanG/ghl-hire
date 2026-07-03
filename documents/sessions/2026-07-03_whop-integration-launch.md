# Session: Whop Payments Integration + Platform Launch

- **Date:** 2026-07-03
- **Author:** Claude (with Gabriel Fordan)
- **Status:** Approved
- **Last Updated:** 2026-07-03

## Summary

Replaced the unfinished Maya (PayMaya) payment integration with Whop hosted
checkout links, fixed a batch of pre-existing bugs, hardened database security,
and removed the pre-launch waitlist redirect. See
[`documents/setup/2026-07-03_whop-payments-setup.md`](../setup/2026-07-03_whop-payments-setup.md)
for the Whop dashboard/env setup required before paid checkout works in production.

## Changes

### Payments (Whop replaces Maya)
- New `src/lib/payments/plans.ts` (client-safe plan config, USD: Basic $29.99,
  Premium $59.99) and `src/lib/payments/whop.ts` (`@whop/sdk` client +
  checkout-configuration creation with company/plan/transaction metadata).
- `/api/payments/create-checkout`: now session-authenticated (company derived
  from the signed-in user, never the request body), returns a hosted Whop
  checkout link.
- `/api/payments/webhook`: verifies Whop signatures via `@whop/sdk`
  (`standardwebhooks`), handles `payment.succeeded` (activate/renew + invoice),
  `payment.failed`, `membership.deactivated` (downgrade to free),
  `membership.cancel_at_period_end_changed`. Idempotent on retries.
- `src/lib/supabase/admin.ts`: service-role client for webhook/system writes.
- Deleted `src/lib/payments/maya.ts`; env vars swapped to `WHOP_*`.

### Database migrations (applied to production)
- `018_whop_payments.sql`: renamed `maya_*` → `provider_*` columns, added
  `provider` column, dropped wide-open `USING (true)` write policies on
  subscriptions/transactions/invoices, added `enforce_job_post_limit` trigger
  (server-side job-post gating; active jobs only, drafts free).
- `019_security_hardening.sql`: pinned `search_path` on 24 functions, revoked
  EXECUTE on dangerous SECURITY DEFINER RPCs from anon/authenticated, made
  `email_logs` service-role-only, revoked anon SELECT on 20 private tables.
- `020_fix_admin_roles_recursion.sql`: fixed infinite recursion in
  `admin_roles` RLS policies (was locking admins out of `/admin/moderation`);
  added `is_admin()` SECURITY DEFINER helper.

### UI fixes
- `/pricing`: USD prices sourced from `plans.ts`, `{ planId }`-only checkout
  call, removed free-trial/GCash/PayMaya copy (page + SEO metadata), fixed
  broken `/login` redirect, fixed dynamic Tailwind classes that never compiled.
- `/company/dashboard/billing`: rewrote hardcoded mock into a live page
  (real subscription, usage meter, invoices with download links).
- `/company/billing/success`: handles Whop's `?status=` redirect param;
  failed/canceled pages de-Maya'd.
- `/post-job` + `/edit-job/[id]`: limit counting matches server rule (active
  only) and `JOB_POST_LIMIT_REACHED` errors surface a friendly upgrade prompt.
- Fixed dead `/login` links (route is `/signin`) in admin moderation, support,
  notifications (+preferences), company analytics, blog comments.
- Fixed auth-loading race that bounced signed-in users to signin on hard
  refresh (admin, notifications, preferences, analytics pages).

### Launch
- Removed the waitlist redirect from `src/middleware.ts` (waitlist page stays
  reachable at `/waitlist`); removed PayMaya CSP entries. Super Cloner promo
  banner retained (global, in root layout).

## QA performed
- Production build green (58 pages), `tsc --noEmit` clean.
- Live-stack flow tests (24 checks, all passing after fixes):
  free-plan job limit trigger (block/allow/draft), RLS self-upgrade blocked,
  anon grant revocations, jobseeker apply flow, employer subscription reads,
  signed-webhook end-to-end (upgrade → invoice `INV-2026-07-0001` → idempotent
  replay → deactivation downgrade), invalid webhook signature rejected (401),
  unauthenticated checkout rejected (401). QA data cleaned up afterward.

## Follow-ups / notes
- Whop dashboard setup + production env vars required before paid checkout
  works (see setup guide). Until then, upgrade attempts fail gracefully.
- Seed/sample data exists in production (≈5 jobs, 6 companies, 34 profiles from
  migration 003) — decide whether to keep as launch content or purge.
- `/admin/moderation` requires an `admin_roles` row; grant via SQL when ready.
- Supabase Auth "leaked password protection" is off — enable in dashboard.
- `signin` page doesn't honor a `?redirect=` param yet (nice-to-have).
- Next.js warns `middleware` file convention is deprecated in favor of `proxy`
  (Next 16) — works today, migrate eventually.
