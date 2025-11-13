'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  User,
  Mail,
  MapPin,
  Edit,
  Save,
  Upload,
  Briefcase,
  FileText,
  Link as LinkIcon,
  Phone,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { ToastContainer } from '@/components/ui/toast';
import {
  getProfile,
  updateProfile,
  uploadResume,
  uploadProfilePhoto,
  type ProfileFormData
} from '@/lib/actions/profile-actions';
import { calculateProfileCompletion } from '@/lib/profile-utils';
import { Database } from '@/types/supabase';
import ProjectsSection from '@/components/ProjectsSection';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    experience_years: 0,
    linkedin_url: '',
    portfolio_url: '',
    is_available: true
  });

  // Auto-save
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { toasts, removeToast, success, error: showError } = useToast();

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Calculate profile completion when profile changes
  useEffect(() => {
    if (profile) {
      const completion = calculateProfileCompletion(profile);
      setProfileCompletion(completion);
    }
  }, [profile]);

  const loadProfile = async () => {
    setIsLoading(true);
    const result = await getProfile();

    if (result.success && result.data) {
      setProfile(result.data);
      setFormData({
        full_name: result.data.full_name,
        email: result.data.email,
        phone: result.data.phone || '',
        location: result.data.location || '',
        bio: result.data.bio || '',
        skills: result.data.skills || [],
        experience_years: result.data.experience_years || 0,
        linkedin_url: result.data.linkedin_url || '',
        portfolio_url: result.data.portfolio_url || '',
        is_available: result.data.is_available ?? true
      });
    } else {
      showError(result.error || 'Failed to load profile');
    }

    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);

    const result = await updateProfile(formData);

    if (result.success && result.data) {
      setProfile(result.data);
      setIsEditing(false);
      setLastSaved(new Date());
      success('Profile updated successfully!');
    } else {
      showError(result.error || 'Failed to update profile');
    }

    setIsSaving(false);
  };

  const handleAutoSave = useCallback(async () => {
    if (!isEditing) return;

    const result = await updateProfile(formData);

    if (result.success && result.data) {
      setProfile(result.data);
      setLastSaved(new Date());
    }
  }, [formData, isEditing]);

  // Trigger auto-save on form changes
  useEffect(() => {
    if (!isEditing) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (3 seconds after last change)
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleAutoSave();
    }, 3000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, isEditing, handleAutoSave]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadResume(formData);

    if (result.success && result.data) {
      setProfile(result.data);
      success('Resume uploaded successfully!');
    } else {
      showError(result.error || 'Failed to upload resume');
    }

    setIsUploadingResume(false);
    e.target.value = ''; // Reset input
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadProfilePhoto(formData);

    if (result.success && result.data) {
      setProfile(result.data);
      success('Profile photo updated successfully!');
    } else {
      showError(result.error || 'Failed to upload photo');
    }

    setIsUploadingPhoto(false);
    e.target.value = ''; // Reset input
  };

  const updateFormData = (updates: Partial<ProfileFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your professional information and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Profile {profileCompletion}% complete
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                {lastSaved && (
                  <span className="text-xs text-gray-500 flex items-center">
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
                <button
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data to profile
                    if (profile) {
                      setFormData({
                        full_name: profile.full_name,
                        email: profile.email,
                        phone: profile.phone || '',
                        location: profile.location || '',
                        bio: profile.bio || '',
                        skills: profile.skills || [],
                        experience_years: profile.experience_years || 0,
                        linkedin_url: profile.linkedin_url || '',
                        portfolio_url: profile.portfolio_url || '',
                        is_available: profile.is_available ?? true
                      });
                    }
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Photo and Basic Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                {profile?.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt={profile.full_name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                )}
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="mt-2 text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => updateFormData({ full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                    required
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile?.full_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{profile?.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData({ phone: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{profile?.phone || 'Not specified'}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => updateFormData({ location: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                      placeholder="City, State"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{profile?.location || 'Not specified'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-6">
          {/* Bio */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Bio</h3>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => updateFormData({ bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                placeholder="Write a brief summary of your professional background and expertise in GoHighLevel..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{profile?.bio || 'No bio provided yet.'}</p>
            )}
          </div>

          {/* Skills and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
              {isEditing ? (
                <div>
                  <textarea
                    value={typeof formData.skills === 'string' ? formData.skills : formData.skills?.join(', ') || ''}
                    onChange={(e) => updateFormData({
                      skills: e.target.value as any
                    })}
                    onBlur={(e) => {
                      // Only split into array on blur
                      const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                      updateFormData({ skills: skillsArray });
                    }}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                    placeholder="Enter skills separated by commas (e.g., GoHighLevel, Marketing Automation, CRM)"
                  />
                  <p className="text-sm text-gray-500 mt-2">Separate skills with commas</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills added yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* Experience Years */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Years of Experience
              </h3>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience_years || 0}
                  onChange={(e) => updateFormData({ experience_years: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              ) : (
                <p className="text-3xl font-bold text-blue-600">
                  {profile?.experience_years || 0} {profile?.experience_years === 1 ? 'year' : 'years'}
                </p>
              )}
              <label className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => updateFormData({ is_available: e.target.checked })}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Available for opportunities</span>
              </label>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Professional Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => updateFormData({ linkedin_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                ) : profile?.linkedin_url ? (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {profile.linkedin_url}
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.portfolio_url}
                    onChange={(e) => updateFormData({ portfolio_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                    placeholder="https://yourportfolio.com"
                  />
                ) : profile?.portfolio_url ? (
                  <a
                    href={profile.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {profile.portfolio_url}
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Resume */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {profile?.resume_url ? 'Resume.pdf' : 'No resume uploaded'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {profile?.resume_url
                      ? `Last updated ${new Date(profile.updated_at || '').toLocaleDateString()}`
                      : 'Upload your resume to get better job matches'}
                  </p>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                {isUploadingResume ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {isUploadingResume ? 'Uploading...' : (profile?.resume_url ? 'Update' : 'Upload')}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={isUploadingResume}
                  className="hidden"
                />
              </label>
            </div>
            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-sm text-blue-600 hover:underline inline-block"
              >
                View current resume
              </a>
            )}
          </div>

          {/* Projects Section */}
          {profile?.id && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <ProjectsSection profileId={profile.id} />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
