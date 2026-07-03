-- Fix "infinite recursion detected in policy for relation admin_roles":
-- the old policies queried admin_roles inside their own USING clause, so every
-- SELECT on admin_roles errored - including the admin moderation page's
-- access check, locking out genuine admins.

DROP POLICY IF EXISTS "Admins can view admin roles" ON admin_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON admin_roles;

-- SECURITY DEFINER lookup runs as the table owner, bypassing RLS on
-- admin_roles and breaking the recursion.
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_roles ar
        JOIN profiles p ON ar.profile_id = p.id
        WHERE p.user_id = p_user_id AND ar.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION is_admin(UUID) FROM anon;

-- Users can see their own role row (the moderation page checks this)
CREATE POLICY "Users can view their own admin role"
    ON admin_roles FOR SELECT
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Admins can see and manage all roles
CREATE POLICY "Admins can view all admin roles"
    ON admin_roles FOR SELECT
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage roles"
    ON admin_roles FOR ALL
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));
