'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  Copy,
  Pause,
  Play,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level: string | null;
  salary_min: number | null;
  salary_max: number | null;
  remote: boolean;
  status: 'draft' | 'active' | 'closed' | 'archived';
  views_count: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
}

export default function JobPostingsPage() {
  const { company } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (company) {
      loadJobs();
    }
  }, [company]);

  const loadJobs = async () => {
    if (!company) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setJobs(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    setUpdatingId(jobId);

    try {
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';

      const { error: updateError } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (updateError) throw updateError;

      setJobs(prev => prev.map(job =>
        job.id === jobId ? { ...job, status: newStatus as Job['status'] } : job
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update job status');
    } finally {
      setUpdatingId(null);
    }
  };

  const duplicateJob = async (job: Job) => {
    setUpdatingId(job.id);

    try {
      const { data: newJob, error: insertError } = await supabase
        .from('jobs')
        .insert({
          company_id: company!.id,
          title: `${job.title} (Copy)`,
          description: job.description,
          location: job.location,
          job_type: job.job_type,
          experience_level: job.experience_level,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          remote: job.remote,
          status: 'draft'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setJobs(prev => [newJob, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to duplicate job');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    setDeletingId(jobId);

    try {
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (deleteError) throw deleteError;

      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()}-$${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'active': return 'Active';
      case 'closed': return 'Closed';
      case 'archived': return 'Archived';
      default: return 'Unknown';
    }
  };

  // Stats
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalApplications = jobs.reduce((sum, j) => sum + j.applications_count, 0);
  const totalViews = jobs.reduce((sum, j) => sum + j.views_count, 0);

  const JobCard = ({ job }: { job: Job }) => {
    const isUpdating = updatingId === job.id;
    const isDeleting = deletingId === job.id;
    const salary = formatSalary(job.salary_min, job.salary_max);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                {getStatusText(job.status)}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.remote ? 'Remote' : job.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.job_type}
              </div>
              {salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {salary}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Posted {formatDate(job.created_at)}
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-900">{job.applications_count}</span>
                <span className="text-gray-500">applications</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-green-500" />
                <span className="font-medium text-gray-900">{job.views_count}</span>
                <span className="text-gray-500">views</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              type="button"
              onClick={() => toggleJobStatus(job.id, job.status)}
              disabled={isUpdating || isDeleting}
              className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                job.status === 'active'
                  ? 'text-yellow-600 hover:bg-yellow-50'
                  : 'text-green-600 hover:bg-green-50'
              }`}
              title={job.status === 'active' ? 'Close job' : 'Activate job'}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : job.status === 'active' ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            <Link
              href={`/edit-job/${job.id}`}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit job"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <Link
              href={`/jobs/${job.id}`}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="View public job page"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => duplicateJob(job)}
              disabled={isUpdating || isDeleting}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              title="Duplicate job"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => deleteJob(job.id)}
              disabled={isUpdating || isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete job"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Level: {job.experience_level || 'All Levels'}</span>
            </div>
            <Link
              href={`/company/dashboard/applications?jobId=${job.id}`}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View Applications &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <CompanyDashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading jobs...</span>
          </div>
        </div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Job Postings</h1>
            <p className="text-gray-600 mt-1">Manage your job listings and track their performance</p>
          </div>
          <Link
            href="/post-job"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800">{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
              title="Dismiss"
              aria-label="Dismiss error"
            >
              &times;
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">{totalJobs}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">{activeJobs}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{totalApplications}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-semibold text-gray-900">{totalViews}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search job titles, locations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs match your filters</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you&apos;re looking for.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No job postings yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first job posting to start attracting qualified GoHighLevel professionals.
            </p>
            <Link
              href="/post-job"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Your First Job
            </Link>
          </div>
        )}
      </div>
    </CompanyDashboardLayout>
  );
}
