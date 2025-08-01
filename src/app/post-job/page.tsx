'use client';

import { useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  Clock, 
  FileText, 
  Users, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PostJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    salary: '',
    description: '',
    requirements: '',
    responsibilities: '',
    skills: '',
    email: '',
    phone: '',
    companySize: '',
    website: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Job posted:', formData);
    alert('Job posted successfully! (This is a demo)');
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />
      
      {/* Header Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
            Post a GoHighLevel Job
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto fade-in fade-in-2">
            Connect with thousands of qualified GoHighLevel professionals. Our targeted platform ensures your job reaches the right candidates.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 fade-in fade-in-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 rounded-full p-2">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold">Job Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="e.g. GoHighLevel Specialist"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="e.g. Remote, New York, NY"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range (Optional)
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="e.g. $60,000 - $80,000 or $75/hour"
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 fade-in fade-in-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 rounded-full p-2">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold">Job Description</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="Describe the role, your company, and what makes this opportunity exciting..."
                />
              </div>

              <div>
                <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-2">
                  Key Responsibilities *
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="List the main responsibilities, one per line..."
                />
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements *
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="List the required qualifications and experience, one per line..."
                />
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills *
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="e.g. GoHighLevel, Marketing Automation, CRM Management (comma separated)"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 fade-in fade-in-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 rounded-full p-2">
                <Building2 className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold">Company Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="hiring@yourcompany.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website (Optional)
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size (Optional)
                </label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 fade-in fade-in-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 rounded-full p-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Pricing Summary</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <h3 className="font-semibold mb-2">Basic</h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">$299</div>
                <div className="text-sm text-gray-500 mb-4">30-day posting</div>
                <ul className="text-sm space-y-1">
                  <li>✓ Standard placement</li>
                  <li>✓ Basic applicant tracking</li>
                  <li>✓ Email support</li>
                </ul>
              </div>

              <div className="bg-blue-500 text-white rounded-lg p-6 text-center">
                <h3 className="font-semibold mb-2">Professional</h3>
                <div className="text-2xl font-bold mb-2">$599</div>
                <div className="text-sm opacity-90 mb-4">60-day posting</div>
                <ul className="text-sm space-y-1">
                  <li>✓ Premium placement</li>
                  <li>✓ AI candidate matching</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 text-center">
                <h3 className="font-semibold mb-2">Enterprise</h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">Custom</div>
                <div className="text-sm text-gray-500 mb-4">Contact sales</div>
                <ul className="text-sm space-y-1">
                  <li>✓ Unlimited postings</li>
                  <li>✓ Dedicated manager</li>
                  <li>✓ Custom integrations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center fade-in fade-in-1">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold text-lg rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
            >
              Post Job - Start with Professional Plan
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Your job will be reviewed and published within 24 hours
            </p>
          </div>
        </form>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
              Why Post on GHL Hire?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center fade-in fade-in-2">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Targeted Audience</h3>
              <p className="text-gray-600">
                Reach 10,000+ GoHighLevel professionals actively looking for new opportunities.
              </p>
            </div>

            <div className="text-center fade-in fade-in-3">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Results</h3>
              <p className="text-gray-600">
                Average time to first qualified application is just 48 hours.
              </p>
            </div>

            <div className="text-center fade-in fade-in-4">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Candidates</h3>
              <p className="text-gray-600">
                All candidates are pre-screened for GoHighLevel experience and expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}