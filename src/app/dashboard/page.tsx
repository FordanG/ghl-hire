import Link from 'next/link';
import { 
  TrendingUp, 
  FileText, 
  Bookmark, 
  Bell, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Eye,
  Calendar
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  mockApplications, 
  mockSavedJobs, 
  mockProfile,
  getApplicationStatusColor,
  getApplicationStatusText 
} from '@/lib/dashboard-data';

export default function CandidateDashboard() {
  const recentApplications = mockApplications.slice(0, 3);
  const recentSavedJobs = mockSavedJobs.slice(0, 2);
  
  const stats = {
    totalApplications: mockApplications.length,
    activeApplications: mockApplications.filter(app => ['applied', 'reviewing', 'interview'].includes(app.status)).length,
    savedJobs: mockSavedJobs.length,
    profileComplete: mockProfile.profileComplete
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {mockProfile.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your job search
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-50 rounded-lg p-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-50 rounded-lg p-3">
                <Bookmark className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.savedJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-50 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Complete</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.profileComplete}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Alert */}
        {mockProfile.profileComplete < 100 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">
                    Complete your profile to get better job matches
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Your profile is {mockProfile.profileComplete}% complete. Add more details to stand out to employers.
                  </p>
                </div>
              </div>
              <Link 
                href="/dashboard/profile"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                <Link 
                  href="/dashboard/applications" 
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium inline-flex items-center"
                >
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {recentApplications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{application.jobTitle}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getApplicationStatusColor(application.status)}`}>
                      {getApplicationStatusText(application.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{application.company}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    Applied {application.appliedDate}
                  </div>
                  {application.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">{application.notes}</p>
                  )}
                </div>
              ))}
            </div>

            {recentApplications.length === 0 && (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-sm text-gray-500 mb-4">Start applying to jobs to track your progress here.</p>
                <Link 
                  href="/jobs"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>

          {/* Saved Jobs */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Saved Jobs</h2>
                <Link 
                  href="/dashboard/saved" 
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium inline-flex items-center"
                >
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {recentSavedJobs.map((savedJob) => (
                <div key={savedJob.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{savedJob.job.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{savedJob.job.company}</p>
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span>{savedJob.job.location}</span>
                        <span className="mx-2">•</span>
                        <span>{savedJob.job.type}</span>
                      </div>
                      {savedJob.job.salary && (
                        <p className="text-sm font-medium text-green-600">{savedJob.job.salary}</p>
                      )}
                    </div>
                    <Link 
                      href={`/jobs/${savedJob.job.id}`}
                      className="text-blue-600 hover:text-blue-500 ml-4"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {recentSavedJobs.length === 0 && (
              <div className="p-8 text-center">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No saved jobs yet</h3>
                <p className="text-sm text-gray-500 mb-4">Save interesting jobs to review them later.</p>
                <Link 
                  href="/jobs"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Job Recommendations */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
            <p className="text-sm text-gray-600 mt-1">Jobs that match your skills and experience</p>
          </div>
          
          <div className="p-6">
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">AI-powered recommendations coming soon</h3>
              <p className="text-sm text-gray-500 mb-4">We're working on personalized job recommendations based on your profile and preferences.</p>
              <Link 
                href="/jobs"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse All Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}