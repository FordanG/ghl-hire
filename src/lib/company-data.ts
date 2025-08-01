// Company Dashboard Types
export interface CompanyProfile {
  id: string;
  name: string;
  website?: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  logo?: string;
  founded?: string;
  email: string;
  phone?: string;
  benefits: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract';
  level: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  status: 'draft' | 'active' | 'paused' | 'closed';
  postedDate: string;
  closingDate?: string;
  applicationsCount: number;
  viewsCount: number;
  plan: 'basic' | 'professional' | 'enterprise';
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  title: string;
  experience: number; // years
  skills: string[];
  resumeUrl?: string;
  profileUrl?: string;
  appliedDate: string;
  status: 'new' | 'reviewing' | 'interview' | 'offer' | 'hired' | 'rejected';
  notes?: string;
  rating?: number; // 1-5 stars
  salary_expectation?: number;
  availability?: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidate: Candidate;
  jobTitle: string;
  appliedDate: string;
  status: 'new' | 'reviewing' | 'interview' | 'offer' | 'hired' | 'rejected';
  lastUpdate: string;
  notes?: string;
  rating?: number;
  interviews: Interview[];
}

export interface Interview {
  id: string;
  type: 'phone' | 'video' | 'in-person' | 'technical';
  scheduledDate: string;
  duration: number; // minutes
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
}

export interface CompanyStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  totalViews: number;
  hireRate: number;
  avgTimeToHire: number; // days
}

// Mock Data
export const mockCompanyProfile: CompanyProfile = {
  id: '1',
  name: 'TechFlow Solutions',
  website: 'https://techflowsolutions.com',
  industry: 'Marketing Technology',
  size: '51-200 employees',
  location: 'Austin, TX',
  description: 'Leading provider of GoHighLevel implementations and marketing automation solutions for growing businesses. We specialize in helping agencies and SaaS companies scale their client success operations.',
  founded: '2019',
  email: 'careers@techflowsolutions.com',
  phone: '+1 (512) 555-0123',
  benefits: [
    'Competitive salary + equity',
    'Health, dental, vision insurance',
    'Remote-first culture',
    'Unlimited PTO',
    'Professional development budget',
    'Latest equipment provided',
    'Quarterly team retreats'
  ],
  socialLinks: {
    linkedin: 'https://linkedin.com/company/techflowsolutions',
    twitter: 'https://twitter.com/techflowsol'
  }
};

export const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Senior GoHighLevel Consultant',
    department: 'Client Success',
    location: 'Remote',
    type: 'Full-Time',
    level: 'Senior',
    salary: {
      min: 80000,
      max: 100000,
      currency: 'USD'
    },
    description: 'Lead complex GoHighLevel implementations for enterprise clients and mentor junior team members.',
    requirements: [
      '5+ years of GoHighLevel experience',
      'Proven track record with enterprise implementations',
      'Strong communication and leadership skills',
      'Experience with API integrations and custom solutions'
    ],
    responsibilities: [
      'Lead enterprise client implementations',
      'Design complex automation workflows',
      'Mentor junior consultants',
      'Develop best practices and documentation'
    ],
    skills: ['GoHighLevel', 'Project Management', 'API Integration', 'Client Management'],
    status: 'active',
    postedDate: '2025-01-15',
    applicationsCount: 24,
    viewsCount: 156,
    plan: 'professional'
  },
  {
    id: '2',
    title: 'GoHighLevel Implementation Specialist',
    department: 'Client Success',
    location: 'Remote',
    type: 'Full-Time',
    level: 'Mid',
    salary: {
      min: 60000,
      max: 75000,
      currency: 'USD'
    },
    description: 'Implement GoHighLevel solutions for mid-market clients and provide ongoing support.',
    requirements: [
      '3+ years of GoHighLevel experience',
      'Experience with client onboarding',
      'Strong problem-solving skills',
      'GoHighLevel certification preferred'
    ],
    responsibilities: [
      'Configure GoHighLevel instances for new clients',
      'Provide training and support to client teams',
      'Troubleshoot technical issues',
      'Document implementation processes'
    ],
    skills: ['GoHighLevel', 'Client Training', 'Technical Support', 'Documentation'],
    status: 'active',
    postedDate: '2025-01-12',
    applicationsCount: 18,
    viewsCount: 89,
    plan: 'basic'
  },
  {
    id: '3',
    title: 'Marketing Automation Developer',
    department: 'Engineering',
    location: 'Austin, TX',
    type: 'Full-Time',
    level: 'Mid',
    salary: {
      min: 75000,
      max: 90000,
      currency: 'USD'
    },
    description: 'Build custom integrations and automation solutions using GoHighLevel API.',
    requirements: [
      'JavaScript/Node.js proficiency',
      'REST API experience',
      'GoHighLevel API knowledge',
      'Database design skills'
    ],
    responsibilities: [
      'Develop custom GoHighLevel integrations',
      'Build automation workflows',
      'Maintain API documentation',
      'Collaborate with client success team'
    ],
    skills: ['JavaScript', 'Node.js', 'GoHighLevel API', 'MongoDB'],
    status: 'paused',
    postedDate: '2025-01-08',
    applicationsCount: 12,
    viewsCount: 67,
    plan: 'professional'
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'Austin, TX',
    title: 'Senior GoHighLevel Specialist',
    experience: 5,
    skills: ['GoHighLevel', 'Marketing Automation', 'Project Management', 'API Integration'],
    appliedDate: '2025-01-18',
    status: 'interview',
    rating: 4,
    salary_expectation: 85000,
    availability: 'Immediate'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    location: 'Remote',
    title: 'GoHighLevel Developer',
    experience: 3,
    skills: ['GoHighLevel', 'JavaScript', 'API Development', 'Webhooks'],
    appliedDate: '2025-01-16',
    status: 'reviewing',
    rating: 3,
    salary_expectation: 70000,
    availability: '2 weeks notice'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    phone: '+1 (555) 987-6543',
    location: 'San Francisco, CA',
    title: 'Marketing Automation Manager',
    experience: 4,
    skills: ['GoHighLevel', 'Campaign Management', 'Lead Generation', 'Analytics'],
    appliedDate: '2025-01-14',
    status: 'offer',
    rating: 5,
    salary_expectation: 75000,
    availability: 'Flexible'
  }
];

export const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    candidateId: '1',
    candidate: mockCandidates[0],
    jobTitle: 'Senior GoHighLevel Consultant',
    appliedDate: '2025-01-18',
    status: 'interview',
    lastUpdate: '2025-01-19',
    rating: 4,
    notes: 'Strong technical background, good cultural fit',
    interviews: [
      {
        id: '1',
        type: 'video',
        scheduledDate: '2025-01-22T14:00:00Z',
        duration: 60,
        interviewer: 'John Smith',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '2',
    jobId: '1',
    candidateId: '2',
    candidate: mockCandidates[1],
    jobTitle: 'Senior GoHighLevel Consultant',
    appliedDate: '2025-01-16',
    status: 'reviewing',
    lastUpdate: '2025-01-17',
    rating: 3,
    notes: 'Good technical skills, need to assess leadership experience',
    interviews: []
  },
  {
    id: '3',
    jobId: '2',
    candidateId: '3',
    candidate: mockCandidates[2],
    jobTitle: 'GoHighLevel Implementation Specialist',
    appliedDate: '2025-01-14',
    status: 'offer',
    lastUpdate: '2025-01-19',
    rating: 5,
    notes: 'Excellent candidate, moving to offer',
    interviews: [
      {
        id: '2',
        type: 'phone',
        scheduledDate: '2025-01-17T10:00:00Z',
        duration: 30,
        interviewer: 'Jane Doe',
        status: 'completed',
        rating: 5,
        notes: 'Great communication skills and experience'
      }
    ]
  }
];

export const mockCompanyStats: CompanyStats = {
  totalJobs: 3,
  activeJobs: 2,
  totalApplications: 54,
  newApplications: 8,
  totalViews: 312,
  hireRate: 15.2,
  avgTimeToHire: 18
};

export const getApplicationStatusColor = (status: Application['status']) => {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-800';
    case 'reviewing':
      return 'bg-yellow-100 text-yellow-800';
    case 'interview':
      return 'bg-purple-100 text-purple-800';
    case 'offer':
      return 'bg-green-100 text-green-800';
    case 'hired':
      return 'bg-emerald-100 text-emerald-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getApplicationStatusText = (status: Application['status']) => {
  switch (status) {
    case 'new':
      return 'New Application';
    case 'reviewing':
      return 'Under Review';
    case 'interview':
      return 'Interview Stage';
    case 'offer':
      return 'Offer Extended';
    case 'hired':
      return 'Hired';
    case 'rejected':
      return 'Not Selected';
    default:
      return 'Unknown';
  }
};

export const getJobStatusColor = (status: JobPosting['status']) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    case 'closed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getJobStatusText = (status: JobPosting['status']) => {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'active':
      return 'Active';
    case 'paused':
      return 'Paused';
    case 'closed':
      return 'Closed';
    default:
      return 'Unknown';
  }
};