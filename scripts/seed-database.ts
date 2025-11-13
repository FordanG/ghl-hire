/**
 * GHL Hire - Database Seed Script
 *
 * This script creates realistic seed data for development and testing.
 * Run with: npx tsx scripts/seed-database.ts
 *
 * Requirements:
 * - SUPABASE_SERVICE_ROLE_KEY in environment
 * - NEXT_PUBLIC_SUPABASE_URL in environment
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing required environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Company data
const companies = [
  {
    company_name: 'SaaS Agency Pro',
    email: 'contact@saasagencypro.com',
    website: 'https://saasagencypro.com',
    description: 'Leading GoHighLevel agency specializing in SaaS automation and white-label solutions for growing businesses.',
    size: '11-50',
    industry: 'Marketing Automation',
    location: 'Remote',
    is_verified: true
  },
  {
    company_name: 'AutomatePro',
    email: 'hello@automatepro.io',
    website: 'https://automatepro.io',
    description: 'We build custom automation solutions for agencies using GoHighLevel API integrations.',
    size: '1-10',
    industry: 'Software Development',
    location: 'United States',
    is_verified: true
  },
  {
    company_name: 'WhiteLabel Wizards',
    email: 'team@whitelabelwizards.com',
    website: 'https://whitelabelwizards.com',
    description: 'Premium white-label GoHighLevel solutions for agencies looking to scale.',
    size: '11-50',
    industry: 'Marketing Automation',
    location: 'Toronto, Canada',
    is_verified: true
  },
  {
    company_name: 'GHL Masters',
    email: 'info@ghlmasters.com',
    website: 'https://ghlmasters.com',
    description: 'Expert GoHighLevel consultants helping businesses maximize their CRM potential.',
    size: '1-10',
    industry: 'Consulting',
    location: 'Remote',
    is_verified: false
  },
  {
    company_name: 'FunnelFlow Agency',
    email: 'contact@funnelflow.com',
    website: 'https://funnelflow.com',
    description: 'Conversion-focused funnel building and automation for high-growth companies.',
    size: '11-50',
    industry: 'Marketing',
    location: 'Austin, TX',
    is_verified: true
  }
]

// Job seekers data
const jobSeekers = [
  {
    full_name: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    location: 'San Francisco, CA',
    bio: 'GoHighLevel specialist with 3+ years of experience building marketing automation workflows. Passionate about helping businesses scale with smart automation.',
    skills: ['GoHighLevel', 'Marketing Automation', 'Workflow Design', 'API Integration', 'CRM Management'],
    experience_years: 3,
    linkedin_url: 'https://linkedin.com/in/alexthompson',
    is_available: true
  },
  {
    full_name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    location: 'Remote',
    bio: 'Full-stack developer specializing in GHL API integrations and custom solutions. Love creating tools that make marketers lives easier.',
    skills: ['JavaScript', 'Node.js', 'GoHighLevel API', 'REST APIs', 'Webhooks', 'Python'],
    experience_years: 5,
    linkedin_url: 'https://linkedin.com/in/mariagarcia',
    portfolio_url: 'https://mariagarcia.dev',
    is_available: true
  },
  {
    full_name: 'James Chen',
    email: 'james.chen@example.com',
    location: 'Toronto, Canada',
    bio: 'Account manager with deep GHL knowledge. Helped 50+ agencies onboard and optimize their GHL systems.',
    skills: ['Account Management', 'GoHighLevel', 'Client Success', 'Project Management', 'Training'],
    experience_years: 4,
    linkedin_url: 'https://linkedin.com/in/jameschen',
    is_available: true
  },
  {
    full_name: 'Sarah Miller',
    email: 'sarah.miller@example.com',
    location: 'Austin, TX',
    bio: 'Funnel builder and conversion optimization expert. Built 100+ high-converting funnels in GoHighLevel.',
    skills: ['Funnel Building', 'GoHighLevel', 'Conversion Optimization', 'A/B Testing', 'Copywriting'],
    experience_years: 2,
    linkedin_url: 'https://linkedin.com/in/sarahmiller',
    is_available: true
  },
  {
    full_name: 'David Rodriguez',
    email: 'david.rodriguez@example.com',
    location: 'Remote',
    bio: 'Junior developer eager to specialize in GoHighLevel integrations. Strong JavaScript skills and quick learner.',
    skills: ['JavaScript', 'React', 'Node.js', 'API Integration', 'Git'],
    experience_years: 1,
    linkedin_url: 'https://linkedin.com/in/davidrodriguez',
    portfolio_url: 'https://davidrodriguez.com',
    is_available: true
  }
]

// Jobs data (will be created with company_id references)
const jobsTemplate = [
  {
    title: 'GoHighLevel Specialist',
    description: `We are seeking a talented GoHighLevel Specialist to join our fast-growing SaaS agency. You will be responsible for designing, building, and optimizing marketing automation workflows, campaigns, and funnels for a diverse portfolio of clients.

Key Responsibilities:
• Build and optimize GoHighLevel funnels, automations, and triggers
• Collaborate with account managers and developers on custom solutions
• Analyze campaign performance and implement best practices
• Support onboarding and training for client teams
• Stay current with GHL platform updates and new features`,
    requirements: `• 2+ years of hands-on experience with GoHighLevel platform
• Proven track record of building and scaling automations and marketing campaigns
• Strong analytical and problem-solving skills
• Excellent communication and project management abilities
• Experience with CRM systems and marketing automation tools
• Understanding of sales funnels and conversion optimization`,
    benefits: `• Competitive salary with performance bonuses
• 100% remote work with flexible hours
• Professional development and GHL certification support
• Health insurance and wellness benefits
• Collaborative team environment`,
    location: 'Remote',
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_min: 50000,
    salary_max: 75000,
    remote: true,
    status: 'active' as const,
    is_featured: true
  },
  {
    title: 'GHL API Developer',
    description: `Build and maintain integrations with the GoHighLevel API for marketing automation. We're looking for a skilled developer who can create custom solutions that extend GHL's capabilities.

What You'll Do:
• Develop custom integrations using GoHighLevel API
• Build webhooks and automation workflows
• Create custom reporting dashboards
• Troubleshoot and optimize existing integrations
• Document technical specifications and API usage`,
    requirements: `• 3+ years of software development experience
• Strong proficiency in JavaScript/Node.js or Python
• Experience with RESTful APIs and webhooks
• Familiarity with GoHighLevel platform (or willingness to learn)
• Understanding of OAuth and API authentication
• Experience with Git and version control`,
    benefits: `• Competitive contract rates ($60-$90/hour)
• Flexible working hours
• Work with cutting-edge marketing automation technology
• Opportunity to work on diverse projects
• Potential for long-term engagement`,
    location: 'United States',
    job_type: 'Contract',
    experience_level: 'Senior Level',
    salary_min: 60,
    salary_max: 90,
    remote: true,
    status: 'active' as const,
    is_featured: false
  },
  {
    title: 'Account Manager - GHL Focus',
    description: `Support agency clients, onboard new users, and manage GoHighLevel projects. We need someone who can bridge the gap between technical capabilities and client success.

Your Role:
• Manage relationships with agency clients using our white-label GHL solution
• Onboard new clients and provide training
• Coordinate with technical team on customization requests
• Monitor client satisfaction and identify upsell opportunities
• Create documentation and training materials`,
    requirements: `• 2+ years in account management or client success
• Experience with GoHighLevel platform preferred
• Strong communication and interpersonal skills
• Ability to explain technical concepts to non-technical users
• Project management experience
• Customer-focused mindset`,
    benefits: `• Competitive salary with commission structure
• Hybrid work (3 days remote, 2 days in Toronto office)
• Professional development opportunities
• Health and dental benefits
• Team events and company culture`,
    location: 'Toronto, Canada (Hybrid)',
    job_type: 'Part-Time',
    experience_level: 'Mid Level',
    salary_min: 35000,
    salary_max: 50000,
    remote: false,
    status: 'active' as const,
    is_featured: false
  },
  {
    title: 'Senior GHL Automation Expert',
    description: `Lead our automation practice and mentor junior team members while delivering enterprise-level GoHighLevel solutions.

Responsibilities:
• Design complex automation workflows for enterprise clients
• Lead technical discovery sessions with clients
• Mentor and train junior GHL specialists
• Establish automation best practices and standards
• Contribute to internal tools and templates`,
    requirements: `• 5+ years with GoHighLevel or similar platforms
• Proven experience with enterprise-level implementations
• Leadership and mentoring experience
• Strong understanding of business processes and workflows
• Excellent client-facing communication skills`,
    benefits: `• Senior-level compensation package
• Leadership role with growth potential
• 100% remote flexibility
• Conference and training budget
• Equity options`,
    location: 'Remote',
    job_type: 'Full-Time',
    experience_level: 'Senior Level',
    salary_min: 80000,
    salary_max: 110000,
    remote: true,
    status: 'active' as const,
    is_featured: true
  },
  {
    title: 'Funnel Builder - GHL Platform',
    description: `Create high-converting funnels and landing pages using GoHighLevel for our agency clients.

Your Mission:
• Design and build conversion-optimized funnels
• A/B test funnel elements and optimize performance
• Collaborate with copywriters and designers
• Implement tracking and analytics
• Stay current with funnel building best practices`,
    requirements: `• 2+ years building funnels (ClickFunnels, GHL, or similar)
• Understanding of conversion optimization principles
• Basic HTML/CSS knowledge helpful
• Creative problem-solving skills
• Attention to detail`,
    benefits: `• Competitive salary
• Remote-first culture
• Creative freedom
• Performance bonuses based on client results
• Health benefits`,
    location: 'Austin, TX (Remote Available)',
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_min: 45000,
    salary_max: 65000,
    remote: true,
    status: 'active' as const,
    is_featured: false
  }
]

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n')

  try {
    // Step 1: Create auth users and companies
    console.log('1️⃣  Creating companies and auth users...')
    const createdCompanies = []

    for (const company of companies) {
      // Create auth user for company
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: company.email,
        password: 'Password123!', // Default password for dev
        email_confirm: true,
        user_metadata: {
          user_type: 'employer',
          company_name: company.company_name
        }
      })

      if (authError) {
        console.error(`  ❌ Failed to create auth user for ${company.company_name}:`, authError.message)
        continue
      }

      console.log(`  ✅ Created auth user for: ${company.company_name}`)

      // Create company profile
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          user_id: authUser.user.id,
          ...company
        })
        .select()
        .single()

      if (companyError) {
        console.error(`  ❌ Failed to create company profile:`, companyError.message)
        continue
      }

      createdCompanies.push(companyData)
      console.log(`  ✅ Created company: ${company.company_name} (ID: ${companyData.id})`)
    }

    console.log(`\n✅ Created ${createdCompanies.length}/${companies.length} companies\n`)

    // Step 2: Create job seeker auth users and profiles
    console.log('2️⃣  Creating job seeker profiles...')
    const createdProfiles = []

    for (const jobSeeker of jobSeekers) {
      // Create auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: jobSeeker.email,
        password: 'Password123!',
        email_confirm: true,
        user_metadata: {
          user_type: 'job_seeker',
          full_name: jobSeeker.full_name
        }
      })

      if (authError) {
        console.error(`  ❌ Failed to create auth user for ${jobSeeker.full_name}:`, authError.message)
        continue
      }

      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authUser.user.id,
          ...jobSeeker
        })
        .select()
        .single()

      if (profileError) {
        console.error(`  ❌ Failed to create profile:`, profileError.message)
        continue
      }

      createdProfiles.push(profileData)
      console.log(`  ✅ Created profile: ${jobSeeker.full_name} (ID: ${profileData.id})`)
    }

    console.log(`\n✅ Created ${createdProfiles.length}/${jobSeekers.length} profiles\n`)

    // Step 3: Create jobs
    console.log('3️⃣  Creating job postings...')
    const createdJobs = []

    // Assign jobs to companies (distribute evenly)
    for (let i = 0; i < jobsTemplate.length; i++) {
      const company = createdCompanies[i % createdCompanies.length]
      const jobData = jobsTemplate[i]

      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
          company_id: company.id,
          ...jobData
        })
        .select()
        .single()

      if (jobError) {
        console.error(`  ❌ Failed to create job "${jobData.title}":`, jobError.message)
        continue
      }

      createdJobs.push(job)
      console.log(`  ✅ Created job: "${jobData.title}" for ${company.company_name}`)
    }

    console.log(`\n✅ Created ${createdJobs.length}/${jobsTemplate.length} jobs\n`)

    // Step 4: Create some sample applications
    console.log('4️⃣  Creating sample job applications...')
    let applicationCount = 0

    // Create 2-3 applications per job seeker
    for (const profile of createdProfiles.slice(0, 3)) {
      // Apply to 2 random jobs
      const jobsToApply = createdJobs.slice(0, 2)

      for (const job of jobsToApply) {
        const { error: appError } = await supabase
          .from('applications')
          .insert({
            job_id: job.id,
            profile_id: profile.id,
            cover_letter: `I am very interested in the ${job.title} position. With my experience in GoHighLevel and passion for marketing automation, I believe I would be a great fit for your team.`,
            status: 'pending'
          })

        if (!appError) {
          applicationCount++
          console.log(`  ✅ ${profile.full_name} applied to "${job.title}"`)
        }
      }
    }

    console.log(`\n✅ Created ${applicationCount} applications\n`)

    // Step 5: Summary
    console.log('📊 Seeding Summary:')
    console.log(`  Companies: ${createdCompanies.length}`)
    console.log(`  Job Seekers: ${createdProfiles.length}`)
    console.log(`  Jobs: ${createdJobs.length}`)
    console.log(`  Applications: ${applicationCount}`)
    console.log(`\n🎉 Database seeding completed successfully!`)
    console.log(`\n📝 Default credentials:`)
    console.log(`  Email: Any email from the seed data`)
    console.log(`  Password: Password123!`)

  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding
seedDatabase().then(() => {
  console.log('\n✅ Done!')
  process.exit(0)
}).catch((error) => {
  console.error('\n💥 Fatal error:', error)
  process.exit(1)
})
