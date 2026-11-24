-- 026: Create the right account type on signup (2026-11-24)
--
-- handle_new_user() read raw_user_meta_data->>'role', but the signup form
-- stores the choice as 'user_type'. Every signup therefore fell through to
-- the 'jobseeker' default and got a profile, including employers. With email
-- confirmation on there is no session after signUp, so the client-side
-- fallback (/api/auth/create-profile) could not create the company either.
--
-- The trigger now reads 'role' first and falls back to 'user_type', and
-- carries the optional signup fields across.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
LANGUAGE plpgsql
AS $$
DECLARE
  meta JSONB := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  user_role TEXT;
  user_full_name TEXT;
  user_company_name TEXT;
  user_phone TEXT;
  user_location TEXT;
  email_name TEXT := split_part(NEW.email, '@', 1);
BEGIN
  user_role := COALESCE(NULLIF(meta->>'role', ''), NULLIF(meta->>'user_type', ''), 'jobseeker');
  user_full_name := NULLIF(btrim(meta->>'full_name'), '');
  user_company_name := NULLIF(btrim(meta->>'company_name'), '');
  user_phone := NULLIF(btrim(meta->>'phone'), '');
  user_location := NULLIF(btrim(meta->>'location'), '');

  IF user_role = 'employer' THEN
    IF NOT EXISTS (SELECT 1 FROM public.companies WHERE user_id = NEW.id) THEN
      INSERT INTO public.companies (user_id, company_name, email, location)
      VALUES (
        NEW.id,
        COALESCE(user_company_name, user_full_name, email_name),
        NEW.email,
        user_location
      );
    END IF;
  ELSIF user_role = 'jobseeker' THEN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = NEW.id) THEN
      INSERT INTO public.profiles (user_id, full_name, email, phone, location)
      VALUES (
        NEW.id,
        COALESCE(user_full_name, email_name),
        NEW.email,
        user_phone,
        user_location
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Creates a profile (job seeker) or company (employer) for a new auth user, from the role / user_type signup metadata';
