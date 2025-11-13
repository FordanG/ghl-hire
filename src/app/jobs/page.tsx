'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Filter, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { supabase, Job } from '@/lib/supabase';

const JOBS_PER_PAGE = 20;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [salaryMin, setSalaryMin] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounce search input
  useEffect(() => {
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    searchDebounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, [searchTerm]);

  // Fetch jobs when filters or pagination change
  useEffect(() => {
    fetchJobs();
  }, [currentPage, debouncedSearchTerm, jobType, location, experienceLevel, remoteOnly, salaryMin, sortBy]);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      // Build query
      let query = supabase
        .from('jobs')
        .select(`
          *,
          company:companies(
            company_name,
            logo_url
          )
        `, { count: 'exact' })
        .eq('status', 'active');

      // Apply filters server-side
      if (jobType) {
        query = query.eq('job_type', jobType);
      }

      if (experienceLevel) {
        query = query.eq('experience_level', experienceLevel);
      }

      if (remoteOnly) {
        query = query.eq('remote', true);
      }

      if (salaryMin) {
        const minSalary = parseInt(salaryMin);
        query = query.gte('salary_min', minSalary);
      }

      // Location search (server-side)
      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      // Search across title, description, and company name
      if (debouncedSearchTerm) {
        query = query.or(`title.ilike.%${debouncedSearchTerm}%,description.ilike.%${debouncedSearchTerm}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'most-viewed':
          query = query.order('views_count', { ascending: false });
          break;
        case 'salary-high':
          query = query.order('salary_max', { ascending: false, nullsFirst: false });
          break;
        case 'salary-low':
          query = query.order('salary_min', { ascending: true, nullsFirst: false });
          break;
      }

      // Apply pagination
      const from = (currentPage - 1) * JOBS_PER_PAGE;
      const to = from + JOBS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setJobs(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setJobType('');
    setLocation('');
    setExperienceLevel('');
    setRemoteOnly(false);
    setSalaryMin('');
    setCurrentPage(1);
  };

  const activeFilterCount = [
    searchTerm,
    jobType,
    location,
    experienceLevel,
    remoteOnly,
    salaryMin
  ].filter(Boolean).length;

  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);
  const startJob = totalCount === 0 ? 0 : (currentPage - 1) * JOBS_PER_PAGE + 1;
  const endJob = Math.min(currentPage * JOBS_PER_PAGE, totalCount);

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />

      {/* Page Header */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
            GoHighLevel Jobs
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto fade-in fade-in-2">
            Discover amazing opportunities in the GoHighLevel ecosystem. From technical roles to client management, find your perfect match.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8 fade-in fade-in-3">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <select
              value={jobType}
              onChange={(e) => {
                setJobType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
            >
              <option value="">All Job Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>

            <select
              value={experienceLevel}
              onChange={(e) => {
                setExperienceLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
            >
              <option value="">All Experience Levels</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Lead">Lead</option>
            </select>

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />

            <input
              type="number"
              placeholder="Min Salary (USD)"
              value={salaryMin}
              onChange={(e) => {
                setSalaryMin(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />

            <label className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => {
                  setRemoteOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Remote Only</span>
            </label>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Filters ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Results Count and Sort */}
        <div className="flex items-center justify-between mb-6 fade-in fade-in-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{startJob}-{endJob}</span> of <span className="font-semibold">{totalCount}</span> {totalCount === 1 ? 'job' : 'jobs'}
          </p>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1); // Reset to first page on sort change
            }}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-viewed">Most Viewed</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="salary-low">Salary: Low to High</option>
          </select>
        </div>
      </section>

      {/* Job Listings */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {initialLoad || loading ? (
          // Skeleton loading state
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 animate-pulse"
              >
                {/* Job icon and title skeleton */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-200 rounded-full w-10 h-10"></div>
                  <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
                </div>

                {/* Meta info skeleton */}
                <div className="flex gap-3 mb-4">
                  <div className="bg-gray-200 h-4 w-24 rounded"></div>
                  <div className="bg-gray-200 h-4 w-32 rounded"></div>
                  <div className="bg-gray-200 h-4 w-20 rounded"></div>
                </div>

                {/* Description skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                  <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
                </div>

                {/* Footer skeleton */}
                <div className="flex justify-between items-center">
                  <div className="bg-gray-200 h-4 w-28 rounded"></div>
                  <div className="bg-gray-200 h-9 w-20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 mb-6">
              {activeFilterCount > 0
                ? 'Try adjusting your filters to see more results'
                : 'Check back soon for new opportunities!'}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <X className="w-5 h-5" />
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  className={`fade-in fade-in-${Math.min(index % 6 + 1, 6)}`}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="text-gray-400">...</span>
                      )}
                    </>
                  )}

                  {/* Page numbers around current page */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page === currentPage || Math.abs(page - currentPage) <= 1)
                    .map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 flex items-center justify-center border rounded-lg font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
