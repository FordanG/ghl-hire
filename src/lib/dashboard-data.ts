import { Job } from './mock-data';

// Candidate Dashboard Types
export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'applied' | 'reviewing' | 'interview' | 'offer' | 'rejected';
  lastUpdate: string;
  notes?: string;
}

export interface SavedJob {
  id: string;
  job: Job;
  savedDate: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  title: string;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  resumeUrl?: string;
  profileComplete: number; // percentage
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface JobAlert {
  id: string;
  name: string;
  keywords: string[];
  location?: string;
  jobType?: string;
  salaryMin?: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  active: boolean;
  createdDate: string;
}

// Mock Data for Candidate Dashboard
export const mockProfile: Profile = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  phone: '+1 (555) 123-4567',
  location: 'Austin, TX',
  title: 'Senior GoHighLevel Specialist',
  summary: 'Experienced marketing automation professional with 5+ years specializing in GoHighLevel implementations. Expert in funnel building, workflow automation, and client success strategies.',
  skills: [
    'GoHighLevel',
    'Marketing Automation',
    'Funnel Building',
    'CRM Management',
    'Email Marketing',
    'Lead Generation',
    'Workflow Automation',
    'Client Onboarding',
    'API Integration',
    'White Label Solutions'
  ],
  experience: [
    {
      id: '1',
      company: 'Digital Marketing Pro',
      position: 'Senior GoHighLevel Consultant',
      startDate: '2022-01',
      current: true,
      description: 'Lead GoHighLevel implementations for enterprise clients, managing complex automation workflows and integrations. Trained over 50 team members on platform best practices.',
      technologies: ['GoHighLevel', 'Zapier', 'API Integration', 'Webhooks']
    },
    {
      id: '2',
      company: 'AutomateSuccess Agency',
      position: 'Marketing Automation Specialist',
      startDate: '2020-03',
      endDate: '2021-12',
      current: false,
      description: 'Built and optimized marketing funnels for 100+ clients, achieving average conversion rate improvements of 35%. Specialized in GoHighLevel platform customization.',
      technologies: ['GoHighLevel', 'ClickFunnels', 'ActiveCampaign', 'Facebook Ads']
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of Texas at Austin',
      degree: 'Bachelor of Business Administration',
      field: 'Marketing',
      startDate: '2016-08',
      endDate: '2020-05',
      current: false
    }
  ],
  certifications: [
    {
      id: '1',
      name: 'GoHighLevel Certified Expert',
      issuer: 'GoHighLevel',
      issueDate: '2023-06',
      credentialId: 'GHL-2023-SE-001'
    },
    {
      id: '2',
      name: 'Facebook Ads Certification',
      issuer: 'Meta',
      issueDate: '2023-03',
      expiryDate: '2024-03'
    }
  ],
  profileComplete: 85
};

export const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'GoHighLevel Specialist',
    company: 'SaaS Agency',
    appliedDate: '2025-01-15',
    status: 'interview',
    lastUpdate: '2025-01-18',
    notes: 'Technical interview scheduled for next week'
  },
  {
    id: '2',
    jobId: '4',
    jobTitle: 'Senior GoHighLevel Consultant',
    company: 'Growth Marketing Labs',
    appliedDate: '2025-01-12',
    status: 'reviewing',
    lastUpdate: '2025-01-16'
  },
  {
    id: '3',
    jobId: '6',
    jobTitle: 'Marketing Automation Specialist (GHL)',
    company: 'ScaleUp Solutions',
    appliedDate: '2025-01-10',
    status: 'applied',
    lastUpdate: '2025-01-10'
  },
  {
    id: '4',
    jobId: '2',
    jobTitle: 'GHL API Developer',
    company: 'AutomatePro',
    appliedDate: '2025-01-08',
    status: 'rejected',
    lastUpdate: '2025-01-14',
    notes: 'Looking for more backend development experience'
  },
  {
    id: '5',
    jobId: '5',
    jobTitle: 'GoHighLevel White Label Manager',
    company: 'Digital Agency Collective',
    appliedDate: '2025-01-05',
    status: 'offer',
    lastUpdate: '2025-01-19',
    notes: 'Offer received - $75,000 base + benefits'
  }
];

export const mockSavedJobs: SavedJob[] = [
  {
    id: '1',
    job: {
      id: '7',
      title: 'GHL Implementation Specialist',
      company: 'TechFlow Solutions',
      location: 'Remote',
      type: 'Full-Time',
      description: 'Join our growing team to implement GoHighLevel solutions for mid-market clients.',
      requirements: ['3+ years GHL experience', 'Strong communication skills'],
      responsibilities: ['Client implementations', 'Training and support'],
      skills: ['GoHighLevel', 'Project Management'],
      salary: '$70,000 - $85,000',
      postedDate: '1 day ago'
    },
    savedDate: '2025-01-18'
  },
  {
    id: '2',
    job: {
      id: '8',
      title: 'Marketing Automation Manager',
      company: 'GrowthCorp',
      location: 'San Francisco, CA',
      type: 'Full-Time',
      description: 'Lead marketing automation initiatives using GoHighLevel and other platforms.',
      requirements: ['5+ years marketing automation', 'Team leadership experience'],
      responsibilities: ['Strategy development', 'Team management'],
      skills: ['GoHighLevel', 'Leadership', 'Strategy'],
      salary: '$90,000 - $110,000',
      postedDate: '3 days ago'
    },
    savedDate: '2025-01-16'
  }
];

export const mockJobAlerts: JobAlert[] = [
  {
    id: '1',
    name: 'Senior GHL Roles - Remote',
    keywords: ['Senior', 'GoHighLevel', 'Specialist'],
    location: 'Remote',
    jobType: 'Full-Time',
    salaryMin: 70000,
    frequency: 'daily',
    active: true,
    createdDate: '2025-01-10'
  },
  {
    id: '2',
    name: 'API Developer Positions',
    keywords: ['API', 'Developer', 'Integration'],
    frequency: 'weekly',
    active: true,
    createdDate: '2025-01-05'
  },
  {
    id: '3',
    name: 'Austin Area Jobs',
    keywords: ['GoHighLevel'],
    location: 'Austin, TX',
    frequency: 'weekly',
    active: false,
    createdDate: '2024-12-20'
  }
];

export const getApplicationStatusColor = (status: Application['status']) => {
  switch (status) {
    case 'applied':
      return 'bg-blue-100 text-blue-800';
    case 'reviewing':
      return 'bg-yellow-100 text-yellow-800';
    case 'interview':
      return 'bg-purple-100 text-purple-800';
    case 'offer':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getApplicationStatusText = (status: Application['status']) => {
  switch (status) {
    case 'applied':
      return 'Application Sent';
    case 'reviewing':
      return 'Under Review';
    case 'interview':
      return 'Interview Scheduled';
    case 'offer':
      return 'Offer Received';
    case 'rejected':
      return 'Not Selected';
    default:
      return 'Unknown';
  }
};