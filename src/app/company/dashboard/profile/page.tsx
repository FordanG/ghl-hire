'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Edit,
  Save,
  Upload,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function CompanyProfilePage() {
  const router = useRouter();
  const { user, company: authCompany, loading: authLoading, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    description: '',
    website: '',
    location: '',
    company_size: '',
    logo_url: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }

    if (!authLoading && !authCompany) {
      router.push('/signup');
    }
  }, [authLoading, user, authCompany, router]);

  useEffect(() => {
    if (authCompany) {
      setFormData({
        company_name: authCompany.company_name || '',
        description: authCompany.description || '',
        website: authCompany.website || '',
        location: authCompany.location || '',
        company_size: authCompany.company_size || '',
        logo_url: authCompany.logo_url || '',
      });
    }
  }, [authCompany]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleLogoUpload = async () => {
    if (!logoFile || !authCompany) return;

    setUploadingLogo(true);
    setError(null);

    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${authCompany.id}-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('company_logos')
        .upload(filePath, logoFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('company_logos').getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        logo_url: data.publicUrl
      }));

      setLogoFile(null);
      setSuccess(true);
    } catch (err: any) {
      console.error('Logo upload error:', err);
      setError(err.message || 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!authCompany) {
      setError('You must be logged in to update your company profile');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.company_name.trim()) {
        setError('Company name is required');
        setLoading(false);
        return;
      }

      // Validate URL if provided
      if (formData.website && !formData.website.startsWith('http')) {
        setError('Website URL must start with http:// or https://');
        setLoading(false);
        return;
      }

      // Update company
      const { error: updateError } = await supabase
        .from('companies')
        .update({
          company_name: formData.company_name.trim(),
          description: formData.description.trim() || null,
          website: formData.website.trim() || null,
          location: formData.location.trim() || null,
          company_size: formData.company_size || null,
          logo_url: formData.logo_url || null,
        })
        .eq('id', authCompany.id);

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setIsEditing(false);
      await refreshProfile();

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Company profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <CompanyDashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </CompanyDashboardLayout>
    );
  }

  if (!authCompany) {
    return null;
  }

  return (
    <CompanyDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Company Profile</h1>
            <p className="text-gray-600 mt-1">Manage your company information and public profile</p>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data
                    if (authCompany) {
                      setFormData({
                        company_name: authCompany.company_name || '',
                        description: authCompany.description || '',
                        website: authCompany.website || '',
                        location: authCompany.location || '',
                        company_size: authCompany.company_size || '',
                        logo_url: authCompany.logo_url || '',
                      });
                    }
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
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

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">Company profile updated successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Company Header Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {formData.logo_url ? (
                <img
                  src={formData.logo_url}
                  alt="Company Logo"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-blue-600" />
                </div>
              )}
              {isEditing && (
                <div className="mt-2">
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo"
                    className="text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    {logoFile ? logoFile.name : 'Upload Logo'}
                  </label>
                  {logoFile && (
                    <button
                      onClick={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="mt-1 text-xs text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      {uploadingLogo ? 'Uploading...' : 'Save Logo'}
                    </button>
                  )}
                </div>
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
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{formData.company_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  {isEditing ? (
                    <select
                      name="company_size"
                      value={formData.company_size}
                      onChange={handleInputChange}
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
                      <span className="text-gray-900">{formData.company_size || 'Not specified'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="San Francisco, CA"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{formData.location || 'Not specified'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="https://yourcompany.com"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      {formData.website ? (
                        <a
                          href={formData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {formData.website}
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
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Tell candidates about your company, mission, culture, and what makes you unique..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {formData.description || 'No description provided'}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {formData.description.length} characters
          </p>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
