-- Switch payment provider from Maya to Whop
-- 1. Rename Maya-specific columns to provider-agnostic names
-- 2. Drop wide-open "System can ..." RLS policies (the service role bypasses RLS;
--    these policies let any client write to subscriptions/invoices/transactions)
-- 3. Enforce job-post limits server-side via trigger

-- Provider-agnostic columns
ALTER TABLE subscriptions RENAME COLUMN maya_customer_id TO provider_customer_id;
ALTER TABLE subscriptions RENAME COLUMN maya_subscription_id TO provider_subscription_id;
ALTER TABLE subscriptions RENAME COLUMN maya_plan_id TO provider_plan_id;
ALTER TABLE subscriptions ADD COLUMN provider TEXT NOT NULL DEFAULT 'whop';

ALTER TABLE payment_transactions RENAME COLUMN maya_checkout_id TO provider_checkout_id;
ALTER TABLE payment_transactions RENAME COLUMN maya_payment_id TO provider_payment_id;
ALTER TABLE payment_transactions ADD COLUMN provider TEXT NOT NULL DEFAULT 'whop';

ALTER INDEX idx_subscriptions_maya_subscription_id RENAME TO idx_subscriptions_provider_subscription_id;
ALTER INDEX idx_payment_transactions_maya_checkout_id RENAME TO idx_payment_transactions_provider_checkout_id;

-- Remove permissive RLS policies: server-side writes use the service role, which
-- bypasses RLS. USING (true) policies allowed any client to self-upgrade plans.
DROP POLICY IF EXISTS "System can manage subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "System can insert transactions" ON payment_transactions;
DROP POLICY IF EXISTS "System can manage invoices" ON invoices;

-- Server-side job post limit enforcement. The client-side check in /post-job is
-- advisory only; this trigger is the real gate. Limits apply to jobs entering
-- 'active' status (drafts are free).
CREATE OR REPLACE FUNCTION enforce_job_post_limit() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'active' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'active') THEN
        IF NOT COALESCE(can_company_post_job(NEW.company_id), false) THEN
            RAISE EXCEPTION 'JOB_POST_LIMIT_REACHED'
                USING HINT = 'Upgrade your plan to post more jobs.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_job_post_limit_trigger
    BEFORE INSERT OR UPDATE OF status ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION enforce_job_post_limit();
