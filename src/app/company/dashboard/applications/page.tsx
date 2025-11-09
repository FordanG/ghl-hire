'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  User,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  FileText,
  Download,
  AlertCircle
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Application {
  id: string;
  job_id: string;
  profile_id: string;
  cover_letter: string | null;
  resume_url: string | null;
  status: string;
  applied_at: string;
  job: {
    id: string;
    title: string;
    location: string;
    job_type: string;
  };
  profile: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    location: string | null;
    bio: string | null;
    experience_years: number | null;
    linkedin_url: string | null;
    portfolio_url: string | null;
  };
}

export default function ApplicationsPage() {
  const router = useRouter();
  const { user, company, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }

    if (!authLoading && !company) {
      router.push('/signup');
    }
  }, [authLoading, user, company, router]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!company) return;

      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            job:jobs!inner(
              id,
              title,
              location,
              job_type,
              company_id
            ),
            profile:profiles(
              id,
              full_name,
              email,
              phone,
              location,
              bio,
              experience_years,
              linkedin_url,
              portfolio_url
            )
          `)
          .eq('job.company_id', company.id)
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

    if (company) {
      fetchApplications();
    }
  }, [company]);

  useEffect(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchTerm]);

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) {
        throw error;
      }

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
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
      <CompanyDashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </CompanyDashboardLayout>
    );
  }

  if (!company) {
    return null;
  }

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <CompanyDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
            <p className="text-gray-600 mt-1">Review and manage candidate applications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                statusFilter === status
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="text-2xl font-semibold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600 capitalize">{status}</p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by candidate name, email, or job title..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.profile.full_name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                      <p className="text-blue-600 font-medium mb-2">{application.job.title}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {application.profile.email}
                        </div>
                        {application.profile.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {application.profile.phone}
                          </div>
                        )}
                        {application.profile.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {application.profile.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied {formatDate(application.applied_at)}
                        </div>
                      </div>

                      {application.profile.experience_years && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>{application.profile.experience_years} years</strong> of experience
                        </p>
                      )}

                      {application.cover_letter && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 font-medium mb-1">Cover Letter:</p>
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {application.cover_letter}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 mt-4">
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'reviewing')}
                              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Mark as Reviewing
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'accepted')}
                              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {application.status === 'reviewing' && (
                          <>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'accepted')}
                              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {application.resume_url && (
                          <a
                            href={application.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            View Resume
                          </a>
                        )}
                        {application.profile.linkedin_url && (
                          <a
                            href={application.profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View LinkedIn
                          </a>
                        )}
                        {application.profile.portfolio_url && (
                          <a
                            href={application.profile.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all'
                ? 'No applications match your filters'
                : 'No applications yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search terms or filters.'
                : 'Applications will appear here once candidates apply to your jobs.'}
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Link
                href="/post-job"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post Your First Job
              </Link>
            )}
          </div>
        )}
      </div>
    </CompanyDashboardLayout>
  );
}
