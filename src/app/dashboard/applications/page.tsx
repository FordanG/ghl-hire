import Link from 'next/link';
import { 
  Filter, 
  Search, 
  Calendar, 
  ExternalLink,
  Eye,
  ChevronDown
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  mockApplications,
  getApplicationStatusColor,
  getApplicationStatusText,
  type Application
} from '@/lib/dashboard-data';

export default function ApplicationsPage() {
  const groupedApplications = {
    active: mockApplications.filter(app => ['applied', 'reviewing', 'interview'].includes(app.status)),
    offers: mockApplications.filter(app => app.status === 'offer'),
    rejected: mockApplications.filter(app => app.status === 'rejected')
  };

  const ApplicationCard = ({ application }: { application: Application }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.jobTitle}</h3>
          <p className="text-gray-600 mb-2">{application.company}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Applied {application.appliedDate}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Updated {application.lastUpdate}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getApplicationStatusColor(application.status)}`}>
            {getApplicationStatusText(application.status)}
          </span>
          <Link 
            href={`/jobs/${application.jobId}`}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="View job details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
      
      {application.notes && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> {application.notes}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track all your job applications and their current status</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{groupedApplications.active.length}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offers Received</p>
                <p className="text-2xl font-semibold text-gray-900">{groupedApplications.offers.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <ExternalLink className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{mockApplications.length}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none">
                <option value="">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="reviewing">Under Review</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Applications Sections */}
        <div className="space-y-8">
          {/* Active Applications */}
          {groupedApplications.active.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Active Applications ({groupedApplications.active.length})
              </h2>
              <div className="space-y-4">
                {groupedApplications.active.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            </div>
          )}

          {/* Offers */}
          {groupedApplications.offers.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Offers ({groupedApplications.offers.length})
              </h2>
              <div className="space-y-4">
                {groupedApplications.offers.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            </div>
          )}

          {/* Rejected Applications */}
          {groupedApplications.rejected.length > 0 && (
            <div>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Past Applications ({groupedApplications.rejected.length})
                  </h2>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-4 space-y-4">
                  {groupedApplications.rejected.map((application) => (
                    <ApplicationCard key={application.id} application={application} />
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Empty State */}
        {mockApplications.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t applied to any jobs yet. Start browsing opportunities to begin your job search.
            </p>
            <Link 
              href="/jobs"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Application Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Follow Up</h4>
              <p className="text-blue-700">
                Don&apos;t be afraid to follow up on applications after 1-2 weeks if you haven&apos;t heard back.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Stay Organized</h4>
              <p className="text-blue-700">
                Keep track of application deadlines and interview dates in your personal calendar.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Customize Applications</h4>
              <p className="text-blue-700">
                Tailor your resume and cover letter for each specific GoHighLevel role you apply to.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Prepare for Interviews</h4>
              <p className="text-blue-700">
                Review common GoHighLevel interview questions and prepare examples of your experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}