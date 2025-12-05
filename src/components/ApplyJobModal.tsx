'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getProjects, attachProjectsToApplication, type Project } from '@/lib/actions/project-actions';
import ProjectCard from './ProjectCard';

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
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Prevent body scroll when modal is open
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Load user's projects
  useEffect(() => {
    const loadProjects = async () => {
      if (!profile?.id) return;

      setLoadingProjects(true);
      const { projects: userProjects, error } = await getProjects(profile.id);

      if (!error && userProjects) {
        setProjects(userProjects);
      }

      setLoadingProjects(false);
    };

    loadProjects();
  }, [profile?.id]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle project selection
  const handleProjectSelect = (projectId: string, selected: boolean) => {
    if (selected) {
      // Add project if less than 3 selected
      if (selectedProjectIds.length < 3) {
        setSelectedProjectIds([...selectedProjectIds, projectId]);
      }
    } else {
      // Remove project
      setSelectedProjectIds(selectedProjectIds.filter(id => id !== projectId));
    }
  };

  if (!mounted) return null;

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
      const { data: application, error: insertError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          profile_id: profile.id,
          cover_letter: coverLetter || null,
          resume_url: resumeUrl,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Attach selected projects to application
      if (application && selectedProjectIds.length > 0) {
        const { error: projectError } = await attachProjectsToApplication(
          application.id,
          selectedProjectIds
        );

        if (projectError) {
          console.error('Failed to attach projects:', projectError);
          // Don't fail the application if projects fail to attach
        }
      }

      // Send email notifications (fire and forget - don't block UI)
      if (application) {
        fetch('/api/email/application-submitted', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId: application.id }),
        }).catch(err => console.error('Failed to send notification emails:', err));
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

  const modalContent = success ? (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4"
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold mb-2 text-gray-900">Application Submitted!</h3>
        <p className="text-gray-600">
          Your application has been successfully submitted. The employer will review it and get back to you soon.
        </p>
      </div>
    </div>
  ) : (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4"
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
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
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-900"
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

          {/* Projects Section */}
          {loadingProjects ? (
            <div className="text-center py-4 text-gray-500">Loading projects...</div>
          ) : projects.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Showcase Projects <span className="text-gray-500">(Optional - Select up to 3)</span>
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Selected: {selectedProjectIds.length}/3 projects
              </p>
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isSelectable={true}
                    isSelected={selectedProjectIds.includes(project.id)}
                    onSelect={handleProjectSelect}
                  />
                ))}
              </div>
              {projects.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No projects added yet. Add projects in your{' '}
                  <a href="/dashboard/profile" className="text-blue-600 hover:underline">
                    profile
                  </a>{' '}
                  to showcase them with applications.
                </p>
              )}
            </div>
          ) : null}

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

  return createPortal(modalContent, document.body);
}
