-- Switch payment provider from Whop to Polar.
-- Verified before writing: production has no paid Whop subscriptions (all rows
-- are on the free plan), so there is no billing state to migrate.

-- New rows default to Polar
ALTER TABLE subscriptions ALTER COLUMN provider SET DEFAULT 'polar';
ALTER TABLE payment_transactions ALTER COLUMN provider SET DEFAULT 'polar';

-- Free-plan rows have no provider relationship; relabel them so the column
-- reflects the provider any future upgrade will go through. Historical
-- payment_transactions keep provider = 'whop'.
UPDATE subscriptions
SET provider = 'polar'
WHERE provider = 'whop'
  AND plan_type = 'free'
  AND provider_subscription_id IS NULL;

-- Webhook idempotency: one invoice per Polar order. The handler's guard is
-- read-then-write, so this index is the final arbiter for concurrent
-- redeliveries (same role uniq_invoices_whop_payment_id played for Whop).
CREATE UNIQUE INDEX IF NOT EXISTS uniq_invoices_polar_order_id
    ON invoices ((metadata->>'polar_order_id'))
    WHERE metadata->>'polar_order_id' IS NOT NULL;
