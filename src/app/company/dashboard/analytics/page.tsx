'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Target,
  Calendar,
  Download,
  UserCheck,
  MessageSquare,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  LucideIcon,
  Loader2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Job {
  id: string;
  title: string;
  status: string;
  views_count: number;
  applications_count: number;
  created_at: string;
}

interface Application {
  id: string;
  job_id: string;
  status: string;
  applied_at: string;
  profile: {
    experience_years: number | null;
    skills: string[] | null;
    location: string | null;
  } | null;
}

interface AnalyticsData {
  totalViews: number;
  totalApplications: number;
  activeJobs: number;
  totalJobs: number;
  jobs: Job[];
  applications: Application[];
}

export default function AnalyticsPage() {
  const { company } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    if (company) {
      loadAnalytics();
    }
  }, [company, timeRange]);

  const getDateRange = () => {
    const now = new Date();
    const ranges = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    const daysBack = ranges[timeRange];
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    return startDate.toISOString();
  };

  const loadAnalytics = async () => {
    if (!company) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, status, views_count, applications_count, created_at')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // Fetch applications with profile data
      const jobIds = jobs?.map(j => j.id) || [];
      let applications: Application[] = [];

      if (jobIds.length > 0) {
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select(`
            id,
            job_id,
            status,
            applied_at,
            profile:profiles (
              experience_years,
              skills,
              location
            )
          `)
          .in('job_id', jobIds)
          .gte('applied_at', getDateRange());

        if (appsError) throw appsError;
        // Transform the data - Supabase returns profile as array for joins
        applications = (appsData || []).map(app => ({
          ...app,
          profile: Array.isArray(app.profile) ? app.profile[0] || null : app.profile
        })) as Application[];
      }

      // Calculate totals
      const totalViews = jobs?.reduce((sum, j) => sum + (j.views_count || 0), 0) || 0;
      const totalApplications = applications.length;
      const activeJobs = jobs?.filter(j => j.status === 'active').length || 0;
      const totalJobs = jobs?.length || 0;

      setData({
        totalViews,
        totalApplications,
        activeJobs,
        totalJobs,
        jobs: jobs || [],
        applications
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Compute derived analytics
  const getJobPerformance = () => {
    if (!data?.jobs) return [];
    return data.jobs.slice(0, 5).map(job => ({
      ...job,
      conversionRate: job.views_count > 0
        ? ((job.applications_count / job.views_count) * 100).toFixed(1)
        : '0.0'
    }));
  };

  const getApplicationStatusCounts = () => {
    if (!data?.applications) return { pending: 0, reviewing: 0, shortlisted: 0, accepted: 0, rejected: 0 };

    return data.applications.reduce((acc, app) => {
      const status = app.status as keyof typeof acc;
      if (status in acc) {
        acc[status]++;
      }
      return acc;
    }, { pending: 0, reviewing: 0, shortlisted: 0, accepted: 0, rejected: 0 });
  };

  const getCandidateInsights = () => {
    if (!data?.applications || data.applications.length === 0) {
      return {
        avgExperience: 0,
        topSkills: [] as string[],
        locationDistribution: [] as { location: string; count: number }[]
      };
    }

    // Average experience
    const experienceValues = data.applications
      .map(a => a.profile?.experience_years)
      .filter((e): e is number => e !== null && e !== undefined);

    const avgExperience = experienceValues.length > 0
      ? experienceValues.reduce((sum, e) => sum + e, 0) / experienceValues.length
      : 0;

    // Top skills
    const skillCounts: Record<string, number> = {};
    data.applications.forEach(app => {
      app.profile?.skills?.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill]) => skill);

    // Location distribution
    const locationCounts: Record<string, number> = {};
    data.applications.forEach(app => {
      const location = app.profile?.location || 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    const locationDistribution = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));

    return { avgExperience, topSkills, locationDistribution };
  };

  const statusCounts = getApplicationStatusCounts();
  const candidateInsights = getCandidateInsights();
  const jobPerformance = getJobPerformance();

  // Response rate (shortlisted + accepted + rejected as "responded")
  const respondedCount = statusCounts.shortlisted + statusCounts.accepted + statusCounts.rejected;
  const responseRate = data?.totalApplications
    ? ((respondedCount / data.totalApplications) * 100).toFixed(1)
    : '0.0';

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    iconColor: string;
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`${iconColor} rounded-lg p-3`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <CompanyDashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading analytics...</span>
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
            <h1 className="text-2xl font-semibold text-gray-900">Analytics & Insights</h1>
            <p className="text-gray-600 mt-1">Track your hiring performance and optimize your recruitment strategy</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
              aria-label="Select time range"
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={data?.totalViews.toLocaleString() || '0'}
            subtitle="Across all jobs"
            icon={Eye}
            iconColor="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Applications"
            value={data?.totalApplications || 0}
            subtitle={`In selected period`}
            icon={Users}
            iconColor="bg-green-50 text-green-600"
          />
          <StatCard
            title="Response Rate"
            value={`${responseRate}%`}
            subtitle="Applications reviewed"
            icon={MessageSquare}
            iconColor="bg-purple-50 text-purple-600"
          />
          <StatCard
            title="Active Jobs"
            value={data?.activeJobs || 0}
            subtitle={`of ${data?.totalJobs || 0} total`}
            icon={Briefcase}
            iconColor="bg-orange-50 text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Job Performance */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Job Performance</h3>
              <Link href="/company/dashboard/jobs" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                View All Jobs
              </Link>
            </div>
            {jobPerformance.length > 0 ? (
              <div className="space-y-4">
                {jobPerformance.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{job.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {job.views_count} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.applications_count} applications
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'active' ? 'bg-green-100 text-green-800' :
                          job.status === 'closed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-semibold text-gray-900">{job.conversionRate}%</p>
                      <p className="text-sm text-gray-500">conversion</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No jobs posted yet</p>
                <Link href="/post-job" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block">
                  Post your first job
                </Link>
              </div>
            )}
          </div>

          {/* Application Pipeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Pipeline</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Pending Review</span>
                </div>
                <span className="text-lg font-semibold text-blue-900">{statusCounts.pending}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Under Review</span>
                </div>
                <span className="text-lg font-semibold text-yellow-900">{statusCounts.reviewing}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Shortlisted</span>
                </div>
                <span className="text-lg font-semibold text-purple-900">{statusCounts.shortlisted}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Accepted</span>
                </div>
                <span className="text-lg font-semibold text-green-900">{statusCounts.accepted}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-900">Rejected</span>
                </div>
                <span className="text-lg font-semibold text-red-900">{statusCounts.rejected}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Insights */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Candidate Insights</h3>
          {data?.totalApplications && data.totalApplications > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Average Experience</h4>
                  <span className="text-lg font-semibold text-blue-600">
                    {candidateInsights.avgExperience.toFixed(1)} years
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Top Skills</h4>
                {candidateInsights.topSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {candidateInsights.topSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No skill data available</p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Location Distribution</h4>
                {candidateInsights.locationDistribution.length > 0 ? (
                  <div className="space-y-2">
                    {candidateInsights.locationDistribution.map((loc, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{loc.location}</span>
                        <span className="font-medium text-gray-900">{loc.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No location data available</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No applications yet to analyze</p>
              <p className="text-sm mt-1">Insights will appear once candidates start applying</p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {data && data.totalJobs > 0 && (
          <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.totalApplications === 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Increase Visibility</h4>
                  </div>
                  <p className="text-sm text-blue-800">
                    Your jobs haven&apos;t received applications yet. Consider promoting your listings or improving job descriptions.
                  </p>
                </div>
              )}

              {data.activeJobs === 0 && data.totalJobs > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-900">Activate Jobs</h4>
                  </div>
                  <p className="text-sm text-yellow-800">
                    You have no active job postings. Reactivate existing jobs or post new ones to attract candidates.
                  </p>
                </div>
              )}

              {statusCounts.pending > 5 && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium text-purple-900">Review Applications</h4>
                  </div>
                  <p className="text-sm text-purple-800">
                    You have {statusCounts.pending} pending applications. Faster responses improve candidate experience.
                  </p>
                </div>
              )}

              {candidateInsights.topSkills.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Optimize Keywords</h4>
                  </div>
                  <p className="text-sm text-green-800">
                    Top candidate skills: {candidateInsights.topSkills.slice(0, 3).join(', ')}. Use these in your job descriptions.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CompanyDashboardLayout>
  );
}
