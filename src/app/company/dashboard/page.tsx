'use client';

import { useState, useEffect } from 'react';
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
  BarChart3,
  Loader2
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Job {
  id: string;
  title: string;
  location: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  remote: boolean;
  status: string;
  views_count: number;
  applications_count: number;
  created_at: string;
}

interface Application {
  id: string;
  status: string;
  applied_at: string;
  job: {
    id: string;
    title: string;
  } | null;
  profile: {
    id: string;
    full_name: string;
    experience_years: number | null;
    location: string | null;
  } | null;
}

interface DashboardStats {
  activeJobs: number;
  totalJobs: number;
  totalApplications: number;
  newApplicationsThisWeek: number;
  totalViews: number;
  acceptedApplications: number;
}

export default function CompanyDashboardPage() {
  const { company } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    activeJobs: 0,
    totalJobs: 0,
    totalApplications: 0,
    newApplicationsThisWeek: 0,
    totalViews: 0,
    acceptedApplications: 0
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (company) {
      loadDashboardData();
    }
  }, [company]);

  const loadDashboardData = async () => {
    if (!company) return;

    setLoading(true);

    try {
      // Fetch jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      const activeJobsList = jobs?.filter(j => j.status === 'active') || [];
      setActiveJobs(activeJobsList.slice(0, 5));

      // Calculate stats from jobs
      const totalViews = jobs?.reduce((sum, j) => sum + (j.views_count || 0), 0) || 0;
      const totalJobApplications = jobs?.reduce((sum, j) => sum + (j.applications_count || 0), 0) || 0;

      // Fetch recent applications
      const jobIds = jobs?.map(j => j.id) || [];
      let applications: Application[] = [];
      let newThisWeek = 0;
      let acceptedCount = 0;

      if (jobIds.length > 0) {
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            applied_at,
            job:jobs!inner (
              id,
              title
            ),
            profile:profiles (
              id,
              full_name,
              experience_years,
              location
            )
          `)
          .in('job_id', jobIds)
          .order('applied_at', { ascending: false })
          .limit(5);

        if (appsError) throw appsError;

        // Transform the data
        applications = (appsData || []).map(app => ({
          ...app,
          job: Array.isArray(app.job) ? app.job[0] : app.job,
          profile: Array.isArray(app.profile) ? app.profile[0] : app.profile
        })) as Application[];

        // Count new applications this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const { count: weekCount } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .in('job_id', jobIds)
          .gte('applied_at', weekAgo.toISOString());

        newThisWeek = weekCount || 0;

        // Count accepted applications
        const { count: acceptCount } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .in('job_id', jobIds)
          .eq('status', 'accepted');

        acceptedCount = acceptCount || 0;
      }

      setRecentApplications(applications);
      setStats({
        activeJobs: activeJobsList.length,
        totalJobs: jobs?.length || 0,
        totalApplications: totalJobApplications,
        newApplicationsThisWeek: newThisWeek,
        totalViews: totalViews,
        acceptedApplications: acceptedCount
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'reviewing': return 'Reviewing';
      case 'shortlisted': return 'Shortlisted';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const hireRate = stats.totalApplications > 0
    ? ((stats.acceptedApplications / stats.totalApplications) * 100).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <CompanyDashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </CompanyDashboardLayout>
    );
  }

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
                <p className="text-2xl font-semibold text-gray-900">{stats.activeJobs}</p>
                <p className="text-xs text-gray-500 mt-1">of {stats.totalJobs} total</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</p>
                {stats.newApplicationsThisWeek > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <p className="text-xs text-green-600">+{stats.newApplicationsThisWeek} this week</p>
                  </div>
                )}
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
                <p className="text-2xl font-semibold text-gray-900">{stats.totalViews.toLocaleString()}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{hireRate}%</p>
                <p className="text-xs text-gray-500 mt-1">{stats.acceptedApplications} accepted</p>
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
            {recentApplications.length > 0 ? (
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
                              {application.profile?.full_name || 'Unknown Candidate'}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              Applied for {application.job?.title || 'Unknown Job'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatDate(application.applied_at)}</span>
                          {application.profile?.experience_years && (
                            <span>{application.profile.experience_years} years exp.</span>
                          )}
                          {application.profile?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {application.profile.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No applications yet</p>
                <p className="text-sm mt-1">Applications will appear here once candidates apply</p>
              </div>
            )}
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
            {activeJobs.length > 0 ? (
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
                            {job.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.remote ? 'Remote' : job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {job.job_type}
                          </span>
                          {(job.salary_min || job.salary_max) && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {job.salary_min && job.salary_max
                                ? `$${job.salary_min.toLocaleString()}-$${job.salary_max.toLocaleString()}`
                                : job.salary_min
                                  ? `From $${job.salary_min.toLocaleString()}`
                                  : `Up to $${job.salary_max?.toLocaleString()}`
                              }
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{job.applications_count} applications</span>
                          <span>{job.views_count} views</span>
                          <span>Posted {formatDate(job.created_at)}</span>
                        </div>
                      </div>
                      <Link
                        href={`/company/dashboard/jobs`}
                        className="p-1 text-gray-400 hover:text-gray-600 ml-4"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No active jobs</p>
                <Link href="/post-job" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block">
                  Post your first job
                </Link>
              </div>
            )}
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
              href="/company/dashboard/analytics"
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
