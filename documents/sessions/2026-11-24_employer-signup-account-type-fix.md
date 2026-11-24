# Employer signups created as job seekers: fix

- **Date:** 2026-11-24
- **Author:** Claude (with Gabriel)
- **Status:** In Review (database fix live; app changes on branch `fix/employer-signup-role`, not yet merged or deployed)
- **Last Updated:** 2026-11-24

## Report

An employer emailed inquiries: registered as Employer, but the dashboard showed job seeker features and no way to post a job.

## Cause

1. `handle_new_user()` (migration 015) read `raw_user_meta_data->>'role'`. The signup form stored the choice as `user_type`. Every signup fell through to the `jobseeker` default and got a `profiles` row.
2. Email confirmation is on, so `signUp` returns no session. The follow-up call to `/api/auth/create-profile` returned 401, so no `companies` row was created and the form showed an error even though the account existed.
3. Account type is derived from which row exists (`profile` wins), so these users were routed to the job seeker dashboard. `/post-job` sent them back to `/signup`.

## Changes

- `supabase/migrations/026_fix_signup_account_type.sql`: trigger reads `role`, falls back to `user_type`, and copies company name, phone and location. **Applied to production 2026-11-24** (as `fix_signup_account_type`). Verified in a rolled-back transaction: employer metadata creates a company and no profile; job seeker metadata creates a profile only.
- `src/app/signup/page.tsx`: sends `role`, `company_name`, `phone`, `location` in signup metadata; shows a "Check your email" screen when confirmation is pending instead of calling the profile API without a session.
- `src/app/auth/callback/route.ts`: account type comes from `?type=` or signup metadata; redirect follows the record that exists.
- The reporting employer's account was converted by hand: company row created, empty auto-created profile removed (no applications, saved jobs or other rows attached).

## Open

- Backfill done 2026-11-24: the 14 other signups that chose Employer and had only an empty job seeker profile were converted (company created, stub profile removed, `role` added to metadata). Company name was never stored, so it was set to the person's name. 6 of the 14 have unconfirmed emails. Apology emails drafted in Gmail, not sent.
- 3 accounts have both a profile and a company and are treated as job seekers.
- A signed-in job seeker has no in-app way to become an employer (`/post-job` redirects to `/signup`).
- Tests: `npx tsx --test src/**/*.test.ts` (9 pass). `npx tsc --noEmit`, eslint on changed files and `npm run build` pass.
