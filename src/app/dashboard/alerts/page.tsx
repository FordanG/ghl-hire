'use client';

import { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  DollarSign,
  Clock,
  Settings,
  Mail,
  CheckCircle
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { mockJobAlerts, type JobAlert } from '@/lib/dashboard-data';

export default function JobAlertsPage() {
  const [alerts, setAlerts] = useState<JobAlert[]>(mockJobAlerts);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newAlert, setNewAlert] = useState({
    name: '',
    keywords: [] as string[],
    keywordString: '',
    location: '',
    jobType: '',
    salaryMin: '',
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly'
  });

  const handleCreateAlert = () => {
    const alert: JobAlert = {
      id: Date.now().toString(),
      name: newAlert.name,
      keywords: newAlert.keywordString.split(',').map(k => k.trim()).filter(k => k),
      location: newAlert.location || undefined,
      jobType: newAlert.jobType || undefined,
      salaryMin: newAlert.salaryMin ? parseInt(newAlert.salaryMin) : undefined,
      frequency: newAlert.frequency,
      active: true,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setAlerts(prev => [...prev, alert]);
    setNewAlert({
      name: '',
      keywords: [],
      keywordString: '',
      location: '',
      jobType: '',
      salaryMin: '',
      frequency: 'weekly'
    });
    setShowCreateForm(false);
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const AlertCard = ({ alert }: { alert: JobAlert }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{alert.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              alert.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {alert.active ? 'Active' : 'Paused'}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <strong>Keywords:</strong> {alert.keywords.join(', ')}
            </div>
            {alert.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{alert.location}</span>
              </div>
            )}
            {alert.jobType && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{alert.jobType}</span>
              </div>
            )}
            {alert.salaryMin && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>Min ${alert.salaryMin.toLocaleString()}</span>
              </div>
            )}
            <div>
              <strong>Frequency:</strong> {alert.frequency}
            </div>
            <div className="text-xs text-gray-500">
              Created {alert.createdDate}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => toggleAlert(alert.id)}
            className={`p-2 rounded-lg transition-colors ${
              alert.active 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            title={alert.active ? 'Pause alert' : 'Activate alert'}
          >
            <CheckCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => setEditingAlert(alert)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit alert"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => deleteAlert(alert.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete alert"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Next notification: {alert.frequency === 'daily' ? 'Tomorrow' : 'Next week'}
          </span>
          <div className="flex items-center gap-2 text-gray-500">
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </div>
        </div>
      </div>
    </div>
  );

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
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Alert
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {alerts.filter(alert => alert.active).length}
                </p>
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
                <p className="text-2xl font-semibold text-gray-900">12</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Job Alert</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Name *
                </label>
                <input
                  type="text"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Senior GHL Remote Jobs"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords *
                </label>
                <input
                  type="text"
                  value={newAlert.keywordString}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, keywordString: e.target.value }))}
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
                  value={newAlert.location}
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
                  value={newAlert.jobType}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, jobType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Any</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary (Optional)
                </label>
                <input
                  type="number"
                  value={newAlert.salaryMin}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, salaryMin: e.target.value }))}
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
                  onChange={(e) => setNewAlert(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAlert}
                disabled={!newAlert.name || !newAlert.keywordString}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
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