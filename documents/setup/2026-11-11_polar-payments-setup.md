# Polar Payments Setup Guide

- **Date:** 2026-11-11
- **Author:** Claude (with Gabriel Fordan)
- **Status:** Draft (code complete; Polar dashboard setup and end-to-end test pending)
- **Last Updated:** 2026-11-11

## Overview

GHL Hire uses [Polar](https://polar.sh) for subscription payments. Polar is the
merchant of record (it handles sales tax/VAT) and hosts the checkout page. It
replaced Whop on 2026-11-11; the old guide is in
[`../archive/2026-11-11_whop-payments-setup.md`](../archive/2026-11-11_whop-payments-setup.md).

```
/pricing → POST /api/payments/create-checkout → Polar hosted checkout
    → redirect back to /company/billing/success?checkout_id=...
    → webhooks POST /api/payments/webhook
         subscription.*  → subscriptions row mirrors Polar (plan, status, period)
         order.paid      → invoice + succeeded payment_transactions row
/company/dashboard/billing → POST /api/payments/portal → Polar customer portal
    (change plan, update card, cancel, receipts)
```

The Polar customer is linked to a company through `external_customer_id`, which
is the company UUID. Checkout metadata (`company_id`, `plan_id`,
`transaction_id`, `reference_number`) is copied by Polar onto the order and
subscription, and the webhook uses it to attribute events.

| Plan    | Price (USD/mo) | Active job limit | Featured | Team |
|---------|----------------|------------------|----------|------|
| Free    | $0             | 1                | 0        | 1    |
| Basic   | $29.99         | 5                | 1        | 3    |
| Premium | $59.99         | Unlimited        | 5        | Unlimited |

The Polar product is the billing source of truth. Keep the display prices in
[`src/lib/payments/plans.ts`](../../src/lib/payments/plans.ts) in sync with it.

## Sandbox vs production

Polar has two fully separate environments, each with its own account,
organization, products, tokens and webhooks:

- Production: <https://polar.sh>
- Sandbox: <https://sandbox.polar.sh> (test card `4242 4242 4242 4242`)

`POLAR_ENVIRONMENT=sandbox` points the app at the sandbox API. Anything else
(or unset) means production. A sandbox token does not work against production
and vice versa.

## One-time Polar dashboard setup (do this in each environment you use)

1. **Create the organization** and finish onboarding. In production, also
   complete the account review / payout setup under **Finance**; Polar must
   approve the account before it pays out.
2. **Create two products** (Products → New product), both *Subscription*,
   billed *monthly*, fixed price, USD:
   - `GHL Hire Basic` — $29.99 / month
   - `GHL Hire Premium` — $59.99 / month
3. **Copy each product ID** (product page → ⋯ → Copy Product ID).
4. **Create an organization access token**: Settings → Developers → New token.
   Scopes: `checkouts:write`, `customer_sessions:write` (read scopes are fine
   to add). Copy it once; it is not shown again.
5. **Create a webhook endpoint**: Settings → Webhooks → Add endpoint.
   - URL: `https://ghlhire.com/api/payments/webhook`
   - Format: **Raw**
   - Secret: generate one and copy it
   - Events: `order.paid`, `subscription.active`, `subscription.updated`,
     `subscription.canceled`, `subscription.uncanceled`,
     `subscription.past_due`, `subscription.revoked`
6. **Subscription settings** (Settings → Billing/Subscriptions): leave
   "allow multiple subscriptions" **off**, and allow customers to change plans
   in the customer portal. The app sends existing subscribers to the portal for
   plan changes instead of opening a second checkout.

## Environment variables

Set in `.env.local` (development) and on Netlify (site `ghlhire`):

```bash
POLAR_ACCESS_TOKEN=<token from step 4>
POLAR_WEBHOOK_SECRET=<secret from step 5>
POLAR_PRODUCT_ID_BASIC=<product id from step 3>
POLAR_PRODUCT_ID_PREMIUM=<product id from step 3>
POLAR_ENVIRONMENT=production   # or sandbox
```

All five are server-only (no `NEXT_PUBLIC_` prefix). `SUPABASE_SERVICE_ROLE_KEY`
and `NEXT_PUBLIC_APP_URL` must also be set, as before.

Remove the old `WHOP_API_KEY`, `WHOP_WEBHOOK_SECRET`, `WHOP_PRODUCT_ID`,
`NEXT_PUBLIC_WHOP_PLAN_ID_BASIC` and `NEXT_PUBLIC_WHOP_PLAN_ID_PREMIUM`, and
delete the Whop webhook, once Polar is verified.

## Database

Migration [`023_polar_payments.sql`](../../supabase/migrations/023_polar_payments.sql)
changes the `provider` column defaults to `polar`, relabels free-plan rows, and
adds the unique index `uniq_invoices_polar_order_id` that backs webhook
idempotency. Apply it before going live.

## Testing

1. In the sandbox, do the dashboard setup above with the webhook URL pointing
   at a tunnel to `localhost:3000` (e.g. `ngrok http 3000`) or a deploy preview.
2. Set the sandbox values in `.env.local` with `POLAR_ENVIRONMENT=sandbox`.
3. Sign in as an employer, pick Basic on `/pricing`, pay with `4242 4242 4242 4242`.
4. Check: `subscriptions` row is `basic` / `active` / provider `polar` with the
   Polar period dates; one `invoices` row and one succeeded
   `payment_transactions` row exist; `/company/dashboard/billing` shows the plan.
5. Click **Manage Subscription**, switch to Premium, then cancel. The row should
   move to `premium`, then `cancel_at_period_end = true`; revoking the
   subscription from the Polar dashboard should drop the company to `free`.
6. Redeliver an `order.paid` event from the Polar dashboard: no duplicate
   invoice or transaction should appear.

## Key implementation files

| Concern | File |
|---|---|
| Plan config (client-safe) | `src/lib/payments/plans.ts` |
| Polar client, checkout, portal, product mapping | `src/lib/payments/polar.ts` |
| Checkout API (session-authenticated) | `src/app/api/payments/create-checkout/route.ts` |
| Customer portal API | `src/app/api/payments/portal/route.ts` |
| Webhook | `src/app/api/payments/webhook/route.ts` |
| Billing page | `src/app/company/dashboard/billing/page.tsx` |
| Migration | `supabase/migrations/023_polar_payments.sql` |
