'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Briefcase, MapPin, DollarSign, CheckCircle, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface EditJobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const router = useRouter();
  const { user, company, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    location: '',
    remote: false,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_min: '',
    salary_max: '',
    status: 'draft' as 'draft' | 'active' | 'closed',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }

    if (!authLoading && !company) {
      router.push('/signup');
    }
  }, [authLoading, user, company, router]);

  useEffect(() => {
    const loadJob = async () => {
      const { id } = await params;
      setJobId(id);

      if (!company) return;

      try {
        // Fetch job
        const { data: job, error: fetchError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError || !job) {
          setError('Job not found');
          setLoading(false);
          return;
        }

        // Verify ownership
        if (job.company_id !== company.id) {
          setError('You do not have permission to edit this job');
          setLoading(false);
          return;
        }

        // Populate form
        setFormData({
          title: job.title || '',
          description: job.description || '',
          requirements: job.requirements || '',
          benefits: job.benefits || '',
          location: job.location || '',
          remote: job.remote || false,
          job_type: job.job_type || 'Full-Time',
          experience_level: job.experience_level || 'Mid Level',
          salary_min: job.salary_min ? job.salary_min.toString() : '',
          salary_max: job.salary_max ? job.salary_max.toString() : '',
          status: job.status || 'draft',
        });

        setLoading(false);
      } catch (err) {
        console.error('Error loading job:', err);
        setError('Failed to load job');
        setLoading(false);
      }
    };

    if (company) {
      loadJob();
    }
  }, [params, company, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent, newStatus?: 'draft' | 'active' | 'closed') => {
    e.preventDefault();

    if (!company || !jobId) {
      setError('Invalid job or company');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
        setError('Please fill in all required fields');
        setSaving(false);
        return;
      }

      // Validate salary range if provided
      const salaryMin = formData.salary_min ? parseInt(formData.salary_min) : null;
      const salaryMax = formData.salary_max ? parseInt(formData.salary_max) : null;

      if (salaryMin && salaryMax && salaryMin > salaryMax) {
        setError('Minimum salary cannot be greater than maximum salary');
        setSaving(false);
        return;
      }

      const statusToUpdate = newStatus || formData.status;

      // Update job
      const { error: updateError } = await supabase
        .from('jobs')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          requirements: formData.requirements.trim() || null,
          benefits: formData.benefits.trim() || null,
          location: formData.location.trim(),
          remote: formData.remote,
          job_type: formData.job_type,
          experience_level: formData.experience_level,
          salary_min: salaryMin,
          salary_max: salaryMax,
          status: statusToUpdate,
        })
        .eq('id', jobId);

      if (updateError) {
        throw updateError;
      }

      // Redirect based on action
      if (newStatus === 'active') {
        router.push(`/jobs/${jobId}`);
      } else {
        router.push('/company/dashboard');
      }
    } catch (err: any) {
      console.error('Job update error:', err);
      setError(err.message || 'Failed to update job. Please try again.');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    if (!jobId) return;

    setSaving(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (deleteError) {
        throw deleteError;
      }

      router.push('/company/dashboard');
    } catch (err: any) {
      console.error('Job deletion error:', err);
      setError(err.message || 'Failed to delete job. Please try again.');
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !jobId) {
    return (
      <div className="min-h-screen flex flex-col text-gray-900 bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Error Loading Job</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/company/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />

      <div className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 fade-in fade-in-1">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Edit Job</h1>
            <p className="text-gray-600">
              Update your job listing details below
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 fade-in fade-in-1">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Job Status */}
          <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 fade-in fade-in-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Current Status: <span className="capitalize">{formData.status}</span>
                </p>
              </div>
              <div className="flex gap-2">
                {formData.status === 'draft' && (
                  <button
                    onClick={(e) => handleSubmit(e, 'active')}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Publish
                  </button>
                )}
                {formData.status === 'active' && (
                  <button
                    onClick={(e) => handleSubmit(e, 'closed')}
                    disabled={saving}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Close
                  </button>
                )}
                {formData.status === 'closed' && (
                  <button
                    onClick={(e) => handleSubmit(e, 'active')}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Job Editing Form */}
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-8 fade-in fade-in-3">
            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="e.g., Senior GoHighLevel Developer"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length} characters
                  </p>
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="List the required skills, qualifications, and experience..."
                  />
                </div>

                <div>
                  <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits
                  </label>
                  <textarea
                    id="benefits"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="List the benefits, perks, and what makes your company great..."
                  />
                </div>
              </div>
            </div>

            {/* Location & Type */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location & Type
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="job_type"
                    name="job_type"
                    required
                    value={formData.job_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    id="experience_level"
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>

                <div className="flex items-center pt-8">
                  <input
                    id="remote"
                    name="remote"
                    type="checkbox"
                    checked={formData.remote}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
                    Remote position
                  </label>
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Compensation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary (USD)
                  </label>
                  <input
                    id="salary_min"
                    name="salary_min"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.salary_min}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Salary (USD)
                  </label>
                  <input
                    id="salary_max"
                    name="salary_max"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.salary_max}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="80000"
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Leave blank to hide salary information
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="px-6 py-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Job
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? 'Saving...' : 'Save Changes'}
                {!saving && <CheckCircle className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
