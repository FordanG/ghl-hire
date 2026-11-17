import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedRequestForm from '@/components/FeaturedRequestForm';
import { FEATURED_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Featured job listings',
  description:
    'Posting a job on GHL Hire is free. Featured listings are pinned to the top of the board. Send a request and we email you a payment link.',
  alternates: { canonical: 'https://ghlhire.com/featured' },
};

const steps = [
  ['Post your job', 'Publish the role for free first, so there is a listing to feature.'],
  ['Send the request', 'Tell us which role and when you want it to start.'],
  ['Pay the link we email you', 'We reply with the rate and a payment link. Payment is through Wise for now, while we set up more payment methods.'],
  ['Your role goes to the top', 'We switch featuring on. The listing is pinned above the free ones and marked Featured.'],
];

export default function FeaturedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Header />

      <main>
        <section className="field-ink text-white">
          <div className="page-wrap py-16 md:py-24">
            <h1 className="display max-w-3xl text-[2.6rem] font-semibold sm:text-6xl">
              Posting is free. Featuring puts you first.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              A featured listing is pinned to the top of the jobs page and the homepage, with a gold marker so it stands apart from the free listings below it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#request" className="press inline-flex h-12 items-center rounded-md bg-gold px-6 text-base font-semibold text-ink hover:bg-white">
                Request a featured listing
              </a>
              <Link href="/post-job" className="press inline-flex h-12 items-center rounded-md border border-white/30 px-6 text-base font-semibold text-white hover:bg-white/10">
                Post a job free
              </Link>
            </div>
          </div>
        </section>

        <section className="page-wrap py-16 md:py-24" aria-labelledby="compare-heading">
          <h2 id="compare-heading" className="display text-3xl font-semibold md:text-[2.5rem]">Free and featured, side by side</h2>
          <div className="mt-8 overflow-x-auto rounded-xl border border-rule">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="bg-surface text-[15px]">
                  <th scope="col" className="px-5 py-4 font-semibold"><span className="sr-only">What you get</span></th>
                  <th scope="col" className="px-5 py-4 font-semibold">Free listing</th>
                  <th scope="col" className="bg-gold-soft px-5 py-4 font-semibold">Featured listing</th>
                </tr>
              </thead>
              <tbody className="text-[15px]">
                {[
                  ['Price', '$0', 'Sent with your payment link'],
                  ['Shown on the jobs page', 'Yes, newest first', 'Pinned above free listings'],
                  ['Shown on the homepage', 'While it is among the newest', 'Pinned at the top'],
                  ['Featured marker', 'No', 'Yes, in gold'],
                  ['Applications and tracking', 'Included', 'Included'],
                  ['How to get it', 'Publish from your dashboard', 'Send the request below'],
                ].map(([label, free, featured]) => (
                  <tr key={label} className="border-t border-rule">
                    <th scope="row" className="px-5 py-4 font-medium text-ink">{label}</th>
                    <td className="px-5 py-4 text-ink-soft">{free}</td>
                    <td className="bg-gold-soft/60 px-5 py-4 font-medium text-ink">{featured}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="request" className="scroll-mt-20 border-t border-rule bg-surface" aria-labelledby="steps-heading">
          <div className="page-wrap grid gap-10 py-16 md:grid-cols-[1fr_1.3fr] md:gap-16 md:py-20">
            <div>
              <h2 id="steps-heading" className="display text-3xl font-semibold md:text-[2.5rem]">Request a featured listing</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                There is no checkout on the site yet. Send the request and we email you a payment link.
              </p>
              <ol className="mt-8 space-y-5">
                {steps.map(([title, text], index) => (
                  <li key={title} className="flex gap-4">
                    <span aria-hidden="true" className="hex flex h-9 w-9 shrink-0 items-center justify-center bg-gold text-sm font-semibold text-ink">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{title}</p>
                      <p className="text-[15px] text-ink-soft">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-8 text-[15px] text-ink-soft">
                Prefer email? Write to{' '}
                <a href={`mailto:${FEATURED_EMAIL}`} className="inline min-h-0 min-w-0 font-semibold text-brand underline underline-offset-2">
                  {FEATURED_EMAIL}
                </a>
                .
              </p>
            </div>
            <FeaturedRequestForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
