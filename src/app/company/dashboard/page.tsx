'use client';

import Link from 'next/link';
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Clock,
  UserCheck,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  Calendar,
  MapPin,
  DollarSign,
  BarChart3
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { 
  mockCompanyStats, 
  mockJobPostings, 
  mockApplications,
  getJobStatusColor,
  getJobStatusText,
  getApplicationStatusColor,
  getApplicationStatusText
} from '@/lib/company-data';

export default function CompanyDashboardPage() {
  const recentApplications = mockApplications.slice(0, 5);
  const activeJobs = mockJobPostings.filter(job => job.status === 'active');

  return (
    <CompanyDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Company Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of your hiring activities and performance</p>
          </div>
          <Link
            href="/post-job"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">{mockCompanyStats.activeJobs}</p>
                <p className="text-xs text-gray-500 mt-1">of {mockCompanyStats.totalJobs} total</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{mockCompanyStats.totalApplications}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <p className="text-xs text-green-600">+{mockCompanyStats.newApplications} this week</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-semibold text-gray-900">{mockCompanyStats.totalViews}</p>
                <p className="text-xs text-gray-500 mt-1">across all jobs</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hire Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{mockCompanyStats.hireRate}%</p>
                <p className="text-xs text-gray-500 mt-1">{mockCompanyStats.avgTimeToHire} days avg time</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
              <Link 
                href="/company/dashboard/applications"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center gap-1"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentApplications.map((application) => (
                <div key={application.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {application.candidate.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            Applied for {application.jobTitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{application.appliedDate}</span>
                        <span>{application.candidate.experience} years exp.</span>
                        {application.candidate.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {application.candidate.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getApplicationStatusColor(application.status)}`}>
                        {getApplicationStatusText(application.status)}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Job Postings */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Active Job Postings</h3>
              <Link 
                href="/company/dashboard/jobs"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center gap-1"
              >
                Manage jobs
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {activeJobs.map((job) => (
                <div key={job.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {job.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getJobStatusColor(job.status)}`}>
                          {getJobStatusText(job.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.type}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ${job.salary.min.toLocaleString()}-${job.salary.max.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{job.applicationsCount} applications</span>
                        <span>{job.viewsCount} views</span>
                        <span>Posted {job.postedDate}</span>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600 ml-4">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/post-job"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-blue-50 rounded-lg p-2">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Post New Job</h4>
                <p className="text-sm text-gray-500">Create and publish a job opening</p>
              </div>
            </Link>

            <Link
              href="/company/dashboard/applications"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-green-50 rounded-lg p-2">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Review Applications</h4>
                <p className="text-sm text-gray-500">Manage candidate applications</p>
              </div>
            </Link>

            <Link
              href="/company/analytics"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-orange-50 rounded-lg p-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Analytics</h4>
                <p className="text-sm text-gray-500">Track job performance metrics</p>
              </div>
            </Link>

            <Link
              href="/company/dashboard/profile"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-purple-50 rounded-lg p-2">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Update Profile</h4>
                <p className="text-sm text-gray-500">Manage company information</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}