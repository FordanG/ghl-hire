export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract';
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  salary?: string;
  postedDate: string;
  applicationUrl?: string;
  companyLogo?: string;
}

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'GoHighLevel Specialist',
    company: 'SaaS Agency',
    location: 'Remote',
    type: 'Full-Time',
    description: 'Implement automation workflows, funnels, and campaigns for high-growth SaaS clients. Work with cutting-edge marketing automation technology to drive client success.',
    requirements: [
      '2+ years of GoHighLevel experience',
      'Strong understanding of marketing automation',
      'Experience with funnel building and optimization',
      'Excellent communication skills',
      'Ability to work independently in a remote environment'
    ],
    responsibilities: [
      'Build and optimize GoHighLevel funnels for clients',
      'Create automated marketing campaigns',
      'Manage client onboarding processes',
      'Provide technical support and training',
      'Collaborate with the sales team on lead generation strategies'
    ],
    skills: ['GoHighLevel', 'Marketing Automation', 'Funnel Building', 'CRM Management', 'Email Marketing'],
    salary: '$60,000 - $80,000',
    postedDate: '2 days ago',
    applicationUrl: '#'
  },
  {
    id: '2',
    title: 'GHL API Developer',
    company: 'AutomatePro',
    location: 'United States',
    type: 'Contract',
    description: 'Build and maintain integrations with GoHighLevel API for marketing automation. Create custom solutions that extend GHL functionality for enterprise clients.',
    requirements: [
      'Strong programming skills in JavaScript/Node.js',
      'Experience with REST APIs and webhooks',
      'GoHighLevel API experience preferred',
      'Database design and management skills',
      'Version control with Git'
    ],
    responsibilities: [
      'Develop custom GoHighLevel integrations',
      'Build API endpoints and webhook handlers',
      'Create documentation for technical implementations',
      'Troubleshoot and debug integration issues',
      'Work closely with client success teams'
    ],
    skills: ['JavaScript', 'Node.js', 'GoHighLevel API', 'REST APIs', 'Webhooks', 'Database Design'],
    salary: '$75 - $100/hour',
    postedDate: '1 day ago',
    applicationUrl: '#'
  },
  {
    id: '3',
    title: 'Account Manager - GoHighLevel Focus',
    company: 'WhiteLabel Wizards',
    location: 'Hybrid / Toronto',
    type: 'Part-Time',
    description: 'Support agency clients, onboard new users, and manage GHL projects. Be the bridge between technical implementation and client success.',
    requirements: [
      'Experience in client relationship management',
      'Familiarity with GoHighLevel platform',
      'Strong organizational and project management skills',
      'Excellent written and verbal communication',
      'Toronto-based or willing to work hybrid schedule'
    ],
    responsibilities: [
      'Manage client relationships and expectations',
      'Onboard new clients to GoHighLevel',
      'Coordinate project timelines and deliverables',
      'Provide ongoing support and training',
      'Identify upselling opportunities'
    ],
    skills: ['Client Management', 'GoHighLevel', 'Project Management', 'Communication', 'Sales'],
    salary: '$35,000 - $45,000',
    postedDate: '3 days ago',
    applicationUrl: '#'
  },
  {
    id: '4',
    title: 'Senior GoHighLevel Consultant',
    company: 'Growth Marketing Labs',
    location: 'Remote',
    type: 'Full-Time',
    description: 'Lead complex GoHighLevel implementations for enterprise clients. Design and architect comprehensive marketing automation systems.',
    requirements: [
      '5+ years of marketing automation experience',
      'Expert-level GoHighLevel knowledge',
      'Experience with enterprise-level implementations',
      'Strong analytical and problem-solving skills',
      'Leadership and mentoring experience'
    ],
    responsibilities: [
      'Design complex automation workflows',
      'Lead enterprise client implementations',
      'Mentor junior team members',
      'Develop best practices and standards',
      'Present solutions to C-level executives'
    ],
    skills: ['GoHighLevel Expert', 'Enterprise Solutions', 'Leadership', 'Strategy', 'Consulting'],
    salary: '$90,000 - $120,000',
    postedDate: '5 days ago',
    applicationUrl: '#'
  },
  {
    id: '5',
    title: 'GoHighLevel White Label Manager',
    company: 'Digital Agency Collective',
    location: 'Remote',
    type: 'Full-Time',
    description: 'Manage white label GoHighLevel instances for multiple agency partners. Ensure consistent branding and functionality across all implementations.',
    requirements: [
      'Deep understanding of GHL white label features',
      'Experience managing multiple client instances',
      'Strong attention to detail',
      'Project management experience',
      'Knowledge of branding and design principles'
    ],
    responsibilities: [
      'Configure and maintain white label instances',
      'Ensure consistent branding across all instances',
      'Train agency partners on platform usage',
      'Monitor performance and optimize configurations',
      'Develop standardized processes and templates'
    ],
    skills: ['GoHighLevel White Label', 'Multi-tenant Management', 'Branding', 'Process Development'],
    salary: '$70,000 - $85,000',
    postedDate: '1 week ago',
    applicationUrl: '#'
  },
  {
    id: '6',
    title: 'Marketing Automation Specialist (GHL)',
    company: 'ScaleUp Solutions',
    location: 'Austin, TX',
    type: 'Full-Time',
    description: 'Create and optimize marketing automation campaigns using GoHighLevel. Work with high-growth startups to scale their marketing efforts.',
    requirements: [
      'GoHighLevel certification preferred',
      '3+ years of marketing automation experience',
      'Experience with email marketing and lead nurturing',
      'Understanding of conversion optimization',
      'Analytics and reporting skills'
    ],
    responsibilities: [
      'Build email marketing campaigns and sequences',
      'Create lead scoring and nurturing workflows',
      'Optimize conversion funnels',
      'Generate performance reports and insights',
      'A/B test campaign elements for optimization'
    ],
    skills: ['GoHighLevel', 'Email Marketing', 'Lead Nurturing', 'Analytics', 'Conversion Optimization'],
    salary: '$65,000 - $75,000',
    postedDate: '4 days ago',
    applicationUrl: '#'
  }
];

export const featuredJobs = mockJobs.slice(0, 3);

export const jobTypes = ['Full-Time', 'Part-Time', 'Contract'] as const;
export const locations = ['Remote', 'United States', 'Canada', 'Austin, TX', 'Toronto'] as const;
export const companies = mockJobs.map(job => job.company);