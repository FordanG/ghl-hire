'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Counts a view from the browser, straight to Supabase. The job page itself
 * is prebuilt, so counting on the server would mean rendering it per visit.
 */
export default function ViewCounter({ jobId }: { jobId: string }) {
  useEffect(() => {
    const key = `viewed-job-${jobId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // Storage blocked: count the view anyway.
    }
    supabase.rpc('increment_job_views', { job_id: jobId }).then(({ error }) => {
      if (error) console.error('View count failed:', error.message);
    });
  }, [jobId]);

  return null;
}
