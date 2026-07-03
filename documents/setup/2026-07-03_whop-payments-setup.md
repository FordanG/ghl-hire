# Whop Payments Setup Guide

- **Date:** 2026-07-03
- **Author:** Claude (with Gabriel Fordan)
- **Status:** Approved
- **Last Updated:** 2026-07-03

## Overview

GHL Hire uses [Whop](https://whop.com) for subscription payments. The app creates a
**checkout configuration** via the Whop API for every purchase (attaching
`company_id` / `plan_id` / `transaction_id` metadata), redirects the employer to the
hosted Whop checkout link, and activates the subscription when the
`payment.succeeded` webhook arrives.

```
/pricing → POST /api/payments/create-checkout → Whop hosted checkout
    → redirect back to /company/billing/success
    → webhook POST /api/payments/webhook → subscriptions table updated
```

Plan definitions live in [`src/lib/payments/plans.ts`](../../src/lib/payments/plans.ts):

| Plan    | Price (USD/mo) | Active job limit | Featured | Team |
|---------|----------------|------------------|----------|------|
| Free    | $0             | 1                | 0        | 1    |
| Basic   | $29.99         | 5                | 1        | 3    |
| Premium | $59.99         | Unlimited        | 5        | Unlimited |

The Whop dashboard is the billing source of truth — the prices configured there are
what customers are charged. Keep `plans.ts` display prices in sync.

## One-time Whop dashboard setup (manual)

1. **Create a Whop business account** at <https://whop.com> (if you don't have one).
2. **Create a product** (e.g. "GHL Hire Employer Subscription").
3. **Create two recurring pricing plans** on that product:
   - Basic — $29.99 / month
   - Premium — $59.99 / month
4. **Copy each plan ID** (`plan_...`): Dashboard → Checkout links (or the product's
   pricing section) → three-dots menu → Details.
5. **Create an API key**: Dashboard → Developer → API keys.
6. **Create a webhook**: Dashboard → Developer → Webhooks →
   - URL: `https://ghlhire.com/api/payments/webhook`
   - API version: `v1`
   - Events: `payment.succeeded`, `payment.failed`, `membership.deactivated`,
     `membership.cancel_at_period_end_changed`
   - Copy the **webhook signing secret**.

## Environment variables

Set these in `.env.local` (development) **and** the production host (e.g. Vercel
project settings):

```bash
WHOP_API_KEY=<api key from step 5>
WHOP_WEBHOOK_SECRET=<signing secret from step 6>
NEXT_PUBLIC_WHOP_PLAN_ID_BASIC=<plan_... from step 4>
NEXT_PUBLIC_WHOP_PLAN_ID_PREMIUM=<plan_... from step 4>
```

`SUPABASE_SERVICE_ROLE_KEY` must also be set — the webhook writes to
`subscriptions` / `payment_transactions` / `invoices` with the service role
(client RLS no longer permits those writes).

## Testing

Whop supports a sandbox environment. Create sandbox plans in the sandbox dashboard
and use their plan IDs in `.env.local` to test end-to-end without real charges.
The `payment.succeeded` webhook must reach your dev machine — use a tunnel
(e.g. `ngrok http 3000`) and point a sandbox webhook at it, or test the webhook
handler by replaying events from the Whop dashboard.

## Key implementation files

| Concern | File |
|---|---|
| Plan config (client-safe) | `src/lib/payments/plans.ts` |
| Whop SDK client + checkout creation | `src/lib/payments/whop.ts` |
| Checkout API (session-authenticated) | `src/app/api/payments/create-checkout/route.ts` |
| Webhook handler (signature-verified) | `src/app/api/payments/webhook/route.ts` |
| Service-role Supabase client | `src/lib/supabase/admin.ts` |
| DB migration (provider columns, RLS, job-limit trigger) | `supabase/migrations/018_whop_payments.sql` |

## Notes

- Job-post limits are enforced by a Postgres trigger (`enforce_job_post_limit`);
  the UI check in `/post-job` is advisory only. Limits count **active** jobs.
- The Maya (PayMaya) integration was removed in this change; historical docs
  referencing Maya are superseded by this guide.
- Renewal payments are matched by Whop membership ID
  (`subscriptions.provider_subscription_id`) when checkout metadata is absent.
