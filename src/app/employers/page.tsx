import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SuperClonerPanel from '@/components/SuperClonerPanel';
import { FEATURED_EMAIL, featuredMailto } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Hire GoHighLevel talent: post a job free',
  description:
    'Post GoHighLevel jobs for free on GHL Hire. Reach automation specialists, funnel builders, Voice AI builders and VAs. Featured listings available by email.',
  alternates: { canonical: 'https://ghlhire.com/employers' },
  openGraph: {
    title: 'Hire GoHighLevel talent: post a job free | GHL Hire',
    description: 'Free job posts for agencies and SaaS teams hiring GoHighLevel specialists.',
    type: 'website',
    url: 'https://ghlhire.com/employers',
  },
};

const included = [
  ['Unlimited free listings', 'Post as many roles as you are hiring for. No card and no plan to pick.'],
  ['Applications in one place', 'Candidates apply with a profile and resume. Review, shortlist and update each one from your dashboard.'],
  ['Or use your own apply link', 'Already take applications on your site or ATS? Add the link and we send candidates there.'],
  ['Views and applications per role', 'See how many people opened each listing and how many applied.'],
];

const faqs = [
  ['Is it really free to post?', 'Yes. Creating an employer account and publishing listings costs nothing. The only paid option is a featured listing.'],
  ['What is a featured listing?', 'A listing pinned above the free ones on the jobs page and the homepage, marked Featured in gold. It is arranged by email and switched on by our team.'],
  ['How much does featuring cost?', `Email ${FEATURED_EMAIL} with the role you want to feature and we will reply with the current rate and available dates.`],
  ['Who sees my listing?', 'People looking for GoHighLevel work: automation specialists, funnel builders, Voice AI builders, virtual assistants, account managers and developers.'],
  ['How long does a listing stay up?', 'Until you close it. Please close roles once they are filled so the board stays accurate.'],
];

export default function EmployersPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <main>
        <section className="field-ink text-white">
          <div className="page-wrap py-16 md:py-24">
            <h1 className="display max-w-3xl text-[2.6rem] font-semibold sm:text-6xl">
              Hire people who already know GoHighLevel. Posting is free.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              GHL Hire is a job board for one platform. It is written for people who work in HighLevel, so you skip the part where you explain what a snapshot is.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/post-job" className="press inline-flex h-12 items-center rounded-md bg-brand px-6 text-base font-semibold text-white hover:bg-brand-dark">
                Post a job free
              </Link>
              <Link href="/featured" className="press inline-flex h-12 items-center rounded-md border border-white/30 px-6 text-base font-semibold text-white hover:bg-white/10">
                Featured listings
              </Link>
            </div>
          </div>
        </section>

        <section className="page-wrap py-16 md:py-24" aria-labelledby="included-heading">
          <h2 id="included-heading" className="display max-w-2xl text-3xl font-semibold md:text-[2.5rem]">
            What a free listing includes
          </h2>
          <dl className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {included.map(([title, text]) => (
              <div key={title} className="border-t-2 border-ink pt-4">
                <dt className="text-lg font-semibold text-ink">{title}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink-soft">{text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <SuperClonerPanel />

        <section className="border-b border-rule bg-surface" aria-labelledby="featured-heading">
          <div className="page-wrap grid gap-10 py-16 md:grid-cols-2 md:items-center md:gap-16 md:py-20">
            <div>
              <h2 id="featured-heading" className="display text-3xl font-semibold md:text-[2.5rem]">
                Need more eyes on a role? Feature it.
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-soft">
                Featured listings are pinned to the top of the board and the homepage. It is the one paid option, and it is arranged by email so you talk to a person.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={featuredMailto()} className="press inline-flex h-12 items-center rounded-md bg-ink px-6 text-base font-semibold text-white hover:bg-ink-2">
                  Email {FEATURED_EMAIL}
                </a>
                <Link href="/featured" className="press inline-flex h-12 items-center rounded-md border border-rule bg-white px-6 text-base font-semibold text-ink hover:bg-brand-soft">
                  How it works
                </Link>
              </div>
            </div>

            <div aria-hidden="true" className="overflow-hidden rounded-xl border border-rule bg-white">
              <div className="relative bg-gold-soft px-5 py-4">
                <span className="absolute inset-y-0 left-0 w-1 bg-gold" />
                <p className="flex items-center gap-2 font-semibold text-ink">
                  Your role
                  <span className="rounded-sm bg-gold px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">Featured</span>
                </p>
                <p className="text-sm text-ink-soft">Your company · Remote</p>
              </div>
              {[0, 1, 2].map((row) => (
                <div key={row} className="border-t border-rule px-5 py-4">
                  <div className="h-3 w-2/5 rounded bg-slate-200" />
                  <div className="mt-2 h-2.5 w-1/4 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-wrap py-16 md:py-24" aria-labelledby="faq-heading">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <h2 id="faq-heading" className="display text-3xl font-semibold md:text-[2.5rem]">Questions employers ask</h2>
            <dl className="divide-y divide-rule border-y border-rule">
              {faqs.map(([q, a]) => (
                <div key={q} className="py-5">
                  <dt className="text-lg font-semibold text-ink">{q}</dt>
                  <dd className="mt-1.5 leading-relaxed text-ink-soft">{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
