'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Loader2 } from 'lucide-react';
import { toggleSaveJob, isJobSaved } from '@/lib/actions/saved-jobs-actions';

interface SaveJobButtonProps {
  jobId: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SaveJobButton({
  jobId,
  className = '',
  showLabel = false,
  size = 'md'
}: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check initial saved status
  useEffect(() => {
    const checkSavedStatus = async () => {
      const result = await isJobSaved(jobId);
      if (result.success) {
        setIsSaved(result.isSaved || false);
      }
      setChecking(false);
    };

    checkSavedStatus();
  }, [jobId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

    const result = await toggleSaveJob(jobId);

    if (result.success) {
      setIsSaved(result.isSaved || false);
    }

    setLoading(false);
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (checking) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center justify-center gap-2 rounded-lg text-gray-400 ${sizeClasses[size]} ${className}`}
      >
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
        {showLabel && <span className="text-sm">Loading...</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] ${
        isSaved
          ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
      } ${sizeClasses[size]} ${className}`}
      title={isSaved ? 'Remove from saved' : 'Save job'}
      aria-label={isSaved ? 'Remove from saved jobs' : 'Save job for later'}
    >
      {loading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Bookmark
          className={`${iconSizes[size]} ${isSaved ? 'fill-current' : ''}`}
        />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
