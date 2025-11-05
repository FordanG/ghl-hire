'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bookmark, ExternalLink, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ApplyJobModal from '@/components/ApplyJobModal';

interface JobDetailClientProps {
  job: any;
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if job is saved and if user has applied
  useState(() => {
    const checkStatus = async () => {
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
  });

  const handleApply = () => {
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
    // Increment view count
    supabase
      .from('jobs')
      .update({ applications_count: job.applications_count + 1 })
      .eq('id', job.id)
      .then(() => router.refresh());
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 lg:flex-col fade-in fade-in-5">
        {hasApplied ? (
          <div className="px-6 py-3 bg-green-100 text-green-800 font-semibold rounded-lg text-center">
            ✓ Applied
          </div>
        ) : (
          <button
            onClick={handleApply}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Apply Now
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-5 h-5 text-blue-600" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-5 h-5" />
              <span>Save Job</span>
            </>
          )}
        </button>
      </div>

      {showApplyModal && (
        <ApplyJobModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </>
  );
}
