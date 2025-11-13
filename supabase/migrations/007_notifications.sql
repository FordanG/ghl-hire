-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'application_received',
        'application_status_changed',
        'new_job_match',
        'job_alert',
        'message_received',
        'profile_viewed',
        'job_expired',
        'interview_scheduled',
        'saved_job_update',
        'system_announcement'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,

    -- Email notifications
    email_application_updates BOOLEAN DEFAULT true,
    email_new_matches BOOLEAN DEFAULT true,
    email_job_alerts BOOLEAN DEFAULT true,
    email_messages BOOLEAN DEFAULT true,
    email_marketing BOOLEAN DEFAULT false,

    -- In-app notifications
    inapp_application_updates BOOLEAN DEFAULT true,
    inapp_new_matches BOOLEAN DEFAULT true,
    inapp_job_alerts BOOLEAN DEFAULT true,
    inapp_messages BOOLEAN DEFAULT true,
    inapp_system BOOLEAN DEFAULT true,

    -- Frequency
    digest_frequency TEXT DEFAULT 'daily' CHECK (digest_frequency IN ('instant', 'daily', 'weekly', 'never')),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_notifications_profile_id ON notifications(profile_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_profile_unread ON notifications(profile_id, is_read) WHERE is_read = false;

CREATE INDEX idx_notification_preferences_profile_id ON notification_preferences(profile_id);

-- Trigger for updated_at
CREATE TRIGGER update_notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own notifications"
    ON notifications FOR DELETE
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "System can insert notifications"
    ON notifications FOR INSERT
    WITH CHECK (true);

-- RLS Policies for Notification Preferences
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification preferences"
    ON notification_preferences FOR SELECT
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own notification preferences"
    ON notification_preferences FOR INSERT
    WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own notification preferences"
    ON notification_preferences FOR UPDATE
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_profile_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_link TEXT DEFAULT NULL,
    p_data JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
    v_preferences RECORD;
BEGIN
    -- Check user's notification preferences
    SELECT * INTO v_preferences
    FROM notification_preferences
    WHERE profile_id = p_profile_id;

    -- If no preferences exist, create default ones
    IF v_preferences IS NULL THEN
        INSERT INTO notification_preferences (profile_id)
        VALUES (p_profile_id)
        RETURNING * INTO v_preferences;
    END IF;

    -- Check if this type of in-app notification is enabled
    CASE p_type
        WHEN 'application_received', 'application_status_changed' THEN
            IF NOT v_preferences.inapp_application_updates THEN
                RETURN NULL;
            END IF;
        WHEN 'new_job_match' THEN
            IF NOT v_preferences.inapp_new_matches THEN
                RETURN NULL;
            END IF;
        WHEN 'job_alert' THEN
            IF NOT v_preferences.inapp_job_alerts THEN
                RETURN NULL;
            END IF;
        WHEN 'message_received' THEN
            IF NOT v_preferences.inapp_messages THEN
                RETURN NULL;
            END IF;
        WHEN 'system_announcement' THEN
            IF NOT v_preferences.inapp_system THEN
                RETURN NULL;
            END IF;
        ELSE
            -- Allow other types by default
            NULL;
    END CASE;

    -- Insert notification
    INSERT INTO notifications (profile_id, type, title, message, link, data)
    VALUES (p_profile_id, p_type, p_title, p_message, p_link, p_data)
    RETURNING id INTO v_notification_id;

    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID) RETURNS void AS $$
BEGIN
    UPDATE notifications
    SET is_read = true, read_at = NOW()
    WHERE id = p_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_profile_id UUID) RETURNS void AS $$
BEGIN
    UPDATE notifications
    SET is_read = true, read_at = NOW()
    WHERE profile_id = p_profile_id AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification when application status changes
CREATE OR REPLACE FUNCTION notify_application_status_change() RETURNS TRIGGER AS $$
DECLARE
    v_job_title TEXT;
    v_company_name TEXT;
BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        -- Get job title and company name
        SELECT j.title, c.company_name INTO v_job_title, v_company_name
        FROM jobs j
        JOIN companies c ON j.company_id = c.id
        WHERE j.id = NEW.job_id;

        -- Notify job seeker
        PERFORM create_notification(
            NEW.profile_id,
            'application_status_changed',
            'Application Status Updated',
            format('Your application for %s at %s has been updated to: %s', v_job_title, v_company_name, NEW.status),
            format('/applications/%s', NEW.id),
            jsonb_build_object('application_id', NEW.id, 'job_id', NEW.job_id, 'status', NEW.status)
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER application_status_change_notification
    AFTER UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION notify_application_status_change();

-- Trigger to notify employer of new application
CREATE OR REPLACE FUNCTION notify_new_application() RETURNS TRIGGER AS $$
DECLARE
    v_job_title TEXT;
    v_company_user_id UUID;
    v_company_profile_id UUID;
    v_candidate_name TEXT;
BEGIN
    -- Get job details, company user_id, and candidate name
    SELECT j.title, c.user_id, p.full_name
    INTO v_job_title, v_company_user_id, v_candidate_name
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    JOIN profiles p ON p.id = NEW.profile_id
    WHERE j.id = NEW.job_id;

    -- Get company's profile ID from their user_id
    SELECT id INTO v_company_profile_id
    FROM profiles
    WHERE user_id = v_company_user_id;

    -- Notify employer if they have a profile
    IF v_company_profile_id IS NOT NULL THEN
        PERFORM create_notification(
            v_company_profile_id,
            'application_received',
            'New Application Received',
            format('%s applied for %s', v_candidate_name, v_job_title),
            format('/company/applications/%s', NEW.id),
            jsonb_build_object('application_id', NEW.id, 'job_id', NEW.job_id, 'profile_id', NEW.profile_id)
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER new_application_notification
    AFTER INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_application();
