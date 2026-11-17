import { createClient } from '@supabase/supabase-js';

/**
 * Cookie-less anon client for public, read-only data in Server Components
 * (job board, sitemap). It never touches the session, so pages that use it
 * can be cached and revalidated instead of rendering per request.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
