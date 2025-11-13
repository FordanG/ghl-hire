// Re-export Supabase client and types
export { createClient } from './client';
import type { Database } from '@/types/supabase';
export type { Database };

// Re-export commonly used types for convenience
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Company = Database['public']['Tables']['companies']['Row'];
export type Job = Database['public']['Tables']['jobs']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];

// Create a singleton instance for client-side usage
import { createClient as createBrowserClient } from './client';
export const supabase = createBrowserClient();
