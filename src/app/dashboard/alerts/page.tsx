'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  MapPin,
  DollarSign,
  Clock,
  Settings,
  Mail,
  CheckCircle,
  Loader2,
  X
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  getJobAlerts,
  createJobAlert,
  toggleJobAlert,
  deleteJobAlert,
  type JobAlert,
  type JobAlertFormData
} from '@/lib/actions/job-alerts-actions';

export default function JobAlertsPage() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [newAlert, setNewAlert] = useState<JobAlertFormData>({
    title: '',
    keywords: [],
    location: '',
    job_type: '',
    salary_min: undefined,
    frequency: 'weekly'
  });
  const [keywordString, setKeywordString] = useState('');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    setError(null);

    const result = await getJobAlerts();

    if (result.success && result.data) {
      setAlerts(result.data);
    } else {
      setError(result.error || 'Failed to load job alerts');
    }

    setLoading(false);
  };

  const handleCreateAlert = async () => {
    if (!newAlert.title) {
      setError('Alert name is required');
      return;
    }

    setCreating(true);
    setError(null);

    const keywords = keywordString
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const result = await createJobAlert({
      ...newAlert,
      keywords: keywords.length > 0 ? keywords : undefined,
      salary_min: newAlert.salary_min || undefined
    });

    if (result.success && result.data) {
      setAlerts(prev => [result.data!, ...prev]);
      setNewAlert({
        title: '',
        keywords: [],
        location: '',
        job_type: '',
        salary_min: undefined,
        frequency: 'weekly'
      });
      setKeywordString('');
      setShowCreateForm(false);
    } else {
      setError(result.error || 'Failed to create job alert');
    }

    setCreating(false);
  };

  const handleToggleAlert = async (id: string) => {
    setTogglingId(id);

    const result = await toggleJobAlert(id);

    if (result.success && result.data) {
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === id ? result.data! : alert
        )
      );
    } else {
      setError(result.error || 'Failed to update alert');
    }

    setTogglingId(null);
  };

  const handleDeleteAlert = async (id: string) => {
    setDeletingId(id);

    const result = await deleteJobAlert(id);

    if (result.success) {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    } else {
      setError(result.error || 'Failed to delete alert');
    }

    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const activeCount = alerts.filter(a => a.is_active).length;

  const AlertCard = ({ alert }: { alert: JobAlert }) => {
    const isToggling = togglingId === alert.id;
    const isDeleting = deletingId === alert.id;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                alert.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {alert.is_active ? 'Active' : 'Paused'}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              {alert.keywords && alert.keywords.length > 0 && (
                <div>
                  <strong>Keywords:</strong> {alert.keywords.join(', ')}
                </div>
              )}
              {alert.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{alert.location}</span>
                </div>
              )}
              {alert.job_type && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{alert.job_type}</span>
                </div>
              )}
              {alert.salary_min && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Min ${alert.salary_min.toLocaleString()}</span>
                </div>
              )}
              <div>
                <strong>Frequency:</strong> {alert.frequency}
              </div>
              <div className="text-xs text-gray-500">
                Created {formatDate(alert.created_at)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              type="button"
              onClick={() => handleToggleAlert(alert.id)}
              disabled={isToggling || isDeleting}
              className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                alert.is_active
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
              title={alert.is_active ? 'Pause alert' : 'Activate alert'}
            >
              {isToggling ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleDeleteAlert(alert.id)}
              disabled={isToggling || isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete alert"
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {alert.is_active
                ? `Next notification: ${alert.frequency === 'daily' ? 'Tomorrow' : alert.frequency === 'instant' ? 'When matched' : 'Next week'}`
                : 'Notifications paused'}
            </span>
            <div className="flex items-center gap-2 text-gray-500">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading job alerts...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Job Alerts</h1>
            <p className="text-gray-600">Get notified when new jobs match your criteria</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Alert
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
              title="Dismiss error"
              aria-label="Dismiss error"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-semibold text-gray-900">{activeCount}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-semibold text-gray-900">{alerts.length}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
                <p className="text-xs text-gray-500">Jobs matched</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Create Alert Form */}
        {showCreateForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Job Alert</h3>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
                title="Close form"
                aria-label="Close form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Name *
                </label>
                <input
                  type="text"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Senior GHL Remote Jobs"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={keywordString}
                  onChange={(e) => setKeywordString(e.target.value)}
                  placeholder="GoHighLevel, Marketing Automation, CRM (comma separated)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={newAlert.location || ''}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Remote, Austin, TX, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type (Optional)
                </label>
                <select
                  value={newAlert.job_type || ''}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, job_type: e.target.value }))}
                  aria-label="Job type filter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  Minimum Salary (Optional)
                </label>
                <input
                  type="number"
                  value={newAlert.salary_min || ''}
                  onChange={(e) => setNewAlert(prev => ({
                    ...prev,
                    salary_min: e.target.value ? parseInt(e.target.value) : undefined
                  }))}
                  placeholder="50000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Frequency
                </label>
                <select
                  value={newAlert.frequency}
                  onChange={(e) => setNewAlert(prev => ({
                    ...prev,
                    frequency: e.target.value as 'daily' | 'weekly' | 'instant'
                  }))}
                  aria-label="Notification frequency"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAlert}
                disabled={!newAlert.title || creating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Alert
              </button>
            </div>
          </div>
        )}

        {/* Alerts List */}
        {alerts.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Your Job Alerts</h2>
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No job alerts yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first job alert to get notified when new GoHighLevel opportunities match your criteria.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Alert
            </button>
          </div>
        )}

        {/* Notification Settings */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive job alerts via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications on your mobile device</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" disabled aria-label="Push notifications toggle" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer opacity-50 cursor-not-allowed"></div>
              </label>
            </div>
            <p className="text-xs text-gray-500">Push notifications coming soon</p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Job Alert Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Use Specific Keywords</h4>
              <p className="text-blue-700">
                Include specific GoHighLevel terms like &ldquo;GHL,&rdquo; &ldquo;automation workflows,&rdquo; or &ldquo;white label&rdquo; for better matches.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Set Realistic Criteria</h4>
              <p className="text-blue-700">
                Avoid overly restrictive filters that might cause you to miss good opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Monitor Performance</h4>
              <p className="text-blue-700">
                Review your alerts regularly and adjust keywords or criteria based on the quality of matches.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Act Quickly</h4>
              <p className="text-blue-700">
                Good GoHighLevel positions often fill quickly. Apply promptly when you receive relevant alerts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
