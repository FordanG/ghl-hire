-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL UNIQUE,
    plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'basic', 'premium', 'enterprise')),

    -- Maya payment details
    maya_customer_id TEXT,
    maya_subscription_id TEXT,
    maya_plan_id TEXT,

    -- Subscription status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'incomplete', 'incomplete_expired')),

    -- Billing period
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
    trial_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,

    -- Usage limits
    job_post_limit INTEGER DEFAULT 1,
    featured_job_limit INTEGER DEFAULT 0,
    team_member_limit INTEGER DEFAULT 1,

    -- Pricing
    price_cents INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    billing_interval TEXT DEFAULT 'month' CHECK (billing_interval IN ('month', 'year')),

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

    -- Maya transaction details
    maya_checkout_id TEXT,
    maya_payment_id TEXT,
    reference_number TEXT UNIQUE,

    -- Transaction info
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded')),
    payment_method TEXT, -- 'card', 'gcash', 'paymaya_wallet', etc.

    -- Transaction type
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('subscription', 'addon', 'one_time')),
    description TEXT,

    -- Timestamps
    paid_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,

    -- Failure details
    failure_code TEXT,
    failure_message TEXT,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

    -- Invoice details
    invoice_number TEXT UNIQUE NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),

    -- Billing details
    billing_period_start TIMESTAMP WITH TIME ZONE,
    billing_period_end TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,

    -- Line items
    line_items JSONB DEFAULT '[]'::jsonb,

    -- PDF URL
    pdf_url TEXT,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_subscriptions_company_id ON subscriptions(company_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX idx_subscriptions_maya_subscription_id ON subscriptions(maya_subscription_id) WHERE maya_subscription_id IS NOT NULL;

CREATE INDEX idx_payment_transactions_company_id ON payment_transactions(company_id);
CREATE INDEX idx_payment_transactions_subscription_id ON payment_transactions(subscription_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_maya_checkout_id ON payment_transactions(maya_checkout_id) WHERE maya_checkout_id IS NOT NULL;
CREATE INDEX idx_payment_transactions_reference_number ON payment_transactions(reference_number);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at DESC);

CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_invoices_subscription_id ON invoices(subscription_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_created_at ON invoices(created_at DESC);

-- Triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can view their own subscription"
    ON subscriptions FOR SELECT
    USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

CREATE POLICY "System can manage subscriptions"
    ON subscriptions FOR ALL
    USING (true)
    WITH CHECK (true);

-- RLS Policies for Payment Transactions
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can view their own transactions"
    ON payment_transactions FOR SELECT
    USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

CREATE POLICY "System can insert transactions"
    ON payment_transactions FOR INSERT
    WITH CHECK (true);

-- RLS Policies for Invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can view their own invoices"
    ON invoices FOR SELECT
    USING (company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

CREATE POLICY "System can manage invoices"
    ON invoices FOR ALL
    USING (true)
    WITH CHECK (true);

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number() RETURNS TEXT AS $$
DECLARE
    v_year TEXT;
    v_month TEXT;
    v_count INTEGER;
    v_invoice_number TEXT;
BEGIN
    v_year := TO_CHAR(NOW(), 'YYYY');
    v_month := TO_CHAR(NOW(), 'MM');

    -- Get count of invoices this month
    SELECT COUNT(*) + 1 INTO v_count
    FROM invoices
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW())
    AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW());

    -- Format: INV-YYYY-MM-NNNN
    v_invoice_number := 'INV-' || v_year || '-' || v_month || '-' || LPAD(v_count::TEXT, 4, '0');

    RETURN v_invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate invoice number
CREATE OR REPLACE FUNCTION set_invoice_number() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_generate_invoice_number
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION set_invoice_number();

-- Function to create free subscription for new companies
CREATE OR REPLACE FUNCTION create_free_subscription() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO subscriptions (
        company_id,
        plan_type,
        status,
        job_post_limit,
        featured_job_limit,
        team_member_limit,
        price_cents,
        current_period_end
    ) VALUES (
        NEW.id,
        'free',
        'active',
        1,
        0,
        1,
        0,
        NOW() + INTERVAL '1000 years' -- Free plan never expires
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_free_subscription_on_company_create
    AFTER INSERT ON companies
    FOR EACH ROW
    EXECUTE FUNCTION create_free_subscription();

-- Function to check if company can post job
CREATE OR REPLACE FUNCTION can_company_post_job(p_company_id UUID) RETURNS BOOLEAN AS $$
DECLARE
    v_current_jobs INTEGER;
    v_job_limit INTEGER;
BEGIN
    -- Get current active job count
    SELECT COUNT(*) INTO v_current_jobs
    FROM jobs
    WHERE company_id = p_company_id
    AND status = 'active';

    -- Get subscription limit
    SELECT job_post_limit INTO v_job_limit
    FROM subscriptions
    WHERE company_id = p_company_id;

    -- -1 means unlimited
    IF v_job_limit = -1 THEN
        RETURN true;
    END IF;

    RETURN v_current_jobs < v_job_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
