'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ApplyJobModal from '@/components/ApplyJobModal';

interface JobDetailClientProps {
  job: {
    id: string;
    title: string;
    applications_count: number;
    status?: string | null;
    expires_at?: string | null;
    apply_url?: string | null;
    company: { company_name: string } | null;
  };
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if job is saved and if user has applied
  useEffect(() => {
    const checkStatus = async () => {
      // Wait for the session and profile to load. Until then `profile` is
      // empty even for a signed-in job seeker.
      if (authLoading) return;

      if (!profile) {
        setLoading(false);
        return;
      }

      try {
        // Check if saved
        const { data: savedData } = await supabase
          .from('saved_jobs')
          .select('id')
          .eq('profile_id', profile.id)
          .eq('job_id', job.id)
          .single();

        setIsSaved(!!savedData);

        // Check if applied
        const { data: appData } = await supabase
          .from('applications')
          .select('id')
          .eq('profile_id', profile.id)
          .eq('job_id', job.id)
          .single();

        setHasApplied(!!appData);
      } catch (error) {
        console.error('Error checking status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [authLoading, profile, job.id]);

  const isClosed =
    (!!job.status && job.status !== 'active') ||
    (!!job.expires_at && new Date(job.expires_at).getTime() < Date.now());

  const handleApply = () => {
    if (isClosed || authLoading) return;
    if (!user) {
      router.push(`/signin?redirect=/jobs/${job.id}`);
      return;
    }

    if (!profile) {
      alert('Only job seekers can apply to jobs. Please sign up as a job seeker.');
      return;
    }

    setShowApplyModal(true);
  };

  const handleSave = async () => {
    if (authLoading) return;
    if (!user) {
      router.push(`/signin?redirect=/jobs/${job.id}`);
      return;
    }

    if (!profile) {
      alert('Only job seekers can save jobs.');
      return;
    }

    setSaving(true);

    try {
      if (isSaved) {
        // Unsave
        await supabase
          .from('saved_jobs')
          .delete()
          .eq('profile_id', profile.id)
          .eq('job_id', job.id);

        setIsSaved(false);
      } else {
        // Save
        await supabase
          .from('saved_jobs')
          .insert({
            profile_id: profile.id,
            job_id: job.id,
          });

        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleApplicationSuccess = () => {
    setHasApplied(true);
    // The application count is maintained by a database trigger.
    router.refresh();
  };

  const primary =
    'press inline-flex h-12 w-full items-center justify-center rounded-md bg-brand px-6 text-base font-semibold text-white transition-colors hover:bg-brand-dark';

  return (
    <>
      <div className="flex flex-col gap-3">
        {isClosed ? (
          <div className="rounded-md bg-white px-4 py-3 text-center text-[15px] font-semibold text-ink-soft ring-1 ring-rule">
            This role is no longer accepting applications
          </div>
        ) : job.apply_url ? (
          <a href={job.apply_url} target="_blank" rel="noopener noreferrer nofollow" className={primary}>
            Apply on employer site
          </a>
        ) : hasApplied ? (
          <div role="status" className="rounded-md bg-emerald-50 px-4 py-3 text-center text-[15px] font-semibold text-emerald-800">
            You applied for this role
          </div>
        ) : (
          <button onClick={handleApply} disabled={loading} className={`${primary} disabled:opacity-70`}>
            Apply now
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          aria-pressed={isSaved}
          className="press inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-rule bg-white px-6 text-base font-semibold text-ink transition-colors hover:bg-brand-soft disabled:opacity-50"
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="h-5 w-5 text-brand" />
              Saved
            </>
          ) : (
            <>
              <Bookmark className="h-5 w-5" />
              Save job
            </>
          )}
        </button>
      </div>

      {showApplyModal && !isClosed && (
        <ApplyJobModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </>
  );
}
