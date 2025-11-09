'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Save, Bell, Mail, Smartphone } from 'lucide-react';

interface NotificationPreferences {
  email_application_updates: boolean;
  email_new_matches: boolean;
  email_job_alerts: boolean;
  email_messages: boolean;
  email_marketing: boolean;
  inapp_application_updates: boolean;
  inapp_new_matches: boolean;
  inapp_job_alerts: boolean;
  inapp_messages: boolean;
  inapp_system: boolean;
  digest_frequency: 'instant' | 'daily' | 'weekly' | 'never';
}

export default function NotificationPreferencesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_application_updates: true,
    email_new_matches: true,
    email_job_alerts: true,
    email_messages: true,
    email_marketing: false,
    inapp_application_updates: true,
    inapp_new_matches: true,
    inapp_job_alerts: true,
    inapp_messages: true,
    inapp_system: true,
    digest_frequency: 'daily'
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get user's profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profileData) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('profile_id', profileData.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPreferences(data);
      }

    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Get user's profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profileData) {
        alert('Profile not found');
        return;
      }

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          profile_id: profileData.id,
          ...preferences
        });

      if (error) throw error;

      alert('Preferences saved successfully!');

    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const PreferenceSection = ({ title, description, icon: Icon }: any) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );

  const PreferenceToggle = ({ label, description, value, onChange }: any) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-200">
      <div className="flex-1">
        <label className="font-medium text-gray-900 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/notifications"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Notifications
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
              <p className="text-gray-600 mt-2">
                Manage how and when you receive notifications
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Email Notifications */}
          <PreferenceSection
            title="Email Notifications"
            description="Choose which email notifications you'd like to receive"
            icon={Mail}
          />

          <PreferenceToggle
            label="Application Updates"
            description="Get notified when your application status changes"
            value={preferences.email_application_updates}
            onChange={(value: boolean) =>
              setPreferences({ ...preferences, email_application_updates: value })
            }
          />

          <PreferenceToggle
            label="New Job Matches"
            description="Receive emails when new jobs match your preferences"
            value={preferences.email_new_matches}
            onChange={(value: boolean) =>
              setPreferences({ ...preferences, email_new_matches: value })
            }
          />

          <PreferenceToggle
            label="Job Alerts"
            description="Get notified about jobs matching your saved searches"
            value={preferences.email_job_alerts}
            onChange={(value: boolean) =>
              setPreferences({ ...preferences, email_job_alerts: value })
            }
          />

          <PreferenceToggle
            label="Messages"
            description="Receive emails when you get new messages"
            value={preferences.email_messages}
            onChange={(value: boolean) =>
              setPreferences({ ...preferences, email_messages: value })
            }
          />

          <PreferenceToggle
            label="Marketing & Updates"
            description="Stay updated with GHL Hire news and features"
            value={preferences.email_marketing}
            onChange={(value: boolean) =>
              setPreferences({ ...preferences, email_marketing: value })
            }
          />

          {/* In-App Notifications */}
          <div className="mt-12">
            <PreferenceSection
              title="In-App Notifications"
              description="Manage notifications you see while using GHL Hire"
              icon={Bell}
            />

            <PreferenceToggle
              label="Application Updates"
              description="Show notifications when your application status changes"
              value={preferences.inapp_application_updates}
              onChange={(value: boolean) =>
                setPreferences({ ...preferences, inapp_application_updates: value })
              }
            />

            <PreferenceToggle
              label="New Job Matches"
              description="Show notifications for new job matches"
              value={preferences.inapp_new_matches}
              onChange={(value: boolean) =>
                setPreferences({ ...preferences, inapp_new_matches: value })
              }
            />

            <PreferenceToggle
              label="Job Alerts"
              description="Show notifications from your job alerts"
              value={preferences.inapp_job_alerts}
              onChange={(value: boolean) =>
                setPreferences({ ...preferences, inapp_job_alerts: value })
              }
            />

            <PreferenceToggle
              label="Messages"
              description="Show notifications for new messages"
              value={preferences.inapp_messages}
              onChange={(value: boolean) =>
                setPreferences({ ...preferences, inapp_messages: value })
              }
            />

            <PreferenceToggle
              label="System Announcements"
              description="Show important platform updates and announcements"
              value={preferences.inapp_system}
              onChange={(value: boolean) =>
                setPreferences({ ...preferences, inapp_system: value })
              }
            />
          </div>

          {/* Digest Frequency */}
          <div className="mt-12">
            <PreferenceSection
              title="Email Digest Frequency"
              description="Choose how often to receive email summaries"
              icon={Smartphone}
            />

            <div className="space-y-3">
              {[
                { value: 'instant', label: 'Instant', description: 'Send emails immediately' },
                { value: 'daily', label: 'Daily', description: 'One email per day with updates' },
                { value: 'weekly', label: 'Weekly', description: 'One email per week with updates' },
                { value: 'never', label: 'Never', description: 'No email digests (individual emails only)' }
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="digest_frequency"
                    value={option.value}
                    checked={preferences.digest_frequency === option.value}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        digest_frequency: e.target.value as any
                      })
                    }
                    className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button (bottom) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? 'Saving Changes...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
