import { supabase } from '@/lib/supabase';
import { CONTACT_EMAIL } from '@/lib/site';

/**
 * Sends a public form (newsletter signup, featured request, contact) to the
 * `site-forms` Supabase Edge Function. Browser only. Returns an error message
 * to show, or null on success.
 */
export async function submitSiteForm(
  kind: 'subscribe' | 'featured' | 'contact',
  fields: Record<string, unknown>
): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('site-forms', { body: { kind, ...fields } });
    if (error) throw error;
    if (data?.ok) return null;
    return typeof data?.error === 'string' ? data.error : 'That did not go through. Please try again.';
  } catch (error) {
    console.error('Form submit failed:', error);
    return `That did not go through. Please try again, or email ${CONTACT_EMAIL}.`;
  }
}
