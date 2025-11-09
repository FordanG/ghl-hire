-- Content Reports Table
CREATE TABLE IF NOT EXISTS content_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('job', 'profile', 'application', 'blog_post', 'comment')),
    content_id UUID NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN (
        'spam',
        'inappropriate',
        'misleading',
        'harassment',
        'discrimination',
        'fake',
        'other'
    )),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
    resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolution_note TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moderation Actions Table
CREATE TABLE IF NOT EXISTS moderation_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES content_reports(id) ON DELETE CASCADE,
    moderator_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN (
        'warning',
        'content_removed',
        'account_suspended',
        'account_banned',
        'content_approved',
        'report_dismissed'
    )),
    target_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    duration_days INTEGER, -- For suspensions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Roles Table (for managing admin access)
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'moderator' CHECK (role IN ('admin', 'moderator', 'support')),
    permissions JSONB DEFAULT '[]'::jsonb,
    granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_content_reports_status ON content_reports(status);
CREATE INDEX idx_content_reports_content_type ON content_reports(content_type);
CREATE INDEX idx_content_reports_content_id ON content_reports(content_id);
CREATE INDEX idx_content_reports_reporter ON content_reports(reporter_profile_id);
CREATE INDEX idx_content_reports_created_at ON content_reports(created_at DESC);

CREATE INDEX idx_moderation_actions_report_id ON moderation_actions(report_id);
CREATE INDEX idx_moderation_actions_moderator ON moderation_actions(moderator_profile_id);
CREATE INDEX idx_moderation_actions_target ON moderation_actions(target_profile_id);
CREATE INDEX idx_moderation_actions_created_at ON moderation_actions(created_at DESC);

CREATE INDEX idx_admin_roles_profile_id ON admin_roles(profile_id);

-- Triggers
CREATE TRIGGER update_content_reports_updated_at
    BEFORE UPDATE ON content_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for Content Reports
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
    ON content_reports FOR SELECT
    USING (reporter_profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create reports"
    ON content_reports FOR INSERT
    WITH CHECK (reporter_profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all reports"
    ON content_reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar
            JOIN profiles p ON ar.profile_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update reports"
    ON content_reports FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar
            JOIN profiles p ON ar.profile_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- RLS Policies for Moderation Actions
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view moderation actions"
    ON moderation_actions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar
            JOIN profiles p ON ar.profile_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can create moderation actions"
    ON moderation_actions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_roles ar
            JOIN profiles p ON ar.profile_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- RLS Policies for Admin Roles
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin roles"
    ON admin_roles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar
            JOIN profiles p ON ar.profile_id = p.id
            WHERE p.user_id = auth.uid()
            AND ar.role = 'admin'
        )
    );

CREATE POLICY "Only admins can manage roles"
    ON admin_roles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar
            JOIN profiles p ON ar.profile_id = p.id
            WHERE p.user_id = auth.uid()
            AND ar.role = 'admin'
        )
    );

-- Function to check if user is admin/moderator
CREATE OR REPLACE FUNCTION is_admin_or_moderator(p_user_id UUID) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_roles ar
        JOIN profiles p ON ar.profile_id = p.id
        WHERE p.user_id = p_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to resolve a report
CREATE OR REPLACE FUNCTION resolve_content_report(
    p_report_id UUID,
    p_moderator_profile_id UUID,
    p_action_type TEXT,
    p_reason TEXT,
    p_resolution_note TEXT DEFAULT NULL
) RETURNS void AS $$
BEGIN
    -- Update report status
    UPDATE content_reports
    SET
        status = 'resolved',
        resolved_by = p_moderator_profile_id,
        resolution_note = p_resolution_note,
        resolved_at = NOW()
    WHERE id = p_report_id;

    -- Create moderation action
    INSERT INTO moderation_actions (
        report_id,
        moderator_profile_id,
        action_type,
        reason
    ) VALUES (
        p_report_id,
        p_moderator_profile_id,
        p_action_type,
        p_reason
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
