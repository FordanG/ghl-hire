'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Briefcase, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { FEATURED_EMAIL, featuredMailto } from '@/lib/site';

export default function PostJobPage() {
  const router = useRouter();
  const { user, company, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    salary_period: 'year',
    apply_url: '',
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

      const applyUrl = formData.apply_url.trim();
      if (applyUrl && !/^https:\/\/\S+$/i.test(applyUrl)) {
        setError('The application link must be a full address starting with https://');
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
          salary_period: formData.salary_period,
          apply_url: applyUrl || null,
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
    } catch (err) {
      console.error('Job posting error:', err);
      const message = err instanceof Error ? err.message : '';
      if (message.includes('JOB_POST_LIMIT_REACHED')) {
        setError('You already have 25 active listings. Close one first, or email hello@vendrato.com.');
      } else {
        setError(message || 'Failed to post job. Please try again.');
      }
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
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Post a job</h1>
            <p className="text-gray-600">
              Free to post. Describe the role and publish it to the board.
            </p>
          </div>

          <div className="mb-6 rounded-lg border border-rule bg-surface p-4 text-[15px] text-ink-soft">
            <p>
              <span className="font-semibold text-ink">Posting is free.</span> Your listing goes live as soon as you publish.
              Want it pinned to the top of the board? Featured listings are arranged by email at{' '}
              <a href={featuredMailto(formData.title || undefined)} className="inline min-h-0 min-w-0 font-semibold text-brand underline underline-offset-2">
                {FEATURED_EMAIL}
              </a>
              .
            </p>
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
                    Minimum pay (USD)
                  </label>
                  <input
                    id="salary_min"
                    name="salary_min"
                    type="number"
                    min="0"
                    value={formData.salary_min}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum pay (USD)
                  </label>
                  <input
                    id="salary_max"
                    name="salary_max"
                    type="number"
                    min="0"
                    value={formData.salary_max}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="80000"
                  />
                </div>
              </div>

              <div className="mt-4 md:w-1/2 md:pr-2">
                <label htmlFor="salary_period" className="block text-sm font-medium text-gray-700 mb-2">
                  Pay is per
                </label>
                <select
                  id="salary_period"
                  name="salary_period"
                  value={formData.salary_period}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                >
                  <option value="year">Year</option>
                  <option value="month">Month</option>
                  <option value="hour">Hour</option>
                </select>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Leave blank to hide pay. Listings that show pay get more applications.
              </p>
            </div>

            {/* How to apply */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-2">How people apply</h2>
              <p className="text-sm text-gray-600 mb-4">
                By default, candidates apply here and you review them in your dashboard. If you take applications on your own site, add the link and we send candidates there instead.
              </p>
              <label htmlFor="apply_url" className="block text-sm font-medium text-gray-700 mb-2">
                Application link (optional)
              </label>
              <input
                id="apply_url"
                name="apply_url"
                type="url"
                inputMode="url"
                value={formData.apply_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                placeholder="https://yourcompany.com/careers/role"
              />
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
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Publishing...' : 'Publish Job'}
                {!loading && <CheckCircle className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              By posting a job, you agree to our Terms of Service
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
