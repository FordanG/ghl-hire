'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  Eye,
  Users,
  FileText,
  Bookmark,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Briefcase
} from 'lucide-react';

interface JobAnalytics {
  job_id: string;
  job_title: string;
  total_views: number;
  total_applications: number;
  total_saves: number;
  conversion_rate: number;
  recent_views: number;
  recent_applications: number;
  trend: 'up' | 'down' | 'neutral';
}

interface TimeSeriesData {
  date: string;
  views: number;
  applications: number;
  saves: number;
}

interface OverviewStats {
  totalViews: number;
  totalApplications: number;
  totalSaves: number;
  averageConversionRate: number;
  viewsChange: number;
  applicationsChange: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobAnalytics, setJobAnalytics] = useState<JobAnalytics[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [overviewStats, setOverviewStats] = useState<OverviewStats>({
    totalViews: 0,
    totalApplications: 0,
    totalSaves: 0,
    averageConversionRate: 0,
    viewsChange: 0,
    applicationsChange: 0
  });
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '30days' | '90days'>('30days');
  const [selectedJob, setSelectedJob] = useState<string>('all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchAnalytics();
  }, [user, selectedPeriod, selectedJob]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get company
      const { data: companyData } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!companyData) {
        router.push('/company/dashboard');
        return;
      }

      // Get all jobs for this company
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('company_id', companyData.id);

      if (!jobs || jobs.length === 0) {
        setLoading(false);
        return;
      }

      const jobIds = jobs.map(j => j.id);

      // Calculate date range
      const daysAgo = selectedPeriod === '7days' ? 7 : selectedPeriod === '30days' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - daysAgo);

      // Fetch job analytics
      const { data: analyticsData } = await supabase
        .from('job_analytics')
        .select('*')
        .in('job_id', selectedJob === 'all' ? jobIds : [selectedJob])
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      // Fetch previous period for comparison
      const { data: prevAnalyticsData } = await supabase
        .from('job_analytics')
        .select('*')
        .in('job_id', selectedJob === 'all' ? jobIds : [selectedJob])
        .gte('date', prevStartDate.toISOString().split('T')[0])
        .lt('date', startDate.toISOString().split('T')[0]);

      // Process job-level analytics
      const jobStats: JobAnalytics[] = jobs.map(job => {
        const jobData = analyticsData?.filter(a => a.job_id === job.id) || [];
        const prevJobData = prevAnalyticsData?.filter(a => a.job_id === job.id) || [];

        const totalViews = jobData.reduce((sum, d) => sum + (d.views_count || 0), 0);
        const totalApplications = jobData.reduce((sum, d) => sum + (d.applications_count || 0), 0);
        const totalSaves = jobData.reduce((sum, d) => sum + (d.saves_count || 0), 0);

        const prevViews = prevJobData.reduce((sum, d) => sum + (d.views_count || 0), 0);

        const conversionRate = totalViews > 0 ? (totalApplications / totalViews) * 100 : 0;

        let trend: 'up' | 'down' | 'neutral' = 'neutral';
        if (prevViews > 0) {
          const change = ((totalViews - prevViews) / prevViews) * 100;
          trend = change > 10 ? 'up' : change < -10 ? 'down' : 'neutral';
        }

        return {
          job_id: job.id,
          job_title: job.title,
          total_views: totalViews,
          total_applications: totalApplications,
          total_saves: totalSaves,
          conversion_rate: conversionRate,
          recent_views: totalViews,
          recent_applications: totalApplications,
          trend
        };
      });

      setJobAnalytics(jobStats);

      // Process time series data
      const dateMap = new Map<string, TimeSeriesData>();
      analyticsData?.forEach(a => {
        const existing = dateMap.get(a.date) || { date: a.date, views: 0, applications: 0, saves: 0 };
        existing.views += a.views_count || 0;
        existing.applications += a.applications_count || 0;
        existing.saves += a.saves_count || 0;
        dateMap.set(a.date, existing);
      });

      setTimeSeriesData(Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date)));

      // Calculate overview stats
      const totalViews = jobStats.reduce((sum, j) => sum + j.total_views, 0);
      const totalApplications = jobStats.reduce((sum, j) => sum + j.total_applications, 0);
      const totalSaves = jobStats.reduce((sum, j) => sum + j.total_saves, 0);

      const prevTotalViews = prevAnalyticsData?.reduce((sum, d) => sum + (d.views_count || 0), 0) || 0;
      const prevTotalApplications = prevAnalyticsData?.reduce((sum, d) => sum + (d.applications_count || 0), 0) || 0;

      const viewsChange = prevTotalViews > 0 ? ((totalViews - prevTotalViews) / prevTotalViews) * 100 : 0;
      const applicationsChange = prevTotalApplications > 0 ? ((totalApplications - prevTotalApplications) / prevTotalApplications) * 100 : 0;

      setOverviewStats({
        totalViews,
        totalApplications,
        totalSaves,
        averageConversionRate: totalViews > 0 ? (totalApplications / totalViews) * 100 : 0,
        viewsChange,
        applicationsChange
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {change > 0 ? <ArrowUp className="w-4 h-4" /> : change < 0 ? <ArrowDown className="w-4 h-4" /> : null}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Track performance and insights for your job postings
              </p>
            </div>
            <Link
              href="/company/dashboard"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>

            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Jobs</option>
              {jobAnalytics.map(job => (
                <option key={job.job_id} value={job.job_id}>
                  {job.job_title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={overviewStats.totalViews}
            change={overviewStats.viewsChange}
            icon={Eye}
            color="bg-blue-600"
          />
          <StatCard
            title="Total Applications"
            value={overviewStats.totalApplications}
            change={overviewStats.applicationsChange}
            icon={Users}
            color="bg-green-600"
          />
          <StatCard
            title="Total Saves"
            value={overviewStats.totalSaves}
            icon={Bookmark}
            color="bg-purple-600"
          />
          <StatCard
            title="Avg. Conversion Rate"
            value={`${overviewStats.averageConversionRate.toFixed(1)}%`}
            icon={TrendingUp}
            color="bg-orange-600"
          />
        </div>

        {/* Time Series Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Performance Over Time</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization would be displayed here</p>
              <p className="text-sm mt-1">Integrate with a charting library like Chart.js or Recharts</p>
            </div>
          </div>
        </div>

        {/* Job Performance Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Job Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saves
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobAnalytics.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No analytics data available yet</p>
                      <p className="text-sm text-gray-400 mt-1">Post jobs and track their performance here</p>
                    </td>
                  </tr>
                ) : (
                  jobAnalytics.map((job) => (
                    <tr key={job.job_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/jobs/${job.job_id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {job.job_title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          {job.total_views}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          {job.total_applications}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Bookmark className="w-4 h-4 text-gray-400" />
                          {job.total_saves}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.conversion_rate > 5 ? 'bg-green-100 text-green-800' :
                          job.conversion_rate > 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {job.conversion_rate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {job.trend === 'up' && (
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">Trending Up</span>
                          </div>
                        )}
                        {job.trend === 'down' && (
                          <div className="flex items-center gap-1 text-red-600">
                            <ArrowDown className="w-4 h-4" />
                            <span className="text-sm font-medium">Declining</span>
                          </div>
                        )}
                        {job.trend === 'neutral' && (
                          <span className="text-sm text-gray-500">Stable</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
