import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import type { AdminAccess } from './auth';

export type AdminPerson = {
  id: string;
  userId: string;
  name: string;
  email: string;
  location: string | null;
  skills: string[];
  isAvailable: boolean;
  isSuspended: boolean;
  lastSignInAt: string | null;
  createdAt: string;
  staffRole: string | null;
};

export type AdminCompany = {
  id: string;
  userId: string;
  name: string;
  email: string;
  industry: string | null;
  location: string | null;
  isVerified: boolean;
  isSuspended: boolean;
  activeJobs: number;
  plan: string;
  createdAt: string;
};

export type AdminJob = {
  id: string;
  title: string;
  companyName: string;
  status: string;
  location: string;
  remote: boolean;
  applications: number;
  views: number;
  createdAt: string;
};

export type AdminApplication = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  status: string;
  appliedAt: string;
};

export type AdminReport = {
  id: string;
  contentType: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: string;
};

export type AdminTicket = {
  id: string;
  number: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  customerName: string;
  createdAt: string;
};

export type AdminSubscription = {
  id: string;
  companyName: string;
  plan: string;
  status: string;
  priceCents: number;
  currency: string;
  interval: string;
  periodEnd: string | null;
};

export type AdminTransaction = {
  id: string;
  companyName: string;
  amountCents: number;
  currency: string;
  status: string;
  description: string | null;
  createdAt: string;
};

export type AdminActivity = {
  id: string;
  type: 'person' | 'company' | 'job' | 'application' | 'payment' | 'report' | 'ticket';
  title: string;
  detail: string;
  occurredAt: string;
};

export type AdminDashboardData = {
  generatedAt: string;
  operator: {
    name: string;
    email: string;
    role: string;
  };
  metrics: {
    jobSeekers: number;
    employers: number;
    activeJobs: number;
    totalJobs: number;
    applications: number;
    pendingReports: number;
    openTickets: number;
    activeSubscriptions: number;
    capturedRevenueCents: number;
    monthlyRecurringRevenueCents: number;
  };
  people: AdminPerson[];
  companies: AdminCompany[];
  jobs: AdminJob[];
  applications: AdminApplication[];
  reports: AdminReport[];
  tickets: AdminTicket[];
  subscriptions: AdminSubscription[];
  transactions: AdminTransaction[];
  activity: AdminActivity[];
};

function requireData<T>(result: { data: T | null; error: { message: string } | null }, label: string): T {
  if (result.error || result.data === null) {
    throw new Error(`Unable to load ${label}: ${result.error?.message || 'No data returned'}`);
  }
  return result.data;
}

function safeDate(value: string | null): string {
  return value || new Date(0).toISOString();
}

export async function getAdminDashboardData(access: AdminAccess): Promise<AdminDashboardData> {
  const adminClient = createAdminClient();

  const [
    profilesResult,
    companiesResult,
    jobsResult,
    applicationsResult,
    reportsResult,
    ticketsResult,
    subscriptionsResult,
    transactionsResult,
    rolesResult,
    authUsersResult,
    profileCountResult,
    companyCountResult,
    jobCountResult,
    activeJobCountResult,
    applicationCountResult,
    pendingReportCountResult,
    openTicketCountResult,
    activeSubscriptionCountResult,
    capturedTransactionsResult,
  ] = await Promise.all([
    adminClient
      .from('profiles')
      .select('id, user_id, full_name, email, location, skills, is_available, created_at')
      .order('created_at', { ascending: false })
      .limit(75),
    adminClient
      .from('companies')
      .select('id, user_id, company_name, email, industry, location, is_verified, created_at')
      .order('created_at', { ascending: false })
      .limit(75),
    adminClient
      .from('jobs')
      .select('id, company_id, title, status, location, remote, applications_count, views_count, created_at')
      .order('created_at', { ascending: false })
      .limit(75),
    adminClient
      .from('applications')
      .select('id, job_id, profile_id, status, applied_at')
      .order('applied_at', { ascending: false })
      .limit(75),
    adminClient
      .from('content_reports')
      .select('id, content_type, reason, description, status, created_at')
      .order('created_at', { ascending: false })
      .limit(75),
    adminClient
      .from('support_tickets')
      .select('id, profile_id, ticket_number, subject, category, priority, status, created_at')
      .order('created_at', { ascending: false })
      .limit(75),
    adminClient
      .from('subscriptions')
      .select('id, company_id, plan_type, status, price_cents, currency, billing_interval, current_period_end')
      .order('created_at', { ascending: false })
      .limit(75),
    adminClient
      .from('payment_transactions')
      .select('id, company_id, amount_cents, currency, status, description, created_at')
      .order('created_at', { ascending: false })
      .limit(75),
    adminClient.from('admin_roles').select('profile_id, role'),
    adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    adminClient.from('profiles').select('*', { count: 'exact', head: true }),
    adminClient.from('companies').select('*', { count: 'exact', head: true }),
    adminClient.from('jobs').select('*', { count: 'exact', head: true }),
    adminClient.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    adminClient.from('applications').select('*', { count: 'exact', head: true }),
    adminClient.from('content_reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    adminClient
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress', 'waiting_customer', 'waiting_internal']),
    adminClient.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    adminClient
      .from('payment_transactions')
      .select('amount_cents, currency')
      .eq('status', 'succeeded'),
  ]);

  const profiles = requireData(profilesResult, 'people');
  const companies = requireData(companiesResult, 'companies');
  const jobs = requireData(jobsResult, 'jobs');
  const applications = requireData(applicationsResult, 'applications');
  const reports = requireData(reportsResult, 'reports');
  const tickets = requireData(ticketsResult, 'support tickets');
  const subscriptions = requireData(subscriptionsResult, 'subscriptions');
  const transactions = requireData(transactionsResult, 'transactions');
  const roles = requireData(rolesResult, 'admin roles');
  const capturedTransactions = requireData(capturedTransactionsResult, 'captured revenue');

  if (authUsersResult.error) {
    throw new Error(`Unable to load account status: ${authUsersResult.error.message}`);
  }

  type AdminAuthUser = (typeof authUsersResult.data.users)[number] & {
    banned_until?: string | null;
  };
  const authUsersById = new Map(
    (authUsersResult.data.users as AdminAuthUser[]).map((user) => [user.id, user])
  );
  const companiesById = new Map(companies.map((company) => [company.id, company]));
  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
  const jobsById = new Map(jobs.map((job) => [job.id, job]));
  const rolesByProfileId = new Map(roles.map((role) => [role.profile_id, role.role]));
  const subscriptionsByCompanyId = new Map(
    subscriptions.map((subscription) => [subscription.company_id, subscription])
  );

  const isSuspended = (userId: string) => {
    const bannedUntil = authUsersById.get(userId)?.banned_until;
    return Boolean(bannedUntil && new Date(bannedUntil).getTime() > Date.now());
  };

  const peopleRows: AdminPerson[] = profiles.map((profile) => {
    const authUser = authUsersById.get(profile.user_id);
    return {
      id: profile.id,
      userId: profile.user_id,
      name: profile.full_name,
      email: profile.email,
      location: profile.location,
      skills: profile.skills || [],
      isAvailable: profile.is_available ?? false,
      isSuspended: isSuspended(profile.user_id),
      lastSignInAt: authUser?.last_sign_in_at || null,
      createdAt: safeDate(profile.created_at),
      staffRole: rolesByProfileId.get(profile.id) || null,
    };
  });

  const companyRows: AdminCompany[] = companies.map((company) => ({
    id: company.id,
    userId: company.user_id,
    name: company.company_name,
    email: company.email,
    industry: company.industry,
    location: company.location,
    isVerified: company.is_verified ?? false,
    isSuspended: isSuspended(company.user_id),
    activeJobs: jobs.filter((job) => job.company_id === company.id && job.status === 'active').length,
    plan: subscriptionsByCompanyId.get(company.id)?.plan_type || 'free',
    createdAt: safeDate(company.created_at),
  }));

  const jobRows: AdminJob[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    companyName: companiesById.get(job.company_id)?.company_name || 'Unknown company',
    status: job.status || 'draft',
    location: job.location,
    remote: job.remote ?? false,
    applications: job.applications_count || 0,
    views: job.views_count || 0,
    createdAt: safeDate(job.created_at),
  }));

  const applicationRows: AdminApplication[] = applications.map((application) => {
    const job = jobsById.get(application.job_id);
    const profile = profilesById.get(application.profile_id);
    return {
      id: application.id,
      candidateName: profile?.full_name || 'Unknown candidate',
      candidateEmail: profile?.email || 'No email',
      jobTitle: job?.title || 'Unknown job',
      companyName: job ? companiesById.get(job.company_id)?.company_name || 'Unknown company' : 'Unknown company',
      status: application.status || 'pending',
      appliedAt: safeDate(application.applied_at),
    };
  });

  const reportRows: AdminReport[] = reports.map((report) => ({
    id: report.id,
    contentType: report.content_type,
    reason: report.reason,
    description: report.description,
    status: report.status,
    createdAt: safeDate(report.created_at),
  }));

  const ticketRows: AdminTicket[] = tickets.map((ticket) => ({
    id: ticket.id,
    number: ticket.ticket_number,
    subject: ticket.subject,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    customerName: ticket.profile_id
      ? profilesById.get(ticket.profile_id)?.full_name || 'Deleted account'
      : 'Guest / system',
    createdAt: safeDate(ticket.created_at),
  }));

  const subscriptionRows: AdminSubscription[] = subscriptions.map((subscription) => ({
    id: subscription.id,
    companyName: companiesById.get(subscription.company_id)?.company_name || 'Unknown company',
    plan: subscription.plan_type,
    status: subscription.status,
    priceCents: subscription.price_cents || 0,
    currency: subscription.currency || 'USD',
    interval: subscription.billing_interval || 'month',
    periodEnd: subscription.current_period_end,
  }));

  const transactionRows: AdminTransaction[] = transactions.map((transaction) => ({
    id: transaction.id,
    companyName: companiesById.get(transaction.company_id)?.company_name || 'Unknown company',
    amountCents: transaction.amount_cents,
    currency: transaction.currency,
    status: transaction.status,
    description: transaction.description,
    createdAt: safeDate(transaction.created_at),
  }));

  const activity: AdminActivity[] = [
    ...peopleRows.slice(0, 6).map((person) => ({
      id: `person-${person.id}`,
      type: 'person' as const,
      title: `${person.name} joined`,
      detail: 'New job seeker profile',
      occurredAt: person.createdAt,
    })),
    ...companyRows.slice(0, 6).map((company) => ({
      id: `company-${company.id}`,
      type: 'company' as const,
      title: `${company.name} registered`,
      detail: company.plan === 'free' ? 'Free employer account' : `${company.plan} employer account`,
      occurredAt: company.createdAt,
    })),
    ...jobRows.slice(0, 6).map((job) => ({
      id: `job-${job.id}`,
      type: 'job' as const,
      title: job.title,
      detail: `${job.companyName} posted a ${job.status} job`,
      occurredAt: job.createdAt,
    })),
    ...applicationRows.slice(0, 6).map((application) => ({
      id: `application-${application.id}`,
      type: 'application' as const,
      title: `${application.candidateName} applied`,
      detail: application.jobTitle,
      occurredAt: application.appliedAt,
    })),
    ...transactionRows.slice(0, 6).map((transaction) => ({
      id: `payment-${transaction.id}`,
      type: 'payment' as const,
      title: `${transaction.companyName} payment ${transaction.status}`,
      detail: transaction.description || 'Subscription payment',
      occurredAt: transaction.createdAt,
    })),
    ...reportRows.slice(0, 6).map((report) => ({
      id: `report-${report.id}`,
      type: 'report' as const,
      title: `${report.contentType} reported`,
      detail: report.reason,
      occurredAt: report.createdAt,
    })),
    ...ticketRows.slice(0, 6).map((ticket) => ({
      id: `ticket-${ticket.id}`,
      type: 'ticket' as const,
      title: ticket.subject,
      detail: `${ticket.priority} priority support ticket`,
      occurredAt: ticket.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 12);

  const capturedRevenueCents = capturedTransactions
    .filter((transaction) => transaction.currency === 'USD')
    .reduce((total, transaction) => total + transaction.amount_cents, 0);

  const monthlyRecurringRevenueCents = subscriptions
    .filter((subscription) => subscription.status === 'active')
    .reduce((total, subscription) => {
      const price = subscription.price_cents || 0;
      return total + (subscription.billing_interval === 'year' ? Math.round(price / 12) : price);
    }, 0);

  return {
    generatedAt: new Date().toISOString(),
    operator: {
      name: access.profileName,
      email: access.email,
      role: access.role,
    },
    metrics: {
      jobSeekers: profileCountResult.count || 0,
      employers: companyCountResult.count || 0,
      activeJobs: activeJobCountResult.count || 0,
      totalJobs: jobCountResult.count || 0,
      applications: applicationCountResult.count || 0,
      pendingReports: pendingReportCountResult.count || 0,
      openTickets: openTicketCountResult.count || 0,
      activeSubscriptions: activeSubscriptionCountResult.count || 0,
      capturedRevenueCents,
      monthlyRecurringRevenueCents,
    },
    people: peopleRows,
    companies: companyRows,
    jobs: jobRows,
    applications: applicationRows,
    reports: reportRows,
    tickets: ticketRows,
    subscriptions: subscriptionRows,
    transactions: transactionRows,
    activity,
  };
}
