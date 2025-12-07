'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Filter,
  Search,
  Calendar,
  ExternalLink,
  Eye,
  ChevronDown,
  AlertCircle,
  Building2,
  MapPin,
  Clock
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { generateJobSlug } from '@/lib/utils';

interface Application {
  id: string;
  job_id: string;
  profile_id: string;
  cover_letter: string | null;
  resume_url: string | null;
  status: string;
  applied_at: string;
  updated_at: string;
  job: {
    id: string;
    title: string;
    location: string;
    job_type: string;
    remote: boolean;
    salary_min: number | null;
    salary_max: number | null;
    company: {
      company_name: string;
      logo_url: string | null;
    };
  };
}

export default function ApplicationsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }

    if (!authLoading && !profile) {
      router.push('/signup');
    }
  }, [authLoading, user, profile, router]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!profile) return;

      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            job:jobs(
              id,
              title,
              location,
              job_type,
              remote,
              salary_min,
              salary_max,
              company:companies(
                company_name,
                logo_url
              )
            )
          `)
          .eq('profile_id', profile.id)
          .order('applied_at', { ascending: false });

        if (error) {
          throw error;
        }

        setApplications(data || []);
        setFilteredApplications(data || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchApplications();
    }
  }, [profile]);

  useEffect(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchTerm]);

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return null;
  }

  const groupedApplications = {
    active: filteredApplications.filter(app => ['pending', 'reviewing', 'shortlisted'].includes(app.status)),
    accepted: filteredApplications.filter(app => app.status === 'accepted'),
    rejected: filteredApplications.filter(app => ['rejected', 'withdrawn'].includes(app.status))
  };

  const ApplicationCard = ({ application }: { application: Application }) => {
    const jobSlug = generateJobSlug(application.job.title, application.job.id);
    const salary = application.job.salary_min && application.job.salary_max
      ? `$${application.job.salary_min.toLocaleString()} - $${application.job.salary_max.toLocaleString()}`
      : null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.job.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <p className="text-gray-600">{application.job.company.company_name}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {application.job.location}
                {application.job.remote && ' (Remote)'}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {application.job.job_type}
              </div>
              {salary && (
                <div className="flex items-center gap-1">
                  💰 {salary}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Applied {formatDate(application.applied_at)}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Updated {formatDate(application.updated_at)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${getApplicationStatusColor(application.status)}`}>
              {getApplicationStatusText(application.status)}
            </span>
            <Link
              href={`/jobs/${jobSlug}`}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="View job details"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {application.cover_letter && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Your cover letter:</strong> {application.cover_letter.substring(0, 150)}
              {application.cover_letter.length > 150 && '...'}
            </p>
          </div>
        )}
      </div>
    );
  };

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
                <p className="text-2xl font-semibold text-gray-900">{groupedApplications.accepted.length}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{applications.length}</p>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search applications..."
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
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Sections */}
        {filteredApplications.length > 0 ? (
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

            {/* Accepted */}
            {groupedApplications.accepted.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Offers ({groupedApplications.accepted.length})
                </h2>
                <div className="space-y-4">
                  {groupedApplications.accepted.map((application) => (
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
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            {searchTerm || statusFilter !== 'all' ? (
              <>
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications match your filters</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}

        {/* Tips Section */}
        {applications.length > 0 && (
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
        )}
      </div>
    </DashboardLayout>
  );
}
