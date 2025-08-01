'use client';

import { useState } from 'react';
import { 
  Building2,
  Globe,
  MapPin,
  Users,
  Calendar,
  Mail,
  Phone,
  Edit,
  Save,
  Plus,
  Trash2,
  Upload,
  ExternalLink,
  Award,
  Star,
  Shield,
  CheckCircle
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { mockCompanyProfile, type CompanyProfile } from '@/lib/company-data';

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile>(mockCompanyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'benefits' | 'social' | 'verification'>('overview');

  const handleSave = () => {
    // Here you would save to your backend
    console.log('Saving company profile:', profile);
    setIsEditing(false);
  };

  const addBenefit = () => {
    setProfile(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setProfile(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  const removeBenefit = (index: number) => {
    setProfile(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'overview', name: 'Company Overview', icon: Building2 },
    { id: 'benefits', name: 'Benefits & Perks', icon: Award },
    { id: 'social', name: 'Social Links', icon: Globe },
    { id: 'verification', name: 'Verification', icon: Shield }
  ];

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
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Profile verified
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
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
              <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-12 h-12 text-blue-600" />
              </div>
              {isEditing && (
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </button>
              )}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.industry}
                      onChange={(e) => setProfile(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.industry}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  {isEditing ? (
                    <select
                      value={profile.size}
                      onChange={(e) => setProfile(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="1-10 employees">1-10 employees</option>
                      <option value="11-50 employees">11-50 employees</option>
                      <option value="51-200 employees">51-200 employees</option>
                      <option value="201-500 employees">201-500 employees</option>
                      <option value="501-1000 employees">501-1000 employees</option>
                      <option value="1000+ employees">1000+ employees</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile.size}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`-ml-0.5 mr-2 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Company Description */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Description</h3>
                {isEditing ? (
                  <textarea
                    value={profile.description}
                    onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Tell candidates about your company, mission, and culture..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{profile.description}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={profile.website || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="https://yourcompany.com"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {profile.website ? (
                          <a 
                            href={profile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {profile.website}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-500">Not specified</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Founded</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.founded || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, founded: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="2020"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{profile.founded || 'Not specified'}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{profile.email}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="+1 (555) 123-4567"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{profile.phone || 'Not specified'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Benefits & Perks</h3>
                {isEditing && (
                  <button
                    onClick={addBenefit}
                    className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Benefit
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {profile.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-3">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => updateBenefit(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="Enter a benefit or perk"
                        />
                        <button
                          onClick={() => removeBenefit(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-900">{benefit}</span>
                    )}
                  </div>
                ))}
                {profile.benefits.length === 0 && !isEditing && (
                  <p className="text-gray-500 italic">No benefits listed yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Social Media Links</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profile.socialLinks.linkedin || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      {profile.socialLinks.linkedin ? (
                        <a 
                          href={profile.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {profile.socialLinks.linkedin}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profile.socialLinks.twitter || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="https://twitter.com/yourcompany"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      {profile.socialLinks.twitter ? (
                        <a 
                          href={profile.socialLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {profile.socialLinks.twitter}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profile.socialLinks.facebook || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="https://facebook.com/yourcompany"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      {profile.socialLinks.facebook ? (
                        <a 
                          href={profile.socialLinks.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {profile.socialLinks.facebook}
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
          )}

          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Verification</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Email Verified</p>
                      <p className="text-sm text-green-700">Your company email has been verified</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Profile Complete</p>
                      <p className="text-sm text-green-700">All required information has been provided</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Star className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">Premium Verification</p>
                      <p className="text-sm text-blue-700">Get a verified badge and premium features</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}