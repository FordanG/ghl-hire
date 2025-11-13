-- Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email_address TEXT NOT NULL,
    email_type TEXT NOT NULL,
    subject TEXT,
    resend_id TEXT,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_email_address ON email_logs(email_address);
CREATE INDEX idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_created_at ON email_logs(created_at DESC);
CREATE INDEX idx_email_logs_resend_id ON email_logs(resend_id) WHERE resend_id IS NOT NULL;

-- RLS Policies
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email logs"
    ON email_logs FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "System can insert email logs"
    ON email_logs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "System can update email logs"
    ON email_logs FOR UPDATE
    USING (true);

-- Function to get email statistics
CREATE OR REPLACE FUNCTION get_email_stats(
    p_user_id UUID DEFAULT NULL,
    p_days INTEGER DEFAULT 30
) RETURNS TABLE (
    total_sent BIGINT,
    total_delivered BIGINT,
    total_opened BIGINT,
    total_clicked BIGINT,
    total_bounced BIGINT,
    open_rate NUMERIC,
    click_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) FILTER (WHERE status = 'sent' OR status = 'delivered')::BIGINT,
        COUNT(*) FILTER (WHERE status = 'delivered')::BIGINT,
        COUNT(*) FILTER (WHERE status = 'opened')::BIGINT,
        COUNT(*) FILTER (WHERE status = 'clicked')::BIGINT,
        COUNT(*) FILTER (WHERE status = 'bounced')::BIGINT,
        ROUND(
            (COUNT(*) FILTER (WHERE status = 'opened')::NUMERIC /
            NULLIF(COUNT(*) FILTER (WHERE status = 'sent' OR status = 'delivered'), 0)) * 100,
            2
        ) as open_rate,
        ROUND(
            (COUNT(*) FILTER (WHERE status = 'clicked')::NUMERIC /
            NULLIF(COUNT(*) FILTER (WHERE status = 'sent' OR status = 'delivered'), 0)) * 100,
            2
        ) as click_rate
    FROM email_logs
    WHERE (p_user_id IS NULL OR user_id = p_user_id)
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
