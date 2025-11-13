'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Edit,
  Save,
  Upload,
  ExternalLink,
  Loader2,
  Briefcase,
  Mail
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { ToastContainer } from '@/components/ui/toast';
import {
  getCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo,
  type CompanyFormData
} from '@/lib/actions/company-actions';
import { calculateCompanyProfileCompletion } from '@/lib/utils/company-utils';
import { Database } from '@/types/supabase';

type Company = Database['public']['Tables']['companies']['Row'];

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Form state
  const [formData, setFormData] = useState<CompanyFormData>({
    company_name: '',
    email: '',
    website: '',
    description: '',
    size: '',
    industry: '',
    location: ''
  });

  // Auto-save
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { toasts, removeToast, success, error: showError } = useToast();

  // Load company profile on mount
  useEffect(() => {
    loadCompanyProfile();
  }, []);

  // Calculate profile completion when company changes
  useEffect(() => {
    if (company) {
      const completion = calculateCompanyProfileCompletion(company);
      setProfileCompletion(completion);
    }
  }, [company]);

  const loadCompanyProfile = async () => {
    setIsLoading(true);
    const result = await getCompanyProfile();

    if (result.success && result.data) {
      setCompany(result.data);
      setFormData({
        company_name: result.data.company_name,
        email: result.data.email,
        website: result.data.website || '',
        description: result.data.description || '',
        size: result.data.size || '',
        industry: result.data.industry || '',
        location: result.data.location || ''
      });
    } else {
      showError(result.error || 'Failed to load company profile');
    }

    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);

    const result = await updateCompanyProfile(formData);

    if (result.success && result.data) {
      setCompany(result.data);
      setIsEditing(false);
      setLastSaved(new Date());
      success('Company profile updated successfully!');
    } else {
      showError(result.error || 'Failed to update company profile');
    }

    setIsSaving(false);
  };

  const handleAutoSave = useCallback(async () => {
    if (!isEditing) return;

    const result = await updateCompanyProfile(formData);

    if (result.success && result.data) {
      setCompany(result.data);
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadCompanyLogo(formData);

    if (result.success && result.data) {
      setCompany(result.data);
      success('Company logo uploaded successfully!');
    } else {
      showError(result.error || 'Failed to upload logo');
    }

    setIsUploadingLogo(false);
    e.target.value = ''; // Reset input
  };

  const updateFormData = (updates: Partial<CompanyFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  if (isLoading) {
    return (
      <CompanyDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Company Profile</h1>
            <p className="text-gray-600 mt-1">Manage your company information and public profile</p>
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
                    // Reset form data to company
                    if (company) {
                      setFormData({
                        company_name: company.company_name,
                        email: company.email,
                        website: company.website || '',
                        description: company.description || '',
                        size: company.size || '',
                        industry: company.industry || '',
                        location: company.location || ''
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

        {/* Company Header Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                {company?.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.company_name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-blue-600" />
                  </div>
                )}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="mt-2 text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    disabled={isUploadingLogo}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => updateFormData({ company_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{company?.company_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData({ email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{company?.email}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  {isEditing ? (
                    <select
                      value={formData.size}
                      onChange={(e) => updateFormData({ size: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{company?.size || 'Not specified'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => updateFormData({ industry: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="e.g., SaaS, Marketing Agency"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{company?.industry || 'Not specified'}</span>
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="San Francisco, CA"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{company?.location || 'Not specified'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => updateFormData({ website: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="https://yourcompany.com"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      {company?.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {company.website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Description</h3>
          {isEditing ? (
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Tell candidates about your company, mission, culture, and what makes you unique in the GoHighLevel ecosystem..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {company?.description || 'No description provided yet.'}
            </p>
          )}
          {isEditing && (
            <p className="text-sm text-gray-500 mt-2">
              {(formData.description || '').length} characters
            </p>
          )}
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
