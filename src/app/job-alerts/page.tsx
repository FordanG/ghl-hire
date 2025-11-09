'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Plus, Trash2, Edit, CheckCircle, AlertCircle, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface JobAlert {
  id: string;
  title: string;
  keywords: string[] | null;
  location: string | null;
  job_type: string | null;
  experience_level: string | null;
  remote_only: boolean;
  salary_min: number | null;
  frequency: string;
  is_active: boolean;
  created_at: string;
}

export default function JobAlertsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    keywords: '',
    location: '',
    job_type: '',
    experience_level: '',
    remote_only: false,
    salary_min: '',
    frequency: 'daily',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin?redirect=/job-alerts');
    }

    if (!authLoading && !profile) {
      router.push('/signup?redirect=/job-alerts');
    }
  }, [authLoading, user, profile, router]);

  useEffect(() => {
    if (profile) {
      fetchAlerts();
    }
  }, [profile]);

  const fetchAlerts = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('job_alerts')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAlerts(data || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      keywords: '',
      location: '',
      job_type: '',
      experience_level: '',
      remote_only: false,
      salary_min: '',
      frequency: 'daily',
    });
    setEditingAlert(null);
  };

  const handleEdit = (alert: JobAlert) => {
    setEditingAlert(alert);
    setFormData({
      title: alert.title,
      keywords: alert.keywords?.join(', ') || '',
      location: alert.location || '',
      job_type: alert.job_type || '',
      experience_level: alert.experience_level || '',
      remote_only: alert.remote_only,
      salary_min: alert.salary_min?.toString() || '',
      frequency: alert.frequency,
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!profile) return;

    try {
      const keywords = formData.keywords
        ? formData.keywords.split(',').map(k => k.trim()).filter(k => k)
        : null;

      const alertData = {
        profile_id: profile.id,
        title: formData.title,
        keywords,
        location: formData.location || null,
        job_type: formData.job_type || null,
        experience_level: formData.experience_level || null,
        remote_only: formData.remote_only,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        frequency: formData.frequency,
        is_active: true,
      };

      if (editingAlert) {
        // Update existing alert
        const { error } = await supabase
          .from('job_alerts')
          .update(alertData)
          .eq('id', editingAlert.id);

        if (error) throw error;
        setSuccess('Job alert updated successfully!');
      } else {
        // Create new alert
        const { error } = await supabase
          .from('job_alerts')
          .insert([alertData]);

        if (error) throw error;
        setSuccess('Job alert created successfully!');
      }

      setShowCreateModal(false);
      resetForm();
      fetchAlerts();
    } catch (err: any) {
      console.error('Error saving alert:', err);
      setError(err.message || 'Failed to save job alert');
    }
  };

  const handleDelete = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this job alert?')) return;

    try {
      const { error } = await supabase
        .from('job_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      setSuccess('Job alert deleted successfully!');
      fetchAlerts();
    } catch (err: any) {
      console.error('Error deleting alert:', err);
      setError(err.message || 'Failed to delete job alert');
    }
  };

  const toggleActive = async (alert: JobAlert) => {
    try {
      const { error } = await supabase
        .from('job_alerts')
        .update({ is_active: !alert.is_active })
        .eq('id', alert.id);

      if (error) throw error;

      setSuccess(`Job alert ${!alert.is_active ? 'activated' : 'paused'} successfully!`);
      fetchAlerts();
    } catch (err: any) {
      console.error('Error toggling alert:', err);
      setError(err.message || 'Failed to update job alert');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />

      <div className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between fade-in fade-in-1">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight mb-2">Job Alerts</h1>
              <p className="text-gray-600">
                Get notified when new jobs match your criteria
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Alert
            </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 fade-in">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
              <button onClick={() => setSuccess(null)} className="ml-auto">
                <X className="w-4 h-4 text-green-600" />
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}

          {/* Alerts List */}
          {alerts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 fade-in fade-in-2">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No job alerts yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first job alert to get notified about new opportunities
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Alert
              </button>
            </div>
          ) : (
            <div className="space-y-4 fade-in fade-in-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-white border rounded-lg p-6 transition-opacity ${
                    !alert.is_active ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            alert.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {alert.is_active ? 'Active' : 'Paused'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                        {alert.keywords && alert.keywords.length > 0 && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            Keywords: {alert.keywords.join(', ')}
                          </span>
                        )}
                        {alert.location && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {alert.location}
                          </span>
                        )}
                        {alert.job_type && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {alert.job_type}
                          </span>
                        )}
                        {alert.experience_level && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {alert.experience_level}
                          </span>
                        )}
                        {alert.remote_only && (
                          <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                            Remote Only
                          </span>
                        )}
                        {alert.salary_min && (
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                            ${alert.salary_min.toLocaleString()}+ salary
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500">
                        Frequency: {alert.frequency.charAt(0).toUpperCase() + alert.frequency.slice(1)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleActive(alert)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          alert.is_active
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {alert.is_active ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(alert)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {editingAlert ? 'Edit Job Alert' : 'Create Job Alert'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="e.g., Senior GHL Developer Jobs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="e.g., GoHighLevel, automation, funnel"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  >
                    <option value="">Any</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={formData.experience_level}
                    onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  >
                    <option value="">Any</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Frequency <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                >
                  <option value="instant">Instant (as jobs are posted)</option>
                  <option value="daily">Daily digest</option>
                  <option value="weekly">Weekly digest</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remote_only"
                  checked={formData.remote_only}
                  onChange={(e) => setFormData({ ...formData, remote_only: e.target.checked })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remote_only" className="text-sm font-medium text-gray-700">
                  Remote jobs only
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingAlert ? 'Update Alert' : 'Create Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
