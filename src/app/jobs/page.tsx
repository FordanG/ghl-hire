'use client';

import { useState, useEffect } from 'react';
import { Filter, Search, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { supabase } from '@/lib/supabase';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_min: number | null;
  salary_max: number | null;
  remote: boolean;
  created_at: string;
  company: {
    company_name: string;
    logo_url: string | null;
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [salaryMin, setSalaryMin] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, jobType, location, experienceLevel, remoteOnly, salaryMin, sortBy]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(
            company_name,
            logo_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJobs(data || []);
      setFilteredJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Job type filter
    if (jobType) {
      filtered = filtered.filter(job => job.job_type === jobType);
    }

    // Location filter
    if (location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Experience level filter
    if (experienceLevel) {
      filtered = filtered.filter(job => job.experience_level === experienceLevel);
    }

    // Remote only filter
    if (remoteOnly) {
      filtered = filtered.filter(job => job.remote === true);
    }

    // Salary filter
    if (salaryMin) {
      const minSalary = parseInt(salaryMin);
      filtered = filtered.filter(job =>
        job.salary_min && job.salary_min >= minSalary
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'salary-high':
          return (b.salary_max || 0) - (a.salary_max || 0);
        case 'salary-low':
          return (a.salary_min || 0) - (b.salary_min || 0);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setJobType('');
    setLocation('');
    setExperienceLevel('');
    setRemoteOnly(false);
    setSalaryMin('');
  };

  const activeFilterCount = [
    searchTerm,
    jobType,
    location,
    experienceLevel,
    remoteOnly,
    salaryMin
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

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
              onChange={(e) => setJobType(e.target.value)}
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
              onChange={(e) => setExperienceLevel(e.target.value)}
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
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />

            <input
              type="number"
              placeholder="Min Salary (USD)"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />

            <label className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
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
            Showing <span className="font-semibold">{filteredJobs.length}</span> of <span className="font-semibold">{jobs.length}</span> {jobs.length === 1 ? 'job' : 'jobs'}
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="salary-low">Salary: Low to High</option>
          </select>
        </div>
      </section>

      {/* Job Listings */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {filteredJobs.length === 0 ? (
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                className={`fade-in fade-in-${Math.min(index % 6 + 1, 6)}`}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
