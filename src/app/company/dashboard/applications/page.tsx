'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search,
  Filter,
  Download,
  MoreHorizontal,
  User,
  Eye,
  MessageSquare,
  Calendar,
  Star,
  MapPin,
  Mail,
  Phone,
  Users,
  TrendingUp,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { 
  mockApplications, 
  mockJobPostings,
  getApplicationStatusColor, 
  getApplicationStatusText,
  type Application 
} from '@/lib/company-data';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesJob = jobFilter === 'all' || app.jobId === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const updateApplicationStatus = (applicationId: string, newStatus: Application['status']) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: newStatus, lastUpdate: new Date().toISOString().split('T')[0] }
        : app
    ));
  };

  const rateCandidate = (applicationId: string, rating: number) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, rating }
        : app
    ));
  };

  const ApplicationCard = ({ application }: { application: Application }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{application.candidate.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getApplicationStatusColor(application.status)}`}>
                {getApplicationStatusText(application.status)}
              </span>
            </div>
            <p className="text-blue-600 font-medium mb-2">{application.jobTitle}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {application.candidate.email}
              </div>
              {application.candidate.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {application.candidate.phone}
                </div>
              )}
              {application.candidate.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {application.candidate.location}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm mb-3">
              <span className="text-gray-600">
                <strong>{application.candidate.experience} years</strong> experience
              </span>
              <span className="text-gray-600">
                Applied <strong>{application.appliedDate}</strong>
              </span>
              {application.candidate.salary_expectation && (
                <span className="text-gray-600">
                  Salary: <strong>${application.candidate.salary_expectation.toLocaleString()}</strong>
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {application.candidate.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {application.candidate.skills.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  +{application.candidate.skills.length - 4} more
                </span>
              )}
            </div>

            {application.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-yellow-800">
                  <strong>Notes:</strong> {application.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => rateCandidate(application.id, star)}
                className={`w-4 h-4 ${
                  application.rating && star <= application.rating
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            ))}
          </div>
          
          <Link
            href={`/company/dashboard/applications/${application.id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {application.interviews.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{application.interviews.length} interview{application.interviews.length > 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="text-sm text-gray-500">
              Last updated {application.lastUpdate}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={application.status}
              onChange={(e) => updateApplicationStatus(application.id, e.target.value as Application['status'])}
              className="text-sm border border-gray-200 rounded px-3 py-1 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            >
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <button className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 border border-blue-600 rounded text-sm hover:bg-blue-50 transition-colors">
              <MessageSquare className="w-4 h-4" />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const stats = {
    total: applications.length,
    new: applications.filter(app => app.status === 'new').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    interview: applications.filter(app => app.status === 'interview').length,
    offer: applications.filter(app => app.status === 'offer').length,
    hired: applications.filter(app => app.status === 'hired').length,
  };

  return (
    <CompanyDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
            <p className="text-gray-600 mt-1">Manage candidate applications and track hiring progress</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Total</p>
                <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">New</p>
                <p className="text-xl font-semibold text-blue-600">{stats.new}</p>
              </div>
              <AlertCircle className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Reviewing</p>
                <p className="text-xl font-semibold text-yellow-600">{stats.reviewing}</p>
              </div>
              <Eye className="w-5 h-5 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Interview</p>
                <p className="text-xl font-semibold text-purple-600">{stats.interview}</p>
              </div>
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Offers</p>
                <p className="text-xl font-semibold text-green-600">{stats.offer}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Hired</p>
                <p className="text-xl font-semibold text-emerald-600">{stats.hired}</p>
              </div>
              <UserCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search candidates, emails, job titles..."
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
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              <select 
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              >
                <option value="all">All Jobs</option>
                {mockJobPostings.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' || jobFilter !== 'all' 
                ? 'No applications match your filters' 
                : 'No applications yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || jobFilter !== 'all'
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'Applications will appear here when candidates apply to your job postings.'
              }
            </p>
            {(!searchTerm && statusFilter === 'all' && jobFilter === 'all') && (
              <Link
                href="/company/dashboard/jobs"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Job Postings
              </Link>
            )}
          </div>
        )}

      </div>
    </CompanyDashboardLayout>
  );
}