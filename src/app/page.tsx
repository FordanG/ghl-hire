import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobRow from '@/components/JobRow';
import ArticleCard from '@/components/articles/ArticleCard';
import SubscribeForm from '@/components/SubscribeForm';
import SuperClonerPanel from '@/components/SuperClonerPanel';
import { articles } from '@/content/articles';
import { BOARD_JOB_SELECT, type BoardJob } from '@/lib/jobs';
import { FEATURED_EMAIL, featuredMailto } from '@/lib/site';
import { createPublicClient } from '@/lib/supabase/public';

// The board is public data: cache the page and refresh it every five minutes.
export const revalidate = 300;

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GHL Hire',
  description: 'The free job board for GoHighLevel professionals and the agencies that hire them.',
  url: 'https://ghlhire.com',
  logo: 'https://ghlhire.com/icon.png',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: FEATURED_EMAIL,
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GHL Hire',
  url: 'https://ghlhire.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://ghlhire.com/jobs?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const quickSearches = [
  { label: 'Remote', href: '/jobs?remote=1' },
  { label: 'Automation', href: '/jobs?q=automation' },
  { label: 'Voice AI', href: '/jobs?q=voice+ai' },
  { label: 'Funnel builder', href: '/jobs?q=funnel' },
  { label: 'Virtual assistant', href: '/jobs?q=assistant' },
  { label: 'Developer', href: '/jobs?q=developer' },
];

async function getBoard(): Promise<{ jobs: BoardJob[]; total: number }> {
  try {
    const supabase = createPublicClient();
    const { data, count, error } = await supabase
      .from('jobs')
      .select(BOARD_JOB_SELECT, { count: 'exact' })
      .eq('status', 'active')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) throw error;
    return { jobs: (data ?? []) as unknown as BoardJob[], total: count ?? 0 };
  } catch (error) {
    console.error('Error loading the board:', error);
    return { jobs: [], total: 0 };
  }
}

export default async function Home() {
  const { jobs, total } = await getBoard();
  const guides = articles.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      <Header />

      <main>
        {/* Hero: the board itself is the first thing on the page */}
        <section className="field-ink text-white">
          <div className="page-wrap pt-12 pb-44 md:pt-20 md:pb-52">
            <h1 className="display max-w-4xl text-[2.6rem] font-semibold sm:text-6xl 2xl:text-7xl">
              GoHighLevel jobs. Free to post, free to apply.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              The job board for people who build in HighLevel: automation specialists, funnel builders, Voice AI builders, VAs and developers, and the agencies hiring them.
            </p>

            <form action="/jobs" method="get" role="search" className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <label htmlFor="hero-search" className="sr-only">Search jobs</label>
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="Role, skill or company"
                className="h-14 w-full min-w-0 shrink-0 rounded-md sm:flex-1 sm:shrink border border-transparent bg-white px-4 text-base text-ink outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-gold"
              />
              <button type="submit" className="press h-14 shrink-0 rounded-md bg-brand px-7 text-base font-semibold text-white transition-colors hover:bg-brand-dark">
                Search jobs
              </button>
            </form>

            <ul className="mt-5 flex flex-wrap gap-2 text-[15px]">
              {quickSearches.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex h-11 min-w-0 items-center rounded-md border border-white/20 px-3.5 text-slate-200 transition-colors hover:border-white/60 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="page-wrap relative z-10 -mt-32 md:-mt-36" aria-labelledby="board-heading">
          <div className="overflow-hidden rounded-xl border border-rule bg-white shadow-[0_24px_60px_-28px_rgba(11,31,58,0.45)]">
            <div className="flex items-center justify-between gap-4 border-b border-rule px-4 py-4 sm:px-6">
              <h2 id="board-heading" className="text-lg font-semibold tracking-tight">
                Latest roles
                {total > 0 && <span className="ml-2 font-normal text-mute">{total} open</span>}
              </h2>
              <Link href="/jobs" className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-brand hover:underline">
                View all jobs
              </Link>
            </div>

            {jobs.length > 0 ? (
              <ul className="divide-y divide-rule">
                {jobs.map((job) => (
                  <JobRow key={job.id} job={job} compact />
                ))}
              </ul>
            ) : (
              <div className="px-6 py-14 text-center">
                <p className="text-lg font-semibold">No open roles right now</p>
                <p className="mt-1 text-ink-soft">Hiring for GoHighLevel work? Yours can be the first.</p>
                <Link href="/post-job" className="press mt-5 inline-flex h-12 items-center rounded-md bg-brand px-5 font-semibold text-white hover:bg-brand-dark">
                  Post a job free
                </Link>
              </div>
            )}

            {total > jobs.length && (
              <div className="border-t border-rule bg-surface px-4 py-3 text-center sm:px-6">
                <Link href="/jobs" className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-ink hover:text-brand">
                  See all {total} open roles
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Email capture */}
        <section id="subscribe" className="mt-16 scroll-mt-20 border-y border-rule bg-surface md:mt-20" aria-labelledby="subscribe-heading">
          <div className="page-wrap grid gap-8 py-12 md:grid-cols-2 md:items-center md:gap-16 md:py-14">
            <div>
              <h2 id="subscribe-heading" className="display text-3xl font-semibold md:text-4xl">
                New GHL roles in your inbox every week
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
                One short email: the roles added this week and the newest guide. Nothing else.
              </p>
            </div>
            <SubscribeForm source="home" />
          </div>
        </section>

        {/* Employers */}
        <section className="page-wrap py-16 md:py-24" aria-labelledby="employers-heading">
          <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
            <div>
              <h2 id="employers-heading" className="display text-3xl font-semibold md:text-[2.75rem]">
                Hiring? Posting a job costs nothing.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                No plans, no credits, no card. Write the role, publish it, and applications arrive in your dashboard. If you already take applications on your own site, add the link and we send people there.
              </p>
              <ol className="mt-8 space-y-5">
                {[
                  ['Create a free employer account', 'One minute, email and company name.'],
                  ['Write the role', 'Title, what the work is, pay if you can share it.'],
                  ['Publish', 'It goes live on the board straight away.'],
                ].map(([title, text], index) => (
                  <li key={title} className="flex gap-4">
                    <span aria-hidden="true" className="hex flex h-9 w-9 shrink-0 items-center justify-center bg-ink text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{title}</p>
                      <p className="text-[15px] text-ink-soft">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/post-job" className="press inline-flex h-12 items-center rounded-md bg-brand px-6 text-base font-semibold text-white hover:bg-brand-dark">
                  Post a job free
                </Link>
                <Link href="/employers" className="press inline-flex h-12 items-center rounded-md border border-rule px-6 text-base font-semibold text-ink hover:bg-surface">
                  How it works
                </Link>
              </div>
            </div>

            <div className="self-start rounded-xl border border-rule">
              <div className="relative overflow-hidden rounded-t-xl bg-gold-soft px-6 py-5">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gold" />
                <p className="flex items-center gap-2 text-[17px] font-semibold text-ink">
                  Your role here
                  <span className="rounded-sm bg-gold px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">Featured</span>
                </p>
                <p className="text-[15px] text-ink-soft">Pinned above every free listing</p>
              </div>
              <div className="px-6 py-6">
                <h3 className="text-xl font-semibold tracking-tight">Want the top of the board?</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  Featured listings are the only paid thing on GHL Hire. Your role is pinned to the top of the board and the homepage, with the gold marker. Email us and we set it up.
                </p>
                <a href={featuredMailto()} className="press mt-5 inline-flex h-12 items-center rounded-md bg-ink px-5 text-base font-semibold text-white hover:bg-ink-2">
                  Email {FEATURED_EMAIL}
                </a>
                <p className="mt-3 text-sm text-mute">
                  <Link href="/featured" className="min-h-0 underline underline-offset-2 hover:text-ink">How featured listings work</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        <SuperClonerPanel />

        {/* Guides */}
        <section className="page-wrap py-20 md:py-28" aria-labelledby="guides-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="guides-heading" className="display text-3xl font-semibold md:text-[2.75rem]">Get ahead in the AI world</h2>
              <p className="mt-3 max-w-xl text-lg text-ink-soft">
                What to learn, build and sell now that AI sits inside HighLevel.
              </p>
            </div>
            <Link href="/blog" className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-brand hover:underline">
              All guides
            </Link>
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
