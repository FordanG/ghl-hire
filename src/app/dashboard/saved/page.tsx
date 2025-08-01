import Link from 'next/link';
import { 
  Bookmark, 
  Search, 
  Filter, 
  Eye, 
  ExternalLink,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { mockSavedJobs, type SavedJob } from '@/lib/dashboard-data';

export default function SavedJobsPage() {
  const SavedJobCard = ({ savedJob }: { savedJob: SavedJob }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{savedJob.job.title}</h3>
          <p className="text-blue-600 font-medium mb-3">{savedJob.job.company}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {savedJob.job.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {savedJob.job.type}
            </div>
            {savedJob.job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {savedJob.job.salary}
              </div>
            )}
          </div>
          
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {savedJob.job.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {savedJob.job.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {savedJob.job.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{savedJob.job.skills.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            Saved {savedJob.savedDate} • Posted {savedJob.job.postedDate}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Link 
            href={`/jobs/${savedJob.job.id}`}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="View job details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button 
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Remove from saved"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-sm font-medium text-gray-600">
          Job posted {savedJob.job.postedDate}
        </span>
        <div className="flex gap-2">
          <Link 
            href={`/jobs/${savedJob.job.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 border border-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Saved Jobs</h1>
          <p className="text-gray-600">Keep track of interesting opportunities for later review</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Saved</p>
                <p className="text-2xl font-semibold text-gray-900">{mockSavedJobs.length}</p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {mockSavedJobs.filter(job => job.job.location.includes('Remote')).length}
                </p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {mockSavedJobs.filter(job => {
                    const savedDate = new Date(job.savedDate);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return savedDate >= weekAgo;
                  }).length}
                </p>
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
                  placeholder="Search saved jobs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none">
                <option value="">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
              <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none">
                <option value="">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Saved Jobs List */}
        {mockSavedJobs.length > 0 ? (
          <div className="space-y-6">
            {mockSavedJobs.map((savedJob) => (
              <SavedJobCard key={savedJob.id} savedJob={savedJob} />
            ))}
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
      </div>
    </DashboardLayout>
  );
}