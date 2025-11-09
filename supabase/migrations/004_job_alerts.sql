-- Job Alerts Table
CREATE TABLE IF NOT EXISTS job_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    keywords TEXT[],
    location TEXT,
    job_type TEXT,
    experience_level TEXT,
    remote_only BOOLEAN DEFAULT false,
    salary_min INTEGER,
    frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'instant')),
    is_active BOOLEAN DEFAULT true,
    last_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX idx_job_alerts_profile_id ON job_alerts(profile_id);
CREATE INDEX idx_job_alerts_is_active ON job_alerts(is_active);
CREATE INDEX idx_job_alerts_frequency ON job_alerts(frequency);

-- Trigger for updated_at
CREATE TRIGGER update_job_alerts_updated_at
    BEFORE UPDATE ON job_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;

-- Users can view their own job alerts
CREATE POLICY "Users can view their own job alerts"
    ON job_alerts FOR SELECT
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Users can create their own job alerts
CREATE POLICY "Users can create their own job alerts"
    ON job_alerts FOR INSERT
    WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Users can update their own job alerts
CREATE POLICY "Users can update their own job alerts"
    ON job_alerts FOR UPDATE
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Users can delete their own job alerts
CREATE POLICY "Users can delete their own job alerts"
    ON job_alerts FOR DELETE
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
