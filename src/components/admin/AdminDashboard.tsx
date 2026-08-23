'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  CircleUserRound,
  FileCheck2,
  FileText,
  Gauge,
  LifeBuoy,
  Menu,
  Search,
  ShieldAlert,
  Sparkles,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type {
  AdminActivity,
  AdminDashboardData,
  AdminReport,
  AdminTicket,
} from '@/lib/admin/dashboard';

const sections = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'people', label: 'People', icon: UsersRound },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'revenue', label: 'Revenue', icon: WalletCards },
  { id: 'moderation', label: 'Moderation', icon: ShieldAlert },
  { id: 'support', label: 'Support', icon: LifeBuoy },
] as const;

type AdminSection = (typeof sections)[number]['id'];
type Notice = { tone: 'success' | 'error'; message: string } | null;

const applicationStatuses = ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted', 'withdrawn'];
const jobStatuses = ['draft', 'active', 'closed', 'archived'];
const ticketStatuses = ['open', 'in_progress', 'waiting_customer', 'waiting_internal', 'resolved', 'closed'];

function isAdminSection(value: string | null): value is AdminSection {
  return sections.some((section) => section.id === value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatMoney(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value / 100);
}

function formatDate(value: string | null) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatRelative(value: string) {
  const delta = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.round(delta / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}

function titleCase(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: string) {
  if (['active', 'accepted', 'resolved', 'succeeded', 'published'].includes(status)) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
  if (['pending', 'reviewing', 'trialing', 'open', 'in_progress'].includes(status)) {
    return 'border-amber-200 bg-amber-50 text-amber-800';
  }
  if (['failed', 'rejected', 'past_due', 'urgent'].includes(status)) {
    return 'border-rose-200 bg-rose-50 text-rose-700';
  }
  if (['shortlisted', 'waiting_customer', 'waiting_internal'].includes(status)) {
    return 'border-blue-200 bg-blue-50 text-blue-700';
  }
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${statusClass(status)}`}>
      {titleCase(status)}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
    </div>
  );
}

function TableFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_-38px_rgba(15,23,42,0.55)]">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <FileCheck2 className="mx-auto h-9 w-9 text-slate-300" />
      <p className="mt-4 font-medium text-slate-700">No {label} to show</p>
      <p className="mt-1 text-sm text-slate-500">The live database returned an empty list.</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof UsersRound;
  accent: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-40px_rgba(15,23,42,0.6)] transition hover:-translate-y-0.5 hover:border-slate-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 font-serif text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

function ActivityIcon({ type }: { type: AdminActivity['type'] }) {
  const iconMap = {
    person: CircleUserRound,
    company: Building2,
    job: BriefcaseBusiness,
    application: FileText,
    payment: CircleDollarSign,
    report: ShieldAlert,
    ticket: LifeBuoy,
  };
  const Icon = iconMap[type];
  return <Icon className="h-4 w-4" />;
}

function Overview({ data, onNavigate }: { data: AdminDashboardData; onNavigate: (section: AdminSection) => void }) {
  const { metrics } = data;
  const attentionCount = metrics.pendingReports + metrics.openTickets;
  const activeJobRate = metrics.totalJobs ? Math.round((metrics.activeJobs / metrics.totalJobs) * 100) : 0;

  return (
    <>
      <section className="relative overflow-hidden rounded-[28px] bg-[#09192f] px-6 py-7 text-white shadow-[0_24px_70px_-40px_rgba(4,19,42,0.95)] sm:px-8 sm:py-9">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-blue-400/20 bg-blue-500/10" />
        <div className="absolute bottom-0 right-24 h-px w-48 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live platform command
            </div>
            <p className="text-sm text-slate-300">Good day, {data.operator.name.split(' ')[0]}.</p>
            <h1 className="mt-2 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              GHL Hire is operating with <span className="text-cyan-300">{attentionCount} items</span> needing attention.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300">
              This is the full platform view: members, employers, marketplace activity, billing, trust, and support in one place.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Marketplace pulse</span>
              <Activity className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="font-serif text-4xl font-semibold">{activeJobRate}%</p>
                <p className="mt-1 text-xs text-slate-400">of all jobs are live</p>
              </div>
              <div className="flex h-16 items-end gap-1" aria-hidden="true">
                {[28, 44, 34, 56, 48, 68, Math.max(36, activeJobRate)].map((height, index) => (
                  <span key={index} className="w-2 rounded-t bg-cyan-300/70" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="People"
          value={formatNumber(metrics.jobSeekers)}
          detail={`${formatNumber(metrics.employers)} employer accounts alongside the talent network`}
          icon={UsersRound}
          accent="bg-blue-50 text-blue-700"
        />
        <MetricCard
          label="Active jobs"
          value={formatNumber(metrics.activeJobs)}
          detail={`${formatNumber(metrics.applications)} applications submitted across the marketplace`}
          icon={BriefcaseBusiness}
          accent="bg-cyan-50 text-cyan-700"
        />
        <MetricCard
          label="Monthly run rate"
          value={formatMoney(metrics.monthlyRecurringRevenueCents)}
          detail={`${formatNumber(metrics.activeSubscriptions)} active paid and free subscriptions`}
          icon={CircleDollarSign}
          accent="bg-emerald-50 text-emerald-700"
        />
        <MetricCard
          label="Needs attention"
          value={formatNumber(attentionCount)}
          detail={`${metrics.pendingReports} reports and ${metrics.openTickets} open support tickets`}
          icon={ShieldAlert}
          accent={attentionCount ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Operator queue</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-950">What needs a decision</h2>
            </div>
            <Sparkles className="h-5 w-5 text-blue-500" />
          </div>
          <div className="mt-5 space-y-3">
            {[
              { section: 'moderation' as const, label: 'Pending reports', value: metrics.pendingReports, tone: 'bg-amber-400' },
              { section: 'support' as const, label: 'Open support tickets', value: metrics.openTickets, tone: 'bg-blue-500' },
              { section: 'companies' as const, label: 'Unverified companies', value: data.companies.filter((company) => !company.isVerified).length, tone: 'bg-violet-500' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.section)}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <span className={`h-2 w-2 rounded-full ${item.tone}`} />
                  {item.label}
                </span>
                <span className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-950">
                  {item.value}
                  <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Live activity</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-950">Latest across the platform</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Live</span>
          </div>
          <div className="mt-5 divide-y divide-slate-100">
            {data.activity.length ? data.activity.slice(0, 7).map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-600">
                  <ActivityIcon type={item.type} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{item.detail}</p>
                </div>
                <time className="whitespace-nowrap font-mono text-[10px] text-slate-400">{formatRelative(item.occurredAt)}</time>
              </div>
            )) : (
              <p className="py-8 text-center text-sm text-slate-500">No recent platform activity.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default function AdminDashboard({ data }: { data: AdminDashboardData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signOut } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const requestedSection = searchParams.get('view');
  const activeSection: AdminSection = isAdminSection(requestedSection) ? requestedSection : 'overview';
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = useMemo(() => ({
    people: data.people.filter((person) =>
      [person.name, person.email, person.location || '', ...person.skills]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    ),
    companies: data.companies.filter((company) =>
      [company.name, company.email, company.industry || '', company.location || '', company.plan]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    ),
    jobs: data.jobs.filter((job) =>
      [job.title, job.companyName, job.location, job.status]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    ),
    applications: data.applications.filter((application) =>
      [application.candidateName, application.candidateEmail, application.jobTitle, application.companyName, application.status]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    ),
    reports: data.reports.filter((report) =>
      [report.contentType, report.reason, report.description || '', report.status]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    ),
    tickets: data.tickets.filter((ticket) =>
      [ticket.number, ticket.subject, ticket.customerName, ticket.category, ticket.priority, ticket.status]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    ),
  }), [data, normalizedSearch]);

  const navigate = (section: AdminSection) => {
    router.replace(section === 'overview' ? '/admin' : `/admin?view=${section}`, { scroll: false });
    setMobileNavOpen(false);
    setSearch('');
  };

  const runAction = async (
    resource: string,
    id: string,
    action: string,
    value: string | boolean,
    successMessage: string,
    confirmation?: string
  ) => {
    if (confirmation && !window.confirm(confirmation)) return;
    const key = `${resource}-${id}`;
    setPendingAction(key);
    setNotice(null);

    try {
      const response = await fetch('/api/admin/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource, id, action, value }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'The action could not be completed.');
      setNotice({ tone: 'success', message: successMessage });
      router.refresh();
    } catch (error) {
      setNotice({ tone: 'error', message: error instanceof Error ? error.message : 'The action failed.' });
    } finally {
      setPendingAction(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const sectionMeta = sections.find((section) => section.id === activeSection) || sections[0];
  const sectionIsSearchable = !['overview', 'revenue'].includes(activeSection);
  const sidebar = (
    <div className="flex h-full flex-col bg-[#071426] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
          <Image src="/logo-mark.png" alt="GHL Hire" width={36} height={36} className="h-9 w-9 rounded-xl" />
          <div>
            <p className="font-serif text-lg font-semibold tracking-tight">GHL Hire</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-300">Platform command</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Admin sections">
        {sections.map((section) => {
          const Icon = section.icon;
          const active = section.id === activeSection;
          const badge = section.id === 'moderation'
            ? data.metrics.pendingReports
            : section.id === 'support'
              ? data.metrics.openTickets
              : 0;
          return (
            <button
              key={section.id}
              onClick={() => navigate(section.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                active ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-300 hover:bg-white/7 hover:text-white'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="flex-1">{section.label}</span>
              {badge > 0 && (
                <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${active ? 'bg-amber-100 text-amber-800' : 'bg-amber-400 text-slate-950'}`}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="truncate text-sm font-medium text-white">{data.operator.name}</p>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">{data.operator.email}</p>
          <span className="mt-2 inline-flex rounded-full bg-cyan-300/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-200">
            Full administrator
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f3ee] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">{sidebar}</aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 h-full w-full bg-slate-950/60 backdrop-blur-sm" aria-label="Close admin navigation" onClick={() => setMobileNavOpen(false)} />
          <aside className="relative h-full w-[min(88vw,18rem)] shadow-2xl">
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg bg-white/10 p-2 text-white"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f5f3ee]/90 backdrop-blur-xl">
          <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
              aria-label="Open admin navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 text-sm sm:flex">
              <span className="text-slate-400">Command</span>
              <span className="text-slate-300">/</span>
              <span className="font-medium text-slate-700">{sectionMeta.label}</span>
            </div>
            {sectionIsSearchable ? (
              <div className="relative ml-auto w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${sectionMeta.label.toLowerCase()}...`}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ) : (
              <div className="ml-auto hidden text-right sm:block">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">Snapshot</p>
                <p className="mt-0.5 text-xs font-medium text-slate-600">{formatRelative(data.generatedAt)}</p>
              </div>
            )}
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live data
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {notice && (
            <div
              role="status"
              className={`mb-5 flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                notice.tone === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              <span>{notice.message}</span>
              <button onClick={() => setNotice(null)} className="rounded-lg p-1" aria-label="Dismiss message">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {activeSection === 'overview' && <Overview data={data} onNavigate={navigate} />}

          {activeSection === 'people' && (
            <>
              <SectionHeading eyebrow="Identity & access" title="People" description="Review every job seeker account, staff assignment, sign-in activity, availability, and suspension state." />
              {filtered.people.length ? (
                <TableFrame>
                  <table className="min-w-[920px] w-full text-left">
                    <thead className="bg-slate-50 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                      <tr><th className="px-5 py-3">Person</th><th className="px-5 py-3">Access</th><th className="px-5 py-3">Last sign in</th><th className="px-5 py-3">Availability</th><th className="px-5 py-3 text-right">Management</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.people.map((person) => (
                        <tr key={person.id} className="transition hover:bg-slate-50/70">
                          <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-serif text-sm font-semibold text-white">{person.name.slice(0, 2).toUpperCase()}</div><div><p className="font-medium text-slate-900">{person.name}</p><p className="text-xs text-slate-500">{person.email}</p></div></div></td>
                          <td className="px-5 py-4">{person.staffRole ? <StatusPill status={person.staffRole} /> : <span className="text-sm text-slate-500">Job seeker</span>}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{formatDate(person.lastSignInAt)}</td>
                          <td className="px-5 py-4"><StatusPill status={person.isSuspended ? 'suspended' : person.isAvailable ? 'active' : 'unavailable'} /></td>
                          <td className="px-5 py-4 text-right"><button disabled={pendingAction === `users-${person.userId}`} onClick={() => runAction('users', person.userId, 'set-suspended', !person.isSuspended, person.isSuspended ? `${person.name} can sign in again.` : `${person.name} has been suspended.`, person.isSuspended ? `Restore sign-in access for ${person.name}?` : `Suspend ${person.name}? They will be unable to sign in until restored.`)} className={`rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50 ${person.isSuspended ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' : 'border-rose-200 text-rose-700 hover:bg-rose-50'}`}>{pendingAction === `users-${person.userId}` ? 'Working…' : person.isSuspended ? 'Restore access' : 'Suspend'}</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableFrame>
              ) : <EmptyState label="people" />}
            </>
          )}

          {activeSection === 'companies' && (
            <>
              <SectionHeading eyebrow="Employer network" title="Companies" description="Verify legitimate employers, inspect their account standing, and see which organizations are actively hiring." />
              {filtered.companies.length ? (
                <TableFrame>
                  <table className="min-w-[960px] w-full text-left">
                    <thead className="bg-slate-50 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><tr><th className="px-5 py-3">Company</th><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Hiring</th><th className="px-5 py-3">Standing</th><th className="px-5 py-3 text-right">Verification</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.companies.map((company) => (
                        <tr key={company.id} className="transition hover:bg-slate-50/70">
                          <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Building2 className="h-5 w-5" /></div><div><div className="flex items-center gap-2"><p className="font-medium text-slate-900">{company.name}</p>{company.isVerified && <BadgeCheck className="h-4 w-4 text-blue-600" />}</div><p className="text-xs text-slate-500">{company.email} · {company.industry || 'Industry not set'}</p></div></div></td>
                          <td className="px-5 py-4"><StatusPill status={company.plan} /></td>
                          <td className="px-5 py-4 text-sm text-slate-600">{company.activeJobs} active {company.activeJobs === 1 ? 'job' : 'jobs'}</td>
                          <td className="px-5 py-4"><StatusPill status={company.isSuspended ? 'suspended' : 'active'} /></td>
                          <td className="px-5 py-4 text-right"><button disabled={pendingAction === `companies-${company.id}`} onClick={() => runAction('companies', company.id, 'set-verified', !company.isVerified, company.isVerified ? `${company.name} is no longer verified.` : `${company.name} is now verified.`, company.isVerified ? `Remove the verified badge from ${company.name}?` : undefined)} className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50">{pendingAction === `companies-${company.id}` ? 'Working…' : company.isVerified ? 'Remove badge' : 'Verify company'}</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableFrame>
              ) : <EmptyState label="companies" />}
            </>
          )}

          {activeSection === 'jobs' && (
            <>
              <SectionHeading eyebrow="Marketplace inventory" title="Jobs" description="Monitor every listing, its employer, reach, application volume, and current publication state." />
              {filtered.jobs.length ? (
                <TableFrame>
                  <table className="min-w-[980px] w-full text-left">
                    <thead className="bg-slate-50 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><tr><th className="px-5 py-3">Listing</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Performance</th><th className="px-5 py-3">Published</th><th className="px-5 py-3 text-right">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.jobs.map((job) => (
                        <tr key={job.id} className="transition hover:bg-slate-50/70">
                          <td className="px-5 py-4"><p className="font-medium text-slate-900">{job.title}</p><p className="mt-1 text-xs text-slate-500">{job.companyName}</p></td>
                          <td className="px-5 py-4 text-sm text-slate-600">{job.remote ? 'Remote · ' : ''}{job.location}</td>
                          <td className="px-5 py-4 text-sm text-slate-600"><span className="font-semibold text-slate-900">{job.applications}</span> applications · {job.views} views</td>
                          <td className="px-5 py-4 text-sm text-slate-500">{formatDate(job.createdAt)}</td>
                          <td className="px-5 py-4 text-right"><select aria-label={`Status for ${job.title}`} disabled={pendingAction === `jobs-${job.id}`} value={job.status} onChange={(event) => runAction('jobs', job.id, 'set-status', event.target.value, `${job.title} is now ${event.target.value}.`, ['closed', 'archived'].includes(event.target.value) ? `Change ${job.title} to ${event.target.value}? It will no longer appear as an active opportunity.` : undefined)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400">{jobStatuses.map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}</select></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableFrame>
              ) : <EmptyState label="jobs" />}
            </>
          )}

          {activeSection === 'applications' && (
            <>
              <SectionHeading eyebrow="Hiring pipeline" title="Applications" description="See candidate movement across every employer and intervene when a workflow needs correction." />
              {filtered.applications.length ? (
                <TableFrame>
                  <table className="min-w-[960px] w-full text-left">
                    <thead className="bg-slate-50 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><tr><th className="px-5 py-3">Candidate</th><th className="px-5 py-3">Opportunity</th><th className="px-5 py-3">Employer</th><th className="px-5 py-3">Applied</th><th className="px-5 py-3 text-right">Pipeline stage</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.applications.map((application) => (
                        <tr key={application.id} className="transition hover:bg-slate-50/70">
                          <td className="px-5 py-4"><p className="font-medium text-slate-900">{application.candidateName}</p><p className="text-xs text-slate-500">{application.candidateEmail}</p></td>
                          <td className="px-5 py-4 text-sm font-medium text-slate-700">{application.jobTitle}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{application.companyName}</td>
                          <td className="px-5 py-4 text-sm text-slate-500">{formatDate(application.appliedAt)}</td>
                          <td className="px-5 py-4 text-right"><select aria-label={`Status for ${application.candidateName}`} disabled={pendingAction === `applications-${application.id}`} value={application.status} onChange={(event) => runAction('applications', application.id, 'set-status', event.target.value, `${application.candidateName}'s application is now ${event.target.value}.`, ['rejected', 'accepted', 'withdrawn'].includes(event.target.value) ? `Move this application to ${event.target.value}? This changes the employer's hiring record.` : undefined)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400">{applicationStatuses.map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}</select></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableFrame>
              ) : <EmptyState label="applications" />}
            </>
          )}

          {activeSection === 'revenue' && (
            <>
              <SectionHeading eyebrow="Commercial health" title="Revenue" description="Track subscription run rate and captured payments. Billing records are intentionally read-only here because Whop remains the financial source of truth." />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <MetricCard label="Monthly run rate" value={formatMoney(data.metrics.monthlyRecurringRevenueCents)} detail="Normalized from active monthly and annual subscriptions" icon={CircleDollarSign} accent="bg-emerald-50 text-emerald-700" />
                <MetricCard label="Captured revenue" value={formatMoney(data.metrics.capturedRevenueCents)} detail="All successful USD transactions recorded by the platform" icon={WalletCards} accent="bg-blue-50 text-blue-700" />
                <MetricCard label="Active subscriptions" value={formatNumber(data.metrics.activeSubscriptions)} detail={`${data.subscriptions.filter((subscription) => subscription.status !== 'active').length} subscriptions currently need or completed a state change`} icon={Activity} accent="bg-amber-50 text-amber-700" />
              </div>
              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <section><h2 className="mb-3 font-serif text-xl font-semibold text-slate-950">Subscriptions</h2><TableFrame><table className="min-w-[620px] w-full text-left"><thead className="bg-slate-50 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><tr><th className="px-4 py-3">Company</th><th className="px-4 py-3">Plan</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{data.subscriptions.map((subscription) => <tr key={subscription.id}><td className="px-4 py-4 text-sm font-medium text-slate-800">{subscription.companyName}</td><td className="px-4 py-4"><StatusPill status={subscription.plan} /></td><td className="px-4 py-4 text-sm text-slate-600">{formatMoney(subscription.priceCents, subscription.currency)} / {subscription.interval}</td><td className="px-4 py-4"><StatusPill status={subscription.status} /></td></tr>)}</tbody></table></TableFrame></section>
                <section><h2 className="mb-3 font-serif text-xl font-semibold text-slate-950">Recent transactions</h2><TableFrame><table className="min-w-[620px] w-full text-left"><thead className="bg-slate-50 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><tr><th className="px-4 py-3">Company</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{data.transactions.map((transaction) => <tr key={transaction.id}><td className="px-4 py-4"><p className="text-sm font-medium text-slate-800">{transaction.companyName}</p><p className="max-w-48 truncate text-xs text-slate-500">{transaction.description || 'Subscription payment'}</p></td><td className="px-4 py-4 text-sm font-semibold text-slate-800">{formatMoney(transaction.amountCents, transaction.currency)}</td><td className="px-4 py-4 text-sm text-slate-500">{formatDate(transaction.createdAt)}</td><td className="px-4 py-4"><StatusPill status={transaction.status} /></td></tr>)}</tbody></table></TableFrame></section>
              </div>
            </>
          )}

          {activeSection === 'moderation' && (
            <>
              <SectionHeading eyebrow="Trust & safety" title="Moderation" description="Triage content reports, move them into review, and record a clear final outcome without leaving the admin workspace." />
              {filtered.reports.length ? <div className="grid gap-4 xl:grid-cols-2">{filtered.reports.map((report: AdminReport) => <article key={report.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-40px_rgba(15,23,42,0.6)]"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><div className="rounded-xl bg-amber-50 p-2.5 text-amber-700"><ShieldAlert className="h-5 w-5" /></div><div><p className="font-medium text-slate-900">{titleCase(report.contentType)} report</p><p className="text-xs text-slate-500">{formatDate(report.createdAt)}</p></div></div><StatusPill status={report.status} /></div><div className="mt-4 rounded-xl bg-slate-50 p-4"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">Reason</p><p className="mt-1 text-sm font-semibold text-slate-800">{titleCase(report.reason)}</p><p className="mt-2 text-sm leading-6 text-slate-600">{report.description || 'The reporter did not provide additional context.'}</p></div><div className="mt-4 flex flex-wrap justify-end gap-2">{report.status === 'pending' && <button disabled={pendingAction === `reports-${report.id}`} onClick={() => runAction('reports', report.id, 'set-status', 'reviewing', 'Report moved into review.')} className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">Start review</button>}{!['resolved', 'dismissed'].includes(report.status) && <><button disabled={pendingAction === `reports-${report.id}`} onClick={() => runAction('reports', report.id, 'set-status', 'dismissed', 'Report dismissed.', 'Dismiss this report as not actionable?')} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Dismiss</button><button disabled={pendingAction === `reports-${report.id}`} onClick={() => runAction('reports', report.id, 'set-status', 'resolved', 'Report resolved.', 'Resolve this report and mark the case complete?')} className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">Resolve</button></>}</div></article>)}</div> : <EmptyState label="reports" />}
            </>
          )}

          {activeSection === 'support' && (
            <>
              <SectionHeading eyebrow="Customer operations" title="Support" description="Prioritize urgent customer issues, see who needs help, and move tickets through the support workflow." />
              {filtered.tickets.length ? <div className="grid gap-4 xl:grid-cols-2">{filtered.tickets.map((ticket: AdminTicket) => <article key={ticket.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">{ticket.number}</span><StatusPill status={ticket.priority} /></div><h2 className="mt-2 font-serif text-xl font-semibold text-slate-950">{ticket.subject}</h2><p className="mt-1 text-sm text-slate-500">{ticket.customerName} · {titleCase(ticket.category)} · {formatDate(ticket.createdAt)}</p></div><LifeBuoy className="h-5 w-5 text-slate-400" /></div><div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4"><StatusPill status={ticket.status} /><select aria-label={`Status for ${ticket.number}`} disabled={pendingAction === `tickets-${ticket.id}`} value={ticket.status} onChange={(event) => runAction('tickets', ticket.id, 'set-status', event.target.value, `${ticket.number} is now ${titleCase(event.target.value)}.`, ['resolved', 'closed'].includes(event.target.value) ? `Mark ${ticket.number} as ${event.target.value}?` : undefined)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400">{ticketStatuses.map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}</select></div></article>)}</div> : <EmptyState label="support tickets" />}
            </>
          )}
        </main>

        <footer className="border-t border-slate-200 px-4 py-5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400 sm:px-6 lg:px-8">
          Snapshot generated {formatRelative(data.generatedAt)} · Up to 75 recent records per management table
        </footer>
      </div>
    </div>
  );
}
