import { Filter, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { supabase } from '@/lib/supabase';
import { jobTypes, locations } from '@/lib/mock-data';

export const revalidate = 60; // Revalidate every 60 seconds

async function getJobs() {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies(*)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return jobs || [];
}

export default async function JobsPage() {
  const jobs = await getJobs();

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
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white">
                <option value="">All Job Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white">
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <button className="inline-flex items-center gap-2 px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 fade-in fade-in-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{jobs.length}</span> {jobs.length === 1 ? 'job' : 'jobs'}
          </p>
          <select className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="salary-low">Salary: Low to High</option>
          </select>
        </div>
      </section>

      {/* Job Listings */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found. Check back soon!</p>
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

            {/* Load More */}
            {jobs.length >= 20 && (
              <div className="text-center mt-12 fade-in fade-in-6">
                <button className="px-6 py-3 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Load More Jobs
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