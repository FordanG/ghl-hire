import 'server-only';

import type { User } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/types/supabase';
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
  contentId: string;
  contentHref: string | null;
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
  customerEmail: string | null;
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
    unverifiedCompanies: number;
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


type QueryResult<T> = { data: T | null; error: { message: string } | null };
type AdminClient = ReturnType<typeof createAdminClient>;

// PostgREST caps responses at 1000 rows by default, so totals page through
// in blocks of this size instead of trusting a single request.
const PAGE_SIZE = 1000;
// Keep `.in()` filters short enough for request URL limits.
const ID_CHUNK_SIZE = 100;
const DISPLAY_LIMIT = 75;

function requireData<T>(result: QueryResult<T>, label: string): T {
  if (result.error || result.data === null) {
    throw new Error(`Unable to load ${label}: ${result.error?.message || 'No data returned'}`);
  }
  return result.data;
}

function safeDate(value: string | null): string {
  return value || new Date(0).toISOString();
}

async function fetchAllPages<T>(
  label: string,
  fetchPage: (from: number, to: number) => PromiseLike<QueryResult<T[]>>
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const page = requireData(await fetchPage(from, from + PAGE_SIZE - 1), label);
    rows.push(...page);
    if (page.length < PAGE_SIZE) return rows;
  }
}

async function fetchByIds<T>(
  label: string,
  ids: Iterable<string | null | undefined>,
  fetchChunk: (chunk: string[]) => PromiseLike<QueryResult<T[]>>
): Promise<T[]> {
  const unique = [...new Set([...ids].filter((id): id is string => Boolean(id)))];
  const chunks: string[][] = [];
  for (let index = 0; index < unique.length; index += ID_CHUNK_SIZE) {
    chunks.push(unique.slice(index, index + ID_CHUNK_SIZE));
  }
  const results = await Promise.all(chunks.map((chunk) => fetchChunk(chunk)));
  return results.flatMap((result) => requireData(result, label));
}

async function listAllAuthUsers(adminClient: AdminClient) {
  const users: User[] = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: PAGE_SIZE });
    if (error) {
      throw new Error(`Unable to load account status: ${error.message}`);
    }
    users.push(...data.users);
    if (data.users.length < PAGE_SIZE) return users;
  }
}

function metadataString(metadata: Json | null, key: string): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
  const value = metadata[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function reportContentHref(contentType: string, contentId: string, blogSlugsById: Map<string, string>) {
  if (contentType === 'job') return `/jobs/${contentId}`;
  if (contentType === 'blog_post') {
    const slug = blogSlugsById.get(contentId);
    return slug ? `/blog/${slug}` : null;
  }
  return null;
}

export async function getAdminDashboardData(access: AdminAccess): Promise<AdminDashboardData> {
  const adminClient = createAdminClient();

  // Phase 1: the display lists (newest rows only), plus totals computed by
  // dedicated queries so they cover the whole table, not the display window.
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
    authUsers,
    profileCountResult,
    companyCountResult,
    unverifiedCompanyCountResult,
    jobCountResult,
    activeJobCountResult,
    applicationCountResult,
    pendingReportCountResult,
    openTicketCountResult,
    activeSubscriptionCountResult,
    capturedTransactions,
    paidActiveSubscriptions,
  ] = await Promise.all([
    adminClient
      .from('profiles')
      .select('id, user_id, full_name, email, location, skills, is_available, created_at')
      .order('created_at', { ascending: false })
      .limit(DISPLAY_LIMIT),
    adminClient
      .from('companies')
      .select('id, user_id, company_name, email, industry, location, is_verified, created_at')
      .order('created_at', { ascending: false })
      .limit(DISPLAY_LIMIT),
    adminClient
      .from('jobs')
      .select('id, company_id, title, status, location, remote, applications_count, views_count, created_at')
      .order('created_at', { ascending: false })
      .limit(DISPLAY_LIMIT),
    adminClient
      .from('applications')
      .select('id, job_id, profile_id, status, applied_at')
      .order('applied_at', { ascending: false })
      .limit(DISPLAY_LIMIT),
    adminClient
      .from('content_reports')
      .select('id, content_type, content_id, reason, description, status, created_at')
      .order('created_at', { ascending: false })
      .limit(DISPLAY_LIMIT),
    adminClient
      .from('support_tickets')
      .select('id, profile_id, ticket_number, subject, category, priority, status, metadata, created_at')
      .order('created_at', { ascending: false })
      .limit(DISPLAY_LIMIT),
    adminClient
      .from('subscriptions')
      .select('id, company_id, plan_type, status, price_cents, currency, billing_interval, current_period_end')
      .order('created_at', { ascending: false })
      .limit(DISPLAY_LIMIT),
    adminClient
      .from('payment_transactions')
      .select('id, company_id, amount_cents, currency, status, description, created_at')
      .order('created_at', { ascending: false })
      .limit(DISPLAY_LIMIT),
    adminClient.from('admin_roles').select('profile_id, role'),
    listAllAuthUsers(adminClient),
    adminClient.from('profiles').select('*', { count: 'exact', head: true }),
    adminClient.from('companies').select('*', { count: 'exact', head: true }),
    adminClient
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .or('is_verified.is.null,is_verified.eq.false'),
    adminClient.from('jobs').select('*', { count: 'exact', head: true }),
    adminClient.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    adminClient.from('applications').select('*', { count: 'exact', head: true }),
    adminClient.from('content_reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    adminClient
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress', 'waiting_customer', 'waiting_internal']),
    adminClient.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    fetchAllPages('captured revenue', (from, to) =>
      adminClient
        .from('payment_transactions')
        .select('amount_cents, currency')
        .eq('status', 'succeeded')
        .order('id')
        .range(from, to)
    ),
    fetchAllPages('recurring revenue', (from, to) =>
      adminClient
        .from('subscriptions')
        .select('price_cents, billing_interval')
        .eq('status', 'active')
        .neq('plan_type', 'free')
        .order('id')
        .range(from, to)
    ),
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

  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
  const jobsById = new Map(jobs.map((job) => [job.id, job]));
  const displayedCompanyIds = companies.map((company) => company.id);

  // Phase 2: resolve rows referenced by displayed records that fall outside
  // the display window, plus per-company plan and active-job data.
  const [extraJobs, extraProfiles, companySubscriptions, companyActiveJobs, blogPosts] = await Promise.all([
    fetchByIds(
      'application jobs',
      applications.map((application) => application.job_id).filter((id) => !jobsById.has(id)),
      (chunk) => adminClient.from('jobs').select('id, company_id, title').in('id', chunk)
    ),
    fetchByIds(
      'application and ticket profiles',
      [...applications.map((application) => application.profile_id), ...tickets.map((ticket) => ticket.profile_id)].filter(
        (id) => id && !profilesById.has(id)
      ),
      (chunk) => adminClient.from('profiles').select('id, full_name, email').in('id', chunk)
    ),
    fetchByIds('company plans', displayedCompanyIds, (chunk) =>
      adminClient.from('subscriptions').select('company_id, plan_type').in('company_id', chunk)
    ),
    displayedCompanyIds.length
      ? fetchAllPages('company active jobs', (from, to) =>
          adminClient
            .from('jobs')
            .select('id, company_id')
            .eq('status', 'active')
            .in('company_id', displayedCompanyIds)
            .order('id')
            .range(from, to)
        )
      : Promise.resolve([]),
    fetchByIds(
      'reported blog posts',
      reports.filter((report) => report.content_type === 'blog_post').map((report) => report.content_id),
      (chunk) => adminClient.from('blog_posts').select('id, slug').in('id', chunk)
    ),
  ]);

  const jobLookup = new Map<string, { title: string; company_id: string }>(
    [...jobs, ...extraJobs].map((job) => [job.id, { title: job.title, company_id: job.company_id }])
  );
  const profileLookup = new Map<string, { full_name: string; email: string }>(
    [...profiles, ...extraProfiles].map((profile) => [profile.id, { full_name: profile.full_name, email: profile.email }])
  );

  // Phase 3: company names for every displayed row that references a company.
  const companyNamesById = new Map(companies.map((company) => [company.id, company.company_name]));
  const extraCompanies = await fetchByIds(
    'related companies',
    [
      ...[...jobLookup.values()].map((job) => job.company_id),
      ...subscriptions.map((subscription) => subscription.company_id),
      ...transactions.map((transaction) => transaction.company_id),
    ].filter((id) => !companyNamesById.has(id)),
    (chunk) => adminClient.from('companies').select('id, company_name').in('id', chunk)
  );
  for (const company of extraCompanies) {
    companyNamesById.set(company.id, company.company_name);
  }

  type AdminAuthUser = (typeof authUsers)[number] & {
    banned_until?: string | null;
  };
  const authUsersById = new Map((authUsers as AdminAuthUser[]).map((user) => [user.id, user]));
  const rolesByProfileId = new Map(roles.map((role) => [role.profile_id, role.role]));
  const planByCompanyId = new Map(
    companySubscriptions.map((subscription) => [subscription.company_id, subscription.plan_type])
  );
  const activeJobsByCompanyId = new Map<string, number>();
  for (const job of companyActiveJobs) {
    activeJobsByCompanyId.set(job.company_id, (activeJobsByCompanyId.get(job.company_id) || 0) + 1);
  }
  const blogSlugsById = new Map(blogPosts.map((post) => [post.id, post.slug]));
  const companyName = (id: string | null | undefined) =>
    (id && companyNamesById.get(id)) || 'Unknown company';

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
    activeJobs: activeJobsByCompanyId.get(company.id) || 0,
    plan: planByCompanyId.get(company.id) || 'free',
    createdAt: safeDate(company.created_at),
  }));

  const jobRows: AdminJob[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    companyName: companyName(job.company_id),
    status: job.status || 'draft',
    location: job.location,
    remote: job.remote ?? false,
    applications: job.applications_count || 0,
    views: job.views_count || 0,
    createdAt: safeDate(job.created_at),
  }));

  const applicationRows: AdminApplication[] = applications.map((application) => {
    const job = jobLookup.get(application.job_id);
    const profile = profileLookup.get(application.profile_id);
    return {
      id: application.id,
      candidateName: profile?.full_name || 'Unknown candidate',
      candidateEmail: profile?.email || 'No email',
      jobTitle: job?.title || 'Unknown job',
      companyName: companyName(job?.company_id),
      status: application.status || 'pending',
      appliedAt: safeDate(application.applied_at),
    };
  });

  const reportRows: AdminReport[] = reports.map((report) => ({
    id: report.id,
    contentType: report.content_type,
    contentId: report.content_id,
    contentHref: reportContentHref(report.content_type, report.content_id, blogSlugsById),
    reason: report.reason,
    description: report.description,
    status: report.status,
    createdAt: safeDate(report.created_at),
  }));

  const ticketRows: AdminTicket[] = tickets.map((ticket) => {
    // Employer and contact-form tickets have no profile_id; the submitter's
    // identity is stored in the ticket metadata instead.
    const profile = ticket.profile_id ? profileLookup.get(ticket.profile_id) : undefined;
    const metadataName =
      metadataString(ticket.metadata, 'user_name') || metadataString(ticket.metadata, 'contact_name');
    const metadataEmail =
      metadataString(ticket.metadata, 'user_email') || metadataString(ticket.metadata, 'contact_email');
    return {
      id: ticket.id,
      number: ticket.ticket_number,
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      customerName:
        profile?.full_name ||
        metadataName ||
        metadataEmail ||
        (ticket.profile_id ? 'Deleted account' : 'Guest / system'),
      customerEmail: profile?.email || metadataEmail,
      createdAt: safeDate(ticket.created_at),
    };
  });

  const subscriptionRows: AdminSubscription[] = subscriptions.map((subscription) => ({
    id: subscription.id,
    companyName: companyName(subscription.company_id),
    plan: subscription.plan_type,
    status: subscription.status,
    priceCents: subscription.price_cents || 0,
    currency: subscription.currency || 'USD',
    interval: subscription.billing_interval || 'month',
    periodEnd: subscription.current_period_end,
  }));

  const transactionRows: AdminTransaction[] = transactions.map((transaction) => ({
    id: transaction.id,
    companyName: companyName(transaction.company_id),
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

  const monthlyRecurringRevenueCents = paidActiveSubscriptions.reduce((total, subscription) => {
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
      unverifiedCompanies: unverifiedCompanyCountResult.count || 0,
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
