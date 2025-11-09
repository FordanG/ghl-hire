'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Briefcase, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function PostJobPage() {
  const router = useRouter();
  const { user, company, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canPostJob, setCanPostJob] = useState(true);
  const [jobCount, setJobCount] = useState(0);
  const [jobLimit, setJobLimit] = useState(1);
  const [planType, setPlanType] = useState('free');
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
    status: 'draft' as 'draft' | 'active',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin?redirect=/post-job');
    }

    if (!authLoading && !company) {
      router.push('/signup?redirect=/post-job');
    }
  }, [authLoading, user, company, router]);

  useEffect(() => {
    const checkJobLimit = async () => {
      if (!company) return;

      try {
        // Get subscription info
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('company_id', company.id)
          .single();

        if (subscription) {
          setPlanType(subscription.plan_type);
          setJobLimit(subscription.job_post_limit);

          // Count active jobs
          const { data: jobs } = await supabase
            .from('jobs')
            .select('id')
            .eq('company_id', company.id)
            .in('status', ['draft', 'active']);

          const count = jobs?.length || 0;
          setJobCount(count);

          // Check if can post more jobs
          if (subscription.plan_type === 'premium') {
            setCanPostJob(true);
          } else {
            setCanPostJob(count < subscription.job_post_limit);
          }
        }
      } catch (err) {
        console.error('Error checking job limit:', err);
      }
    };

    checkJobLimit();
  }, [company]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent, publishNow: boolean = false) => {
    e.preventDefault();

    if (!company) {
      setError('You must be logged in as an employer to post jobs');
      return;
    }

    if (!canPostJob && publishNow) {
      setError(`You've reached your job posting limit (${jobLimit}). Please upgrade your plan to post more jobs.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Validate salary range if provided
      const salaryMin = formData.salary_min ? parseInt(formData.salary_min) : null;
      const salaryMax = formData.salary_max ? parseInt(formData.salary_max) : null;

      if (salaryMin && salaryMax && salaryMin > salaryMax) {
        setError('Minimum salary cannot be greater than maximum salary');
        setLoading(false);
        return;
      }

      // Create job
      const { data: job, error: insertError } = await supabase
        .from('jobs')
        .insert({
          company_id: company.id,
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
          status: publishNow ? 'active' : 'draft',
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Redirect to job preview or dashboard
      if (publishNow) {
        router.push(`/jobs/${job.id}`);
      } else {
        router.push('/company/dashboard');
      }
    } catch (err: any) {
      console.error('Job posting error:', err);
      setError(err.message || 'Failed to post job. Please try again.');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />

      <div className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 fade-in fade-in-1">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Post a New Job</h1>
            <p className="text-gray-600">
              Fill out the form below to create a new job listing for your company
            </p>
          </div>

          {/* Job Limit Warning */}
          {!canPostJob && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 fade-in fade-in-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Job Posting Limit Reached
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  You've used {jobCount} of {jobLimit} job posts on your {planType} plan.
                  Upgrade to post more jobs or close existing ones.
                </p>
              </div>
            </div>
          )}

          {/* Current Plan Info */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 fade-in fade-in-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Current Plan: <span className="capitalize">{planType}</span>
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Job Posts: {jobCount} / {planType === 'premium' ? 'Unlimited' : jobLimit}
                </p>
              </div>
              {planType !== 'premium' && (
                <button
                  onClick={() => router.push('/pricing')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 fade-in fade-in-1">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Job Posting Form */}
          <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-8 fade-in fade-in-3">
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
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="submit"
                disabled={loading || !canPostJob}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Publishing...' : 'Publish Job'}
                {!loading && <CheckCircle className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              By posting a job, you agree to our Terms of Service and Community Guidelines
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
