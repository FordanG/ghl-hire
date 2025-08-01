'use client';

import { useState } from 'react';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  Target,
  Calendar,
  Download,
  Filter,
  Briefcase,
  UserCheck,
  MessageSquare,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { mockCompanyStats, mockJobPostings, mockApplications } from '@/lib/company-data';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalViews: 1248,
      totalApplications: 89,
      responseRate: 72.4,
      timeToHire: 18,
      trends: {
        views: 15.2,
        applications: -8.3,
        responseRate: 4.1,
        timeToHire: -12.5
      }
    },
    jobPerformance: [
      { jobTitle: 'Senior GoHighLevel Consultant', views: 456, applications: 24, conversionRate: 5.3, status: 'active' },
      { jobTitle: 'GoHighLevel Implementation Specialist', views: 289, applications: 18, conversionRate: 6.2, status: 'active' },
      { jobTitle: 'Marketing Automation Developer', views: 234, applications: 12, conversionRate: 5.1, status: 'paused' },
    ],
    applicationSources: [
      { source: 'Direct Apply', count: 42, percentage: 47.2 },
      { source: 'Job Alerts', count: 28, percentage: 31.5 },
      { source: 'Company Profile', count: 19, percentage: 21.3 },
    ],
    candidateInsights: {
      avgExperience: 4.2,
      topSkills: ['GoHighLevel', 'Marketing Automation', 'CRM', 'Lead Generation', 'API Integration'],
      locationDistribution: [
        { location: 'Remote', count: 34 },
        { location: 'Austin, TX', count: 18 },
        { location: 'San Francisco, CA', count: 12 },
        { location: 'New York, NY', count: 8 },
        { location: 'Other', count: 17 }
      ]
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    trend, 
    trendValue, 
    icon: Icon, 
    iconColor 
  }: {
    title: string;
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
    trendValue: number;
    icon: any;
    iconColor: string;
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : trend === 'down' ? (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            ) : null}
            <span className={`text-sm ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend !== 'neutral' && (trend === 'up' ? '+' : '')}{trendValue}%
            </span>
            <span className="text-sm text-gray-500">vs last period</span>
          </div>
        </div>
        <div className={`${iconColor} rounded-lg p-3`}>
          <Icon className="w-6 h-6" />
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
            <h1 className="text-2xl font-semibold text-gray-900">Analytics & Insights</h1>
            <p className="text-gray-600 mt-1">Track your hiring performance and optimize your recruitment strategy</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={analyticsData.overview.totalViews.toLocaleString()}
            trend="up"
            trendValue={analyticsData.overview.trends.views}
            icon={Eye}
            iconColor="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Applications"
            value={analyticsData.overview.totalApplications}
            trend="down"
            trendValue={analyticsData.overview.trends.applications}
            icon={Users}
            iconColor="bg-green-50 text-green-600"
          />
          <StatCard
            title="Response Rate"
            value={`${analyticsData.overview.responseRate}%`}
            trend="up"
            trendValue={analyticsData.overview.trends.responseRate}
            icon={MessageSquare}
            iconColor="bg-purple-50 text-purple-600"
          />
          <StatCard
            title="Avg Time to Hire"
            value={`${analyticsData.overview.timeToHire} days`}
            trend="up"
            trendValue={analyticsData.overview.trends.timeToHire}
            icon={Clock}
            iconColor="bg-orange-50 text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Job Performance */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Job Performance</h3>
              <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                View All Jobs
              </button>
            </div>
            <div className="space-y-4">
              {analyticsData.jobPerformance.map((job, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{job.jobTitle}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {job.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.applications} applications
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
          </div>

          {/* Application Sources */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Sources</h3>
            <div className="space-y-4">
              {analyticsData.applicationSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {source.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Candidate Insights */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Candidate Insights</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Average Experience</h4>
                  <span className="text-lg font-semibold text-blue-600">
                    {analyticsData.candidateInsights.avgExperience} years
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Top Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {analyticsData.candidateInsights.topSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Location Distribution</h4>
                <div className="space-y-2">
                  {analyticsData.candidateInsights.locationDistribution.map((location, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{location.location}</span>
                      <span className="font-medium text-gray-900">{location.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hiring Funnel */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Hiring Funnel</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Profile Views</span>
                </div>
                <span className="text-lg font-semibold text-blue-900">1,248</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Applications</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-green-900">89</span>
                  <p className="text-sm text-green-700">7.1% conversion</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Interviews</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-purple-900">24</span>
                  <p className="text-sm text-purple-700">27% of applications</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-orange-900">Offers</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-orange-900">8</span>
                  <p className="text-sm text-orange-700">33% of interviews</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-900">Hires</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-emerald-900">3</span>
                  <p className="text-sm text-emerald-700">38% of offers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Increase Visibility</h4>
              </div>
              <p className="text-sm text-blue-800">
                Your job views decreased by 8.3%. Consider boosting your job postings or optimizing job titles for better SEO.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">Faster Response</h4>
              </div>
              <p className="text-sm text-green-800">
                Your response rate improved by 4.1%. Keep responding to applications quickly to maintain candidate interest.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium text-purple-900">Optimize Keywords</h4>
              </div>
              <p className="text-sm text-purple-800">
                Top candidate skills include GoHighLevel and Marketing Automation. Use these keywords in your job descriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}