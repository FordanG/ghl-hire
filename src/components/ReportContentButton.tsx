'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Flag, X } from 'lucide-react';

interface ReportContentButtonProps {
  contentType: 'job' | 'profile' | 'application' | 'blog_post' | 'comment';
  contentId: string;
  className?: string;
}

export default function ReportContentButton({
  contentType,
  contentId,
  className = ''
}: ReportContentButtonProps) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    { value: 'spam', label: 'Spam or misleading' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'misleading', label: 'False or misleading information' },
    { value: 'harassment', label: 'Harassment or bullying' },
    { value: 'discrimination', label: 'Discrimination' },
    { value: 'fake', label: 'Fake or fraudulent' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !reason) return;

    try {
      setSubmitting(true);

      // Get user's profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profileData) {
        alert('Please complete your profile first');
        return;
      }

      const { error } = await supabase
        .from('content_reports')
        .insert([{
          reporter_profile_id: profileData.id,
          content_type: contentType,
          content_id: contentId,
          reason,
          description
        }]);

      if (error) throw error;

      alert('Report submitted successfully. Our team will review it shortly.');
      setShowModal(false);
      setReason('');
      setDescription('');

    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors ${className}`}
      >
        <Flag className="w-4 h-4" />
        <span className="text-sm">Report</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Report Content</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for report *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a reason</option>
                  {reasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional details (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide any additional context..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !reason}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
