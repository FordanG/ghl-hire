'use client';

import Link from 'next/link';
import {
  Code,
  Zap,
  TrendingUp,
  Database,
  Users,
  DollarSign,
  ArrowRight,
  Briefcase
} from 'lucide-react';

const categories = [
  {
    slug: 'ghl-developer',
    title: 'GHL Developer',
    description: 'Build custom solutions, integrations, and automations for the GoHighLevel platform',
    icon: Code,
    color: 'blue',
    stats: { avgSalary: '$70k-$120k', demand: 'Very High', openings: '50+' }
  },
  {
    slug: 'automation-specialist',
    title: 'Automation Specialist',
    description: 'Design and implement sophisticated marketing workflows and automation sequences',
    icon: Zap,
    color: 'purple',
    stats: { avgSalary: '$55k-$95k', demand: 'High', openings: '40+' }
  },
  {
    slug: 'funnel-builder',
    title: 'Funnel Builder',
    description: 'Create high-converting sales funnels, landing pages, and conversion paths',
    icon: TrendingUp,
    color: 'green',
    stats: { avgSalary: '$50k-$90k', demand: 'High', openings: '35+' }
  },
  {
    slug: 'crm-specialist',
    title: 'CRM Specialist',
    description: 'Manage and optimize customer relationship management systems and data',
    icon: Database,
    color: 'orange',
    stats: { avgSalary: '$55k-$85k', demand: 'Medium-High', openings: '25+' }
  },
  {
    slug: 'account-manager',
    title: 'Account Manager',
    description: 'Build client relationships, manage accounts, and drive customer success',
    icon: Users,
    color: 'pink',
    stats: { avgSalary: '$60k-$100k', demand: 'High', openings: '30+' }
  },
  {
    slug: 'sales-specialist',
    title: 'Sales Specialist',
    description: 'Drive revenue growth by selling GHL solutions and closing deals',
    icon: DollarSign,
    color: 'indigo',
    stats: { avgSalary: '$50k-$120k', demand: 'Very High', openings: '45+' }
  }
];

const colorClasses = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-100'
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-100'
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    text: 'text-green-600',
    hover: 'hover:bg-green-100'
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    hover: 'hover:bg-orange-100'
  },
  pink: {
    gradient: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    hover: 'hover:bg-pink-100'
  },
  indigo: {
    gradient: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    hover: 'hover:bg-indigo-100'
  }
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore GoHighLevel Career Paths
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover your perfect role in the GHL ecosystem. From development to sales,
              find opportunities that match your skills and career goals.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const colors = colorClasses[category.color as keyof typeof colorClasses];

            return (
              <Link
                key={category.slug}
                href={`/jobs/category/${category.slug}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${colors.gradient} p-6 text-white`}>
                  <Icon className="w-12 h-12 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-6 h-12">
                    {category.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Avg Salary</div>
                      <div className={`text-sm font-semibold ${colors.text}`}>
                        {category.stats.avgSalary}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Demand</div>
                      <div className={`text-sm font-semibold ${colors.text}`}>
                        {category.stats.demand}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Openings</div>
                      <div className={`text-sm font-semibold ${colors.text}`}>
                        {category.stats.openings}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between ${colors.text} font-semibold group-hover:gap-2 transition-all`}>
                    <span>Explore Jobs</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">
            Can't find the right category?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Browse all available positions or set up a custom job alert to get notified
            when opportunities matching your criteria are posted.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/jobs"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse All Jobs
            </Link>
            <Link
              href="/job-alerts"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
            >
              Create Job Alert
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
