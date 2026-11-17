# Free job board relaunch

- **Date:** 2026-11-18
- **Author:** Claude Code session with Gabriel
- **Status:** In Review
- **Last Updated:** 2026-11-18
- **Branch:** `free-job-board`

## What changed

GHL Hire reopens as a free job board. Its job is traffic for Super Cloner and email capture. There are no subscriptions.

### Product
- Posting is free. The plan limit is replaced by a flat cap of 25 active listings per company (anti-spam).
- Featured listings are the only paid option and are arranged by email (`hello@vendrato.com`). An admin switches them on in `/admin` (Jobs, Featured column). Employers cannot set the flag themselves.
- Listings can link out: an employer may add an application link, and curated listings (real roles found on employer hiring pages) always link to the original posting.
- Email capture: `SubscribeForm` posts to `/api/subscribe`, stored in `newsletter_subscribers`.
- Guides: eight articles at `/blog`, written as typed content in `src/content/articles/`, statically rendered with Article and FAQ structured data.
- Super Cloner: site-wide strip, homepage band, card on job pages, jobs sidebar and inside each article. The affiliate link lives in `src/lib/site.ts`.

### Removed
- `/pricing`, checkout and webhook routes, billing result pages, Whop SDK and plan config.
- `/categories`, `/jobs/category/*` and `/resources`: orphan pages that showed made-up salary, demand and "openings" figures. They now redirect.
- Fabricated testimonials and success-rate claims on `/employers`.
- The waitlist: `WAITLIST_MODE=on` still puts the site behind `/waitlist`, but it is off by default.

### Database (migration `025_free_job_board.sql`, applied to production 2026-11-18)
- `jobs`: `apply_url`, `source_name`, `external_company_name`, `external_company_url`, `salary_period`; `company_id` is nullable for curated listings.
- Triggers: free posting cap, featured flag is staff-only, curated fields are staff-only.
- `find_job_by_slug` returns the new columns and `is_curated`.
- `newsletter_subscribers` table (RLS on, no policies, service role only).

### Listings
- The 17 sample listings from the 5 seed agencies were closed (status `closed`), not deleted. Applications made to them are untouched.
- 21 real roles, each opened and confirmed live on 2026-11-18, were added from `supabase/seed/curated-jobs-2026-11-18.json` with `scripts/seed-curated-jobs.ts`.

## Design
- One typeface (Hanken Grotesk), navy ink, blue for actions, gold only for featured listings and Super Cloner.
- The hexagon from the logo recurs: company monograms, step markers, the dark field pattern and the article covers.
- The homepage hero is the board itself: search plus the latest roles.
- Article covers were generated with Codex CLI (`codex exec --enable image_generation`), no text or people.

## Verified
- `tsc`, `eslint` (0 errors) and `next build` pass.
- Database rules tested in a rolled-back transaction: an employer can publish several roles, cannot self-feature, cannot set curated fields, cannot edit curated rows; anonymous visitors see curated roles and cannot read subscribers.
- Pages checked at 390, 1440 and 2560 wide on the production build.

## Not verified
- Sign-up, sign-in, applying and posting were not clicked through with a real account (that would create production data).
- No email is sent on subscribe yet.

## Keeping curated listings honest
Curated roles go stale. Re-check the `apply_url` of each curated listing regularly and close the ones that are gone:

```sql
select id, title, external_company_name, apply_url, created_at from jobs where company_id is null and status = 'active';
```

## Follow-up the same day: off Netlify functions

Netlify reported about 430,000 serverless function requests a month (free limit 125,000) and about 340,000 edge function requests. Cause: every page was rendered on demand and the middleware matched every request, so each visit and each crawler hit cost one of each.

- Public pages are prebuilt: `/` (refreshed every 5 minutes), `/jobs` (10 minutes), `/jobs/[id]` (hourly, new jobs generated on first visit), guides, employers, featured.
- `/jobs` search, filters, sort and paging run in the browser (`src/components/JobsBoard.tsx`).
- Job view counts are sent from the browser straight to Supabase (`ViewCounter`).
- Middleware only matches signed-in areas and `/api`; security headers moved to `netlify.toml`. Waitlist mode is removed.
- Public forms (newsletter signup, featured request, contact) call the Supabase Edge Function `site-forms` (`supabase/functions/site-forms/index.ts`, deployed 2026-11-18). The matching Next API routes are deleted.
- Still on Netlify functions, by design: signed-in dashboards' API routes (profile creation, application emails, resume links, admin actions, AI helpers), sign-in callbacks, and the periodic page refreshes.

To do: add `RESEND_API_KEY` to the Supabase Edge Function secrets, otherwise form submissions are saved (and visible in the admin console) but no notification email is sent.

Not verified: the real drop in Netlify function usage, which can only be measured after deploy.

## Email

`inquiries@ghlhire.com` is a Mango Mail mailbox with a filter that forwards to Gabriel's Gmail. DNS is in Netlify DNS. All site addresses use it.

