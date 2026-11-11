# Polar Payments Migration and Bug-Fix Round

- **Date:** 2026-11-11
- **Author:** Claude (with Gabriel Fordan)
- **Status:** Draft
- **Last Updated:** 2026-11-11

## Polar replaces Whop

Whop was removed and Polar wired in as the only payment provider. Production had
no paid Whop subscriptions, so there was nothing to migrate. See
[`../setup/2026-11-11_polar-payments-setup.md`](../setup/2026-11-11_polar-payments-setup.md).

Pending: Polar dashboard setup, env vars, applying migration 023, end-to-end test.

## Bug-fix round

Three read-only audit agents (server/security, UI flows, mechanical scan) found
the defects; five fix agents applied them on disjoint files.

Security (migration `024_security_hardening.sql` + routes):
- `/api/resumes/view` signed any stored path; it now requires the path to belong to the row's owner.
- `applications` updates: only `status` may change; applicants may only withdraw.
- Owners can no longer set `companies.is_verified` or job view/application counters.
- Ticket numbers use an atomic per-year counter; ticket owners can no longer update tickets.
- Admin manage API returns 404 for unknown ids; status emails use the DB status; middleware redirects keep refreshed session cookies.

Functional:
- Resume (Apply modal, profile) and company logo uploads used paths the storage policies reject.
- Server-action body limit raised to 10MB.
- Category pages: broken `ilike` filter, `is_remote` vs `remote`, first-hyphen-only replace.
- Closed/expired jobs can no longer be applied to.
- Applications pages no longer crash on archived jobs; dashboard stats use real counts.
- Admin dashboard totals and lookups no longer limited to the newest 75 rows.
- Smaller: search sanitizing, `/jobs?category=`, `?jobId=` filter, job-alert pause preserved, job duplicate copies requirements/benefits, profile auto-save removed, localStorage guards.

## Left open (need a product decision)

- Settings pages do not save; company Team tab shows hardcoded members; Delete Account is inert.
- `moderator` / `support` roles cannot access `/admin` since the dashboard rebuild.
- Suspending a user does not revoke their current session.
- `ReportContentButton` is not mounted anywhere, so no reports can be created.

## Verification

`tsc --noEmit` clean, `eslint` 0 errors, `next build` passes. The category
filter syntax was checked against the live REST API. Not run: browser QA of the
fixed flows, Polar checkout/webhook end to end. Migrations 023 and 024 are not
applied to production.
