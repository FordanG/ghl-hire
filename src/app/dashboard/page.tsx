'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingUp,
  FileText,
  Bookmark,
  CheckCircle,
  Clock,
  ArrowRight,
  Briefcase,
  Plus
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function CandidateDashboard() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (!authLoading && !profile) {
      router.push('/company/dashboard');
      return;
    }

    if (profile) {
      fetchData();
    }
  }, [authLoading, user, profile, router]);

  const fetchData = async () => {
    if (!profile) return;

    try {
      // Fetch applications
      const { data: appsData } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(
            *,
            company:companies(*)
          )
        `)
        .eq('profile_id', profile.id)
        .order('applied_at', { ascending: false })
        .limit(5);

      setApplications(appsData || []);

      // Fetch saved jobs
      const { data: savedData } = await supabase
        .from('saved_jobs')
        .select(`
          *,
          job:jobs(
            *,
            company:companies(*)
          )
        `)
        .eq('profile_id', profile.id)
        .order('saved_at', { ascending: false })
        .limit(5);

      setSavedJobs(savedData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = {
    totalApplications: applications.length,
    activeApplications: applications.filter(app =>
      ['pending', 'reviewing', 'shortlisted'].includes(app.status)
    ).length,
    savedJobs: savedJobs.length,
    profileComplete: calculateProfileCompletion(),
  };

  function calculateProfileCompletion() {
    if (!profile) return 0;
    let completed = 0;
    const total = 8;

    if (profile.full_name) completed++;
    if (profile.email) completed++;
    if (profile.phone) completed++;
    if (profile.location) completed++;
    if (profile.bio) completed++;
    if (profile.resume_url) completed++;
    if (profile.skills && profile.skills.length > 0) completed++;
    if (profile.experience_years) completed++;

    return Math.round((completed / total) * 100);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
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
        {stats.profileComplete < 100 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-medium text-blue-900">Complete your profile to stand out</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Your profile is {stats.profileComplete}% complete. Add more details to increase your chances!
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/profile"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No applications yet</p>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{app.job?.title}</h3>
                          <p className="text-sm text-gray-600">{app.job?.company?.company_name}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Applied {formatDate(app.applied_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Saved Jobs */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Saved Jobs</h2>
                <Link
                  href="/dashboard/saved"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {savedJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No saved jobs yet</p>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedJobs.map((saved) => (
                    <Link
                      key={saved.id}
                      href={`/jobs/${saved.job.id}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 mb-1">{saved.job.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{saved.job.company.company_name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{saved.job.location}</span>
                        <span>•</span>
                        <span>{saved.job.job_type}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/jobs"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="bg-blue-100 rounded-lg p-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Browse Jobs</p>
                <p className="text-sm text-gray-600">Find new opportunities</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="bg-purple-100 rounded-lg p-2">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Update Profile</p>
                <p className="text-sm text-gray-600">Keep your info current</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
            </Link>

            <Link
              href="/dashboard/alerts"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="bg-green-100 rounded-lg p-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Job Alerts</p>
                <p className="text-sm text-gray-600">Set up notifications</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
