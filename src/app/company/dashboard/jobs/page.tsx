'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus,
  Search,
  Filter,
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
  TrendingUp
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { 
  mockJobPostings, 
  getJobStatusColor, 
  getJobStatusText,
  type JobPosting 
} from '@/lib/company-data';

export default function JobPostingsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobPostings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleJobStatus = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: job.status === 'active' ? 'paused' : 'active' as JobPosting['status'] }
        : job
    ));
  };

  const duplicateJob = (job: JobPosting) => {
    const newJob: JobPosting = {
      ...job,
      id: Date.now().toString(),
      title: `${job.title} (Copy)`,
      status: 'draft',
      postedDate: new Date().toISOString().split('T')[0],
      applicationsCount: 0,
      viewsCount: 0
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const deleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const JobCard = ({ job }: { job: JobPosting }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getJobStatusColor(job.status)}`}>
              {getJobStatusText(job.status)}
            </span>
          </div>
          <p className="text-blue-600 font-medium mb-3">{job.department}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.type}
            </div>
            {job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                ${job.salary.min.toLocaleString()}-${job.salary.max.toLocaleString()}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Posted {job.postedDate}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-gray-900">{job.applicationsCount}</span>
              <span className="text-gray-500">applications</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-green-500" />
              <span className="font-medium text-gray-900">{job.viewsCount}</span>
              <span className="text-gray-500">views</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-gray-500 capitalize">{job.plan} plan</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => toggleJobStatus(job.id)}
            className={`p-2 rounded-lg transition-colors ${
              job.status === 'active' 
                ? 'text-yellow-600 hover:bg-yellow-50' 
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={job.status === 'active' ? 'Pause job' : 'Activate job'}
          >
            {job.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <Link
            href={`/company/dashboard/jobs/${job.id}/edit`}
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
            onClick={() => duplicateJob(job)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Duplicate job"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteJob(job.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete job"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Level: {job.level}</span>
            {job.closingDate && <span>Closes: {job.closingDate}</span>}
          </div>
          <Link
            href={`/company/dashboard/applications?jobId=${job.id}`}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            View Applications →
          </Link>
        </div>
      </div>
    </div>
  );

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
            href="/company/dashboard/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">{jobs.length}</p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {jobs.filter(job => job.status === 'active').length}
                </p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {jobs.reduce((sum, job) => sum + job.applicationsCount, 0)}
                </p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {jobs.reduce((sum, job) => sum + job.viewsCount, 0)}
                </p>
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
                  placeholder="Search job titles, departments..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
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
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No jobs match your filters' : 'No job postings yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'Create your first job posting to start attracting qualified GoHighLevel professionals.'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Link
                href="/company/dashboard/jobs/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Your First Job
              </Link>
            )}
          </div>
        )}

      </div>
    </CompanyDashboardLayout>
  );
}