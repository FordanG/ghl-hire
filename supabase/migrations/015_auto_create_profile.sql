-- Auto-create Profile/Company on User Signup
-- Migration: 015_auto_create_profile
-- Description: Automatically create profile or company record when user signs up

-- =====================================================
-- FUNCTION: Auto-create profile or company
-- =====================================================

-- This function automatically creates a profile or company record
-- when a new user signs up, using metadata from the auth.users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role TEXT;
  user_full_name TEXT;
  user_company_name TEXT;
  user_email TEXT;
BEGIN
  -- Get user metadata
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'jobseeker');
  user_full_name := NEW.raw_user_meta_data->>'full_name';
  user_company_name := NEW.raw_user_meta_data->>'company_name';
  user_email := NEW.email;

  -- Create profile or company based on role
  IF user_role = 'jobseeker' THEN
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (
      NEW.id,
      COALESCE(user_full_name, split_part(user_email, '@', 1)),
      user_email
    );
  ELSIF user_role = 'employer' THEN
    INSERT INTO public.companies (user_id, company_name, email)
    VALUES (
      NEW.id,
      COALESCE(user_company_name, user_full_name, split_part(user_email, '@', 1)),
      user_email
    );
  END IF;

  RETURN NEW;
END;
$$;

-- =====================================================
-- TRIGGER: Execute on new user signup
-- =====================================================

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create profile/company on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- COMMENT
-- =====================================================

COMMENT ON FUNCTION public.handle_new_user() IS
  'Automatically creates a profile or company record when a new user signs up, based on the role in user metadata';
