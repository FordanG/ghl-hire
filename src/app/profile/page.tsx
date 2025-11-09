'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, User, Mail, Phone, MapPin, Briefcase, FileText, Link as LinkIcon, CheckCircle, Upload } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile: authProfile, loading: authLoading, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [] as string[],
    skillsInput: '',
    experience_years: '',
    linkedin_url: '',
    portfolio_url: '',
    resume_url: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin?redirect=/profile');
    }

    if (!authLoading && !authProfile) {
      router.push('/signup?redirect=/profile');
    }
  }, [authLoading, user, authProfile, router]);

  useEffect(() => {
    if (authProfile) {
      setFormData({
        full_name: authProfile.full_name || '',
        email: authProfile.email || '',
        phone: authProfile.phone || '',
        location: authProfile.location || '',
        bio: authProfile.bio || '',
        skills: authProfile.skills || [],
        skillsInput: (authProfile.skills || []).join(', '),
        experience_years: authProfile.experience_years ? authProfile.experience_years.toString() : '',
        linkedin_url: authProfile.linkedin_url || '',
        portfolio_url: authProfile.portfolio_url || '',
        resume_url: authProfile.resume_url || '',
      });
    }
  }, [authProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'skillsInput') {
      setFormData(prev => ({
        ...prev,
        skillsInput: value,
        skills: value.split(',').map(s => s.trim()).filter(s => s.length > 0)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile || !authProfile) return;

    setUploadingResume(true);
    setError(null);

    try {
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${authProfile.id}-${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resumeFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        resume_url: data.publicUrl
      }));

      setResumeFile(null);
      setSuccess(true);
    } catch (err: any) {
      console.error('Resume upload error:', err);
      setError(err.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authProfile) {
      setError('You must be logged in to update your profile');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.full_name.trim() || !formData.email.trim()) {
        setError('Name and email are required');
        setLoading(false);
        return;
      }

      // Validate URLs if provided
      if (formData.linkedin_url && !formData.linkedin_url.startsWith('http')) {
        setError('LinkedIn URL must start with http:// or https://');
        setLoading(false);
        return;
      }

      if (formData.portfolio_url && !formData.portfolio_url.startsWith('http')) {
        setError('Portfolio URL must start with http:// or https://');
        setLoading(false);
        return;
      }

      const experienceYears = formData.experience_years ? parseInt(formData.experience_years) : null;

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          location: formData.location.trim() || null,
          bio: formData.bio.trim() || null,
          skills: formData.skills.length > 0 ? formData.skills : null,
          experience_years: experienceYears,
          linkedin_url: formData.linkedin_url.trim() || null,
          portfolio_url: formData.portfolio_url.trim() || null,
          resume_url: formData.resume_url || null,
        })
        .eq('id', authProfile.id);

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      await refreshProfile();

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    if (!authProfile) return 0;

    const fields = [
      authProfile.full_name,
      authProfile.email,
      authProfile.phone,
      authProfile.location,
      authProfile.bio,
      authProfile.skills && authProfile.skills.length > 0,
      authProfile.experience_years,
      authProfile.linkedin_url,
      authProfile.portfolio_url,
      authProfile.resume_url,
    ];

    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authProfile) {
    return null;
  }

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />

      <div className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 fade-in fade-in-1">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">My Profile</h1>
            <p className="text-gray-600">
              Manage your profile information and improve your visibility to employers
            </p>
          </div>

          {/* Profile Completion */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 fade-in fade-in-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-900">Profile Completion</p>
              <p className="text-sm font-semibold text-blue-900">{profileCompletion}%</p>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Complete your profile to increase your chances of getting hired
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 fade-in fade-in-1">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">Profile updated successfully!</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 fade-in fade-in-1">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-8 fade-in fade-in-3">
            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="Tell employers about your experience, expertise, and what you're looking for..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.bio.length} characters
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Professional Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="skillsInput" className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    id="skillsInput"
                    name="skillsInput"
                    type="text"
                    value={formData.skillsInput}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="GoHighLevel, Marketing Automation, CRM Management, Funnel Building"
                  />
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    id="experience_years"
                    name="experience_years"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience_years}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="linkedin_url"
                      name="linkedin_url"
                      type="url"
                      value={formData.linkedin_url}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="portfolio_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio/Website URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="portfolio_url"
                      name="portfolio_url"
                      type="url"
                      value={formData.portfolio_url}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume
              </h2>

              <div className="space-y-4">
                {formData.resume_url && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-800 font-medium">
                        Resume uploaded
                      </span>
                    </div>
                    <a
                      href={formData.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Resume →
                    </a>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      {resumeFile ? resumeFile.name : 'Click to upload a new resume'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, or DOCX (max 5MB)
                    </p>
                  </label>
                </div>

                {resumeFile && (
                  <button
                    type="button"
                    onClick={handleResumeUpload}
                    disabled={uploadingResume}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Saving...' : 'Save Changes'}
                {!loading && <CheckCircle className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
