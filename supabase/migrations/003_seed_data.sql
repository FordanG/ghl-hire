-- GHL Hire Seed Data
-- Migration: 003_seed_data
-- Description: Initial seed data for development and testing

-- =====================================================
-- IMPORTANT: SEED DATA IS COMMENTED OUT BY DEFAULT
-- =====================================================
-- This seed data requires auth users to exist first.
-- To use this seed data:
-- 1. Create test users in Supabase Auth (via dashboard or API)
-- 2. Replace the placeholder user_id values below with real auth.users IDs
-- 3. Uncomment the INSERT statements
-- 4. Run the SQL manually via Supabase SQL Editor

-- Alternatively, create seed data dynamically after user signup in your application

/*
-- =====================================================
-- SEED COMPANIES
-- =====================================================
INSERT INTO companies (id, user_id, company_name, email, website, description, size, industry, location, is_verified) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '00000000-0000-0000-0000-000000000001', 'SaaS Agency Pro', 'contact@saasagencypro.com', 'https://saasagencypro.com', 'Leading GoHighLevel agency specializing in SaaS automation and white-label solutions for growing businesses.', '11-50', 'Marketing Automation', 'Remote', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '00000000-0000-0000-0000-000000000002', 'AutomatePro', 'hello@automatepro.io', 'https://automatepro.io', 'We build custom automation solutions for agencies using GoHighLevel API integrations.', '1-10', 'Software Development', 'United States', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '00000000-0000-0000-0000-000000000003', 'WhiteLabel Wizards', 'team@whitelabelwizards.com', 'https://whitelabelwizards.com', 'Premium white-label GoHighLevel solutions for agencies looking to scale.', '11-50', 'Marketing Automation', 'Toronto, Canada', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '00000000-0000-0000-0000-000000000004', 'GHL Masters', 'info@ghlmasters.com', 'https://ghlmasters.com', 'Expert GoHighLevel consultants helping businesses maximize their CRM potential.', '1-10', 'Consulting', 'Remote', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '00000000-0000-0000-0000-000000000005', 'FunnelFlow Agency', 'contact@funnelflow.com', 'https://funnelflow.com', 'Conversion-focused funnel building and automation for high-growth companies.', '11-50', 'Marketing', 'Austin, TX', true);

-- =====================================================
-- SEED JOBS
-- =====================================================

INSERT INTO jobs (company_id, title, description, requirements, benefits, location, job_type, experience_level, salary_min, salary_max, remote, status, is_featured) VALUES

-- SaaS Agency Pro Jobs
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'GoHighLevel Specialist',
'We are seeking a talented GoHighLevel Specialist to join our fast-growing SaaS agency. You will be responsible for designing, building, and optimizing marketing automation workflows, campaigns, and funnels for a diverse portfolio of clients.

Key Responsibilities:
• Build and optimize GoHighLevel funnels, automations, and triggers
• Collaborate with account managers and developers on custom solutions
• Analyze campaign performance and implement best practices
• Support onboarding and training for client teams
• Stay current with GHL platform updates and new features',
'• 2+ years of hands-on experience with GoHighLevel platform
• Proven track record of building and scaling automations and marketing campaigns
• Strong analytical and problem-solving skills
• Excellent communication and project management abilities
• Experience with CRM systems and marketing automation tools
• Understanding of sales funnels and conversion optimization',
'• Competitive salary with performance bonuses
• 100% remote work with flexible hours
• Professional development and GHL certification support
• Health insurance and wellness benefits
• Collaborative team environment',
'Remote', 'Full-Time', 'Mid Level', 50000, 75000, true, 'active', true),

-- AutomatePro Jobs
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'GHL API Developer',
'Build and maintain integrations with the GoHighLevel API for marketing automation. We''re looking for a skilled developer who can create custom solutions that extend GHL''s capabilities.

What You''ll Do:
• Develop custom integrations using GoHighLevel API
• Build webhooks and automation workflows
• Create custom reporting dashboards
• Troubleshoot and optimize existing integrations
• Document technical specifications and API usage',
'• 3+ years of software development experience
• Strong proficiency in JavaScript/Node.js or Python
• Experience with RESTful APIs and webhooks
• Familiarity with GoHighLevel platform (or willingness to learn)
• Understanding of OAuth and API authentication
• Experience with Git and version control',
'• Competitive contract rates ($60-$90/hour)
• Flexible working hours
• Work with cutting-edge marketing automation technology
• Opportunity to work on diverse projects
• Potential for long-term engagement',
'United States', 'Contract', 'Senior Level', 60, 90, true, 'active', false),

-- WhiteLabel Wizards Jobs
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Account Manager - GHL Focus',
'Support agency clients, onboard new users, and manage GoHighLevel projects. We need someone who can bridge the gap between technical capabilities and client success.

Your Role:
• Manage relationships with agency clients using our white-label GHL solution
• Onboard new clients and provide training
• Coordinate with technical team on customization requests
• Monitor client satisfaction and identify upsell opportunities
• Create documentation and training materials',
'• 2+ years in account management or client success
• Experience with GoHighLevel platform preferred
• Strong communication and interpersonal skills
• Ability to explain technical concepts to non-technical users
• Project management experience
• Customer-focused mindset',
'• Competitive salary with commission structure
• Hybrid work (3 days remote, 2 days in Toronto office)
• Professional development opportunities
• Health and dental benefits
• Team events and company culture',
'Toronto, Canada (Hybrid)', 'Part-Time', 'Mid Level', 35000, 50000, false, 'active', false),

-- More jobs for variety
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Senior GHL Automation Expert',
'Lead our automation practice and mentor junior team members while delivering enterprise-level GoHighLevel solutions.

Responsibilities:
• Design complex automation workflows for enterprise clients
• Lead technical discovery sessions with clients
• Mentor and train junior GHL specialists
• Establish automation best practices and standards
• Contribute to internal tools and templates',
'• 5+ years with GoHighLevel or similar platforms
• Proven experience with enterprise-level implementations
• Leadership and mentoring experience
• Strong understanding of business processes and workflows
• Excellent client-facing communication skills',
'• Senior-level compensation package
• Leadership role with growth potential
• 100% remote flexibility
• Conference and training budget
• Equity options',
'Remote', 'Full-Time', 'Senior Level', 80000, 110000, true, 'active', true),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'GHL Implementation Consultant',
'Help businesses successfully implement and optimize their GoHighLevel systems.

What We Offer:
• Work with diverse clients across industries
• Flexible consulting schedule
• Opportunity to specialize in specific GHL features
• Supportive team environment',
'• 3+ years GoHighLevel experience
• Consulting or professional services background
• Excellent problem-solving abilities
• Strong presentation skills
• Ability to work independently',
'• Competitive hourly rate
• Flexible schedule
• Professional development
• Work from anywhere',
'Remote', 'Contract', 'Senior Level', 75, 125, true, 'active', false),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Funnel Builder - GHL Platform',
'Create high-converting funnels and landing pages using GoHighLevel for our agency clients.

Your Mission:
• Design and build conversion-optimized funnels
• A/B test funnel elements and optimize performance
• Collaborate with copywriters and designers
• Implement tracking and analytics
• Stay current with funnel building best practices',
'• 2+ years building funnels (ClickFunnels, GHL, or similar)
• Understanding of conversion optimization principles
• Basic HTML/CSS knowledge helpful
• Creative problem-solving skills
• Attention to detail',
'• Competitive salary
• Remote-first culture
• Creative freedom
• Performance bonuses based on client results
• Health benefits',
'Austin, TX (Remote Available)', 'Full-Time', 'Mid Level', 45000, 65000, true, 'active', false),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Junior GHL Developer',
'Entry-level position for developers looking to specialize in GoHighLevel integrations and automation.

Learn and Grow:
• Work alongside senior developers
• Build simple integrations and automations
• Participate in code reviews
• Contribute to documentation
• Gain hands-on experience with marketing automation',
'• 1+ years of programming experience (any language)
• Familiarity with JavaScript/Node.js preferred
• Understanding of APIs and webhooks
• Eagerness to learn
• Good communication skills',
'• Mentorship from experienced developers
• Remote work flexibility
• Learning budget for courses and certifications
• Career growth path
• Competitive entry-level salary',
'Remote', 'Full-Time', 'Entry Level', 40000, 55000, true, 'active', false),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Marketing Automation Specialist',
'Execute marketing automation campaigns using GoHighLevel for multiple clients.

Day-to-Day:
• Set up email and SMS campaigns in GHL
• Configure automation triggers and workflows
• Monitor campaign performance and optimize
• Manage contact lists and segmentation
• Report on campaign results',
'• 1-2 years in marketing automation or email marketing
• Experience with GoHighLevel, HubSpot, or similar platforms
• Understanding of marketing principles
• Data-driven mindset
• Strong organizational skills',
'• Grow with a fast-paced agency
• Remote work options
• Competitive compensation
• Exposure to various industries
• Career advancement opportunities',
'Remote', 'Full-Time', 'Entry Level', 40000, 55000, true, 'active', false),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'GHL Technical Support Specialist',
'Provide technical support for clients using our white-label GoHighLevel solutions.

Support Role:
• Respond to client technical inquiries
• Troubleshoot GHL platform issues
• Create help documentation
• Escalate complex issues to development team
• Track and resolve support tickets',
'• 1+ years in technical support role
• Strong troubleshooting skills
• Excellent written communication
• Patience and customer service orientation
• Basic understanding of web technologies helpful',
'• Remote work
• Part-time hours (20-30 hours/week)
• Flexible schedule
• Learn GoHighLevel platform in-depth
• Potential to grow into full-time role',
'Remote', 'Part-Time', 'Entry Level', 20, 30, true, 'active', false),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'GHL Workflow Designer',
'Design and implement sophisticated workflows for client business processes using GoHighLevel.

Create Impact:
• Map out client business processes
• Design workflow diagrams and logic
• Implement workflows in GoHighLevel
• Test and refine automation sequences
• Train clients on workflow usage',
'• 2+ years with workflow automation tools
• Experience with GoHighLevel preferred
• Strong process mapping skills
• Analytical thinking
• Client-facing communication abilities',
'• Contract position with flexible hours
• Work with innovative companies
• Competitive freelance rates
• Portfolio-building opportunities
• Collaborative remote team',
'Remote', 'Freelance', 'Mid Level', 50, 85, true, 'active', false);

-- =====================================================
-- SEED SUBSCRIPTIONS
-- =====================================================

INSERT INTO subscriptions (company_id, plan_type, status, job_post_limit) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'premium', 'active', -1),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'basic', 'active', 5),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'basic', 'active', 5),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'free', 'active', 1),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'premium', 'active', -1);

-- Note: After uncommenting and running this seed data, you'll need to:
-- 1. Create actual auth users in Supabase
-- 2. Update the user_id fields in companies table with real auth.users IDs
-- 3. For local development, you can create test users and update these records
*/
