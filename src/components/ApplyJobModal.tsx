'use client';

import { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface ApplyJobModalProps {
  job: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplyJobModal({ job, onClose, onSuccess }: ApplyJobModalProps) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      setError('You must be logged in to apply');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let resumeUrl = profile.resume_url;

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
        const filePath = `resumes/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, resumeFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          // Continue with application even if upload fails
        } else {
          const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
          resumeUrl = data.publicUrl;
        }
      }

      // Check for duplicate application
      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', job.id)
        .eq('profile_id', profile.id)
        .single();

      if (existing) {
        setError('You have already applied to this job');
        setLoading(false);
        return;
      }

      // Create application
      const { error: insertError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          profile_id: profile.id,
          cover_letter: coverLetter || null,
          resume_url: resumeUrl,
          status: 'pending',
        });

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Application error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Application Submitted!</h3>
          <p className="text-gray-600">
            Your application has been successfully submitted. The employer will review it and get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Apply for Position</h2>
            <p className="text-gray-600 mt-1">{job.title} at {job.company?.company_name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Profile Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Your Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {profile?.full_name}</p>
              <p><span className="font-medium">Email:</span> {profile?.email}</p>
              {profile?.phone && <p><span className="font-medium">Phone:</span> {profile.phone}</p>}
              {profile?.location && <p><span className="font-medium">Location:</span> {profile.location}</p>}
            </div>
            {profile && (!profile.phone || !profile.location || !profile.bio) && (
              <p className="text-sm text-yellow-600 mt-2">
                💡 Consider completing your profile to improve your chances
              </p>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              placeholder="Tell the employer why you're a great fit for this role..."
            />
            <p className="text-sm text-gray-500 mt-1">
              {coverLetter.length} characters
            </p>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume {profile?.resume_url ? <span className="text-gray-500">(Optional - Update)</span> : <span className="text-gray-500">(Optional)</span>}
            </label>

            {profile?.resume_url && !resumeFile && (
              <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">
                  Using your profile resume
                </span>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="resume" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  {resumeFile ? resumeFile.name : 'Click to upload a different resume'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, or DOCX (max 5MB)
                </p>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
