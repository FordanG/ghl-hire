'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Search,
  Eye,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Loader2,
  Building2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { getSavedJobs, unsaveJob, type SavedJobWithDetails } from '@/lib/actions/saved-jobs-actions';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJobWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    setLoading(true);
    setError(null);

    const result = await getSavedJobs();

    if (result.success && result.data) {
      setSavedJobs(result.data);
    } else {
      setError(result.error || 'Failed to load saved jobs');
    }

    setLoading(false);
  };

  const handleRemove = async (jobId: string) => {
    setRemovingId(jobId);

    const result = await unsaveJob(jobId);

    if (result.success) {
      setSavedJobs(prev => prev.filter(sj => sj.job.id !== jobId));
    } else {
      setError(result.error || 'Failed to remove saved job');
    }

    setRemovingId(null);
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Filter saved jobs
  const filteredJobs = savedJobs.filter(savedJob => {
    const job = savedJob.job;
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !typeFilter || job.job_type === typeFilter;
    const matchesLocation = !locationFilter ||
      (locationFilter === 'Remote' ? job.remote : !job.remote);

    return matchesSearch && matchesType && matchesLocation;
  });

  // Stats
  const remoteCount = savedJobs.filter(sj => sj.job.remote).length;
  const recentCount = savedJobs.filter(sj => {
    const savedDate = new Date(sj.saved_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return savedDate >= weekAgo;
  }).length;

  const SavedJobCard = ({ savedJob }: { savedJob: SavedJobWithDetails }) => {
    const { job, saved_at } = savedJob;
    const salary = formatSalary(job.salary_min, job.salary_max);
    const isRemoving = removingId === job.id;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {job.company.logo_url ? (
                <img
                  src={job.company.logo_url}
                  alt={job.company.company_name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-blue-600 font-medium mb-3">{job.company.company_name}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
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
            </div>

            <p className="text-gray-700 text-sm mb-4 line-clamp-2">
              {job.description}
            </p>

            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              Saved {formatDate(saved_at)} &bull; Posted {formatDate(job.created_at)}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Link
              href={`/jobs/${job.id}`}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="View job details"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => handleRemove(job.id)}
              disabled={isRemoving}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Remove from saved"
            >
              {isRemoving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            {job.experience_level || 'All Levels'}
          </span>
          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View & Apply
          </Link>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading saved jobs...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Saved Jobs</h1>
          <p className="text-gray-600">Keep track of interesting opportunities for later review</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Saved</p>
                <p className="text-2xl font-semibold text-gray-900">{savedJobs.length}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <Bookmark className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remote Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">{remoteCount}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-semibold text-gray-900">{recentCount}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-blue-600" />
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
                  placeholder="Search saved jobs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filter by job type"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              >
                <option value="">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                aria-label="Filter by location"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              >
                <option value="">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>
        </div>

        {/* Saved Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-6">
            {filteredJobs.map((savedJob) => (
              <SavedJobCard key={savedJob.id} savedJob={savedJob} />
            ))}
          </div>
        ) : savedJobs.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching jobs</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to find saved jobs.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('');
                setLocationFilter('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
            <p className="text-gray-600 mb-6">
              Start saving interesting job opportunities to review them later and never miss out on great positions.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {/* Tips */}
        {savedJobs.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Managing Saved Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Save Early, Apply Later</h4>
                <p className="text-blue-700">
                  Save jobs that interest you immediately, then review and apply when you have time to craft a personalized application.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Regular Review</h4>
                <p className="text-blue-700">
                  Check your saved jobs weekly. Some positions have quick turnaround times and may close applications early.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Compare Opportunities</h4>
                <p className="text-blue-700">
                  Use your saved jobs list to compare similar positions, salaries, and requirements across different companies.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Set Application Goals</h4>
                <p className="text-blue-700">
                  Aim to apply to 2-3 positions from your saved list each week to maintain steady momentum in your job search.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
