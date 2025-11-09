'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Search
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  experience_level: string;
  is_remote: boolean;
  created_at: string;
  company: {
    id: string;
    company_name: string;
    logo_url: string | null;
  };
}

interface CategoryInfo {
  title: string;
  description: string;
  keywords: string[];
  averageSalary: string;
  demandLevel: string;
  requiredSkills: string[];
  careerPath: string[];
}

const categoryData: Record<string, CategoryInfo> = {
  'ghl-developer': {
    title: 'GoHighLevel Developer Jobs',
    description: 'Find exciting opportunities as a GoHighLevel developer. Build custom solutions, integrations, and automations for businesses using the GHL platform.',
    keywords: ['JavaScript', 'API Integration', 'Webhooks', 'Custom Functions', 'HTML/CSS'],
    averageSalary: '$70,000 - $120,000',
    demandLevel: 'Very High',
    requiredSkills: ['JavaScript/Node.js', 'API Development', 'GHL Platform', 'Webhooks', 'Database Design'],
    careerPath: ['Junior Developer', 'Mid-Level Developer', 'Senior Developer', 'Technical Lead']
  },
  'automation-specialist': {
    title: 'Marketing Automation Specialist Jobs',
    description: 'Join the forefront of marketing automation. Design and implement sophisticated workflows that drive business growth.',
    keywords: ['Workflow Design', 'Email Marketing', 'SMS Automation', 'Lead Nurturing', 'A/B Testing'],
    averageSalary: '$55,000 - $95,000',
    demandLevel: 'High',
    requiredSkills: ['Workflow Design', 'GHL Workflows', 'Email Marketing', 'CRM Management', 'Analytics'],
    careerPath: ['Automation Associate', 'Automation Specialist', 'Senior Specialist', 'Automation Manager']
  },
  'funnel-builder': {
    title: 'Funnel Builder Jobs',
    description: 'Create high-converting sales funnels that drive revenue. Design landing pages, forms, and multi-step conversion paths.',
    keywords: ['Landing Pages', 'Conversion Optimization', 'Copywriting', 'A/B Testing', 'Analytics'],
    averageSalary: '$50,000 - $90,000',
    demandLevel: 'High',
    requiredSkills: ['GHL Funnel Builder', 'Copywriting', 'Design Principles', 'Conversion Rate Optimization', 'Analytics'],
    careerPath: ['Junior Funnel Builder', 'Funnel Builder', 'Senior Funnel Builder', 'Conversion Strategist']
  },
  'crm-specialist': {
    title: 'CRM Specialist Jobs',
    description: 'Manage and optimize customer relationship management systems. Help businesses better understand and engage their customers.',
    keywords: ['CRM Management', 'Data Analysis', 'Customer Segmentation', 'Pipeline Management', 'Reporting'],
    averageSalary: '$55,000 - $85,000',
    demandLevel: 'Medium-High',
    requiredSkills: ['CRM Platforms', 'Data Management', 'Customer Segmentation', 'Reporting', 'Process Optimization'],
    careerPath: ['CRM Associate', 'CRM Specialist', 'Senior CRM Specialist', 'CRM Manager']
  },
  'account-manager': {
    title: 'Account Manager Jobs',
    description: 'Build lasting relationships with clients. Manage accounts, drive retention, and identify growth opportunities.',
    keywords: ['Client Relations', 'Account Management', 'Customer Success', 'Communication', 'Sales'],
    averageSalary: '$60,000 - $100,000',
    demandLevel: 'High',
    requiredSkills: ['Client Management', 'Communication', 'GHL Platform Knowledge', 'Problem Solving', 'Sales'],
    careerPath: ['Account Coordinator', 'Account Manager', 'Senior Account Manager', 'Director of Accounts']
  },
  'sales-specialist': {
    title: 'Sales Specialist Jobs',
    description: 'Drive revenue growth by selling GHL solutions and services. Help businesses transform their marketing and sales processes.',
    keywords: ['Sales', 'Prospecting', 'Demos', 'Closing', 'Lead Generation'],
    averageSalary: '$50,000 - $120,000',
    demandLevel: 'Very High',
    requiredSkills: ['Sales Process', 'GHL Platform Demos', 'Lead Qualification', 'Negotiation', 'CRM'],
    careerPath: ['Sales Associate', 'Sales Specialist', 'Senior Sales Specialist', 'Sales Manager']
  }
};

export default function JobCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalJobs: 0, companiesHiring: 0 });

  const category = categoryData[slug];

  useEffect(() => {
    if (!category) {
      router.push('/jobs');
      return;
    }

    fetchJobs();
  }, [slug, category]);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      // Search for jobs that match this category in title or description
      const searchTerms = category.keywords.join('|');

      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(id, company_name, logo_url)
        `)
        .eq('status', 'active')
        .or(`title.ilike.%${slug.replace('-', ' ')}%,description.ilike.%${searchTerms}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const jobsData = data || [];
      setJobs(jobsData);

      // Calculate stats
      const uniqueCompanies = new Set(jobsData.map(job => job.company.id));
      setStats({
        totalJobs: jobsData.length,
        companiesHiring: uniqueCompanies.size
      });

    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!category) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.title}</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {category.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-sm text-blue-100">Average Salary</div>
                <div className="text-2xl font-bold">{category.averageSalary}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-sm text-blue-100">Demand Level</div>
                <div className="text-2xl font-bold">{category.demandLevel}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-sm text-blue-100">Open Positions</div>
                <div className="text-2xl font-bold">{stats.totalJobs}</div>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Link
                href={`/jobs?category=${slug}`}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Browse All Jobs
              </Link>
              <Link
                href="/job-alerts"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors inline-flex items-center gap-2"
              >
                <Clock className="w-5 h-5" />
                Set Job Alert
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Required Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Career Path</h2>
            </div>
            <div className="space-y-3">
              {category.careerPath.map((level, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs Listing */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">
            Latest {category.title}
            {stats.totalJobs > 0 && (
              <span className="text-gray-500 text-xl ml-2">({stats.totalJobs})</span>
            )}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No jobs found in this category yet
              </h3>
              <p className="text-gray-600 mb-6">
                Set up a job alert to be notified when new positions are posted
              </p>
              <Link
                href="/job-alerts"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Create Job Alert
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {job.company.logo_url ? (
                          <img
                            src={job.company.logo_url}
                            alt={job.company.company_name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          <p className="text-gray-600">{job.company.company_name}</p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.is_remote ? 'Remote' : job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.job_type}
                        </div>
                        {job.salary_min && job.salary_max && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {job.experience_level}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/jobs/${job.id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap inline-flex items-center gap-2"
                    >
                      View Job
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Don't miss out on new {category.title.toLowerCase()}
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get notified when new positions matching your criteria are posted. Create a custom job alert in seconds.
          </p>
          <Link
            href="/job-alerts"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
          >
            <Clock className="w-5 h-5" />
            Create Job Alert
          </Link>
        </div>
      </div>
    </div>
  );
}
