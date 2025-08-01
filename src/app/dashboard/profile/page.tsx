'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Plus, 
  Trash2, 
  Save,
  Upload,
  Award,
  Briefcase,
  GraduationCap,
  FileText
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { mockProfile, type Profile, type WorkExperience, type Education, type Certification } from '@/lib/dashboard-data';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'education' | 'certifications'>('overview');

  const handleSave = () => {
    // Here you would save to your backend
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      current: false,
      description: '',
      technologies: []
    };
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, updates: Partial<WorkExperience>) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, ...updates } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'certifications', name: 'Certifications', icon: Award }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your professional information and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Profile {profile.profileComplete}% complete
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${profile.profileComplete}%` }}
              />
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

        {/* Profile Photo and Basic Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              {isEditing && (
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </button>
              )}
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{profile.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{profile.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="City, State"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{profile.location || 'Not specified'}</span>
                  </div>
                )}
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
              {/* Professional Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
                {isEditing ? (
                  <textarea
                    value={profile.summary}
                    onChange={(e) => setProfile(prev => ({ ...prev, summary: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Write a brief summary of your professional background and expertise..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
                )}
              </div>

              {/* Skills */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                {isEditing ? (
                  <div>
                    <textarea
                      value={profile.skills.join(', ')}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter skills separated by commas (e.g., GoHighLevel, Marketing Automation, CRM)"
                    />
                    <p className="text-sm text-gray-500 mt-2">Separate skills with commas</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Resume */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {profile.resumeUrl ? 'Resume.pdf' : 'No resume uploaded'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {profile.resumeUrl ? 'Last updated 2 weeks ago' : 'Upload your resume to get better job matches'}
                      </p>
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    {profile.resumeUrl ? 'Update' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                {isEditing && (
                  <button
                    onClick={addExperience}
                    className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {profile.experience.map((exp, index) => (
                  <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-600 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                            placeholder="Company name"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                            placeholder="Position title"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                          <input
                            type="month"
                            value={exp.endDate || ''}
                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value || undefined })}
                            disabled={exp.current}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                          />
                        </div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? undefined : exp.endDate })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">I currently work here</span>
                        </label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                          placeholder="Describe your role and achievements..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                            <p className="text-blue-600 font-medium">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{exp.description}</p>
                        {exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {exp.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Education</h3>
              <div className="space-y-4">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                        <p className="text-blue-600 font-medium">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Certifications</h3>
              <div className="space-y-4">
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                        <p className="text-blue-600 font-medium">{cert.issuer}</p>
                        {cert.credentialId && (
                          <p className="text-sm text-gray-500">ID: {cert.credentialId}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Issued {cert.issueDate}</p>
                        {cert.expiryDate && (
                          <p className="text-sm text-gray-500">Expires {cert.expiryDate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}