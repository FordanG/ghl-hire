-- Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ticket_number TEXT UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'technical',
        'billing',
        'account',
        'job_posting',
        'applications',
        'other'
    )),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
        'open',
        'in_progress',
        'waiting_customer',
        'waiting_internal',
        'resolved',
        'closed'
    )),
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    n8n_workflow_id TEXT, -- ID from n8n workflow
    external_ticket_id TEXT, -- ID from external ticketing system
    metadata JSONB DEFAULT '{}'::jsonb,
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket Messages Table
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_support_tickets_profile_id ON support_tickets(profile_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_ticket_number ON support_tickets(ticket_number);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at DESC);

CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_created_at ON ticket_messages(created_at ASC);

-- Triggers
CREATE TRIGGER update_support_tickets_updated_at
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number() RETURNS TEXT AS $$
DECLARE
    v_year TEXT;
    v_count INTEGER;
    v_ticket_number TEXT;
BEGIN
    v_year := TO_CHAR(NOW(), 'YYYY');

    -- Get count of tickets created this year
    SELECT COUNT(*) + 1 INTO v_count
    FROM support_tickets
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());

    -- Format: TICKET-YYYY-NNNN
    v_ticket_number := 'TICKET-' || v_year || '-' || LPAD(v_count::TEXT, 4, '0');

    RETURN v_ticket_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ticket number
CREATE OR REPLACE FUNCTION set_ticket_number() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL THEN
        NEW.ticket_number := generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_generate_ticket_number
    BEFORE INSERT ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION set_ticket_number();

-- RLS Policies for Support Tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets"
    ON support_tickets FOR SELECT
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create tickets"
    ON support_tickets FOR INSERT
    WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own tickets"
    ON support_tickets FOR UPDATE
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Support staff can view all tickets"
    ON support_tickets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar
            JOIN profiles p ON ar.profile_id = p.id
            WHERE p.user_id = auth.uid()
            AND ar.role IN ('admin', 'moderator', 'support')
        )
    );

CREATE POLICY "Support staff can update all tickets"
    ON support_tickets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar
            JOIN profiles p ON ar.profile_id = p.id
            WHERE p.user_id = auth.uid()
            AND ar.role IN ('admin', 'moderator', 'support')
        )
    );

-- RLS Policies for Ticket Messages
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their tickets"
    ON ticket_messages FOR SELECT
    USING (
        ticket_id IN (
            SELECT id FROM support_tickets
            WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
        )
        AND is_internal = false
    );

CREATE POLICY "Users can create messages for their tickets"
    ON ticket_messages FOR INSERT
    WITH CHECK (
        ticket_id IN (
            SELECT id FROM support_tickets
            WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
        )
    );

CREATE POLICY "Support staff can view all messages"
    ON ticket_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar
            JOIN profiles p ON ar.profile_id = p.id
            WHERE p.user_id = auth.uid()
            AND ar.role IN ('admin', 'moderator', 'support')
        )
    );

CREATE POLICY "Support staff can create messages"
    ON ticket_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_roles ar
            JOIN profiles p ON ar.profile_id = p.id
            WHERE p.user_id = auth.uid()
            AND ar.role IN ('admin', 'moderator', 'support')
        )
    );
