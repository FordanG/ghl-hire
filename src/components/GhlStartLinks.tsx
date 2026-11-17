import { AFFILIATE_NOTE, GHL_BOOTCAMP_URL, GHL_TRIAL_URL } from '@/lib/site';

interface GhlStartLinksProps {
  /** 'section' is the full-width homepage block; 'card' fits sidebars and articles. */
  variant?: 'section' | 'card';
}

const offers = [
  {
    title: 'Try HighLevel free for 14 days',
    text: 'Get your own account to build in. The quickest way to learn the platform employers hire for.',
    cta: 'Start the free trial',
    href: GHL_TRIAL_URL,
  },
  {
    title: 'Join the free HighLevel Bootcamp',
    text: 'A live Zoom class, every weekday, where a HighLevel coach walks you through your first launch click by click. Comes with a 30-day trial.',
    cta: 'Join the Bootcamp',
    href: GHL_BOOTCAMP_URL,
  },
];

export default function GhlStartLinks({ variant = 'section' }: GhlStartLinksProps) {
  if (variant === 'card') {
    return (
      <aside className="rounded-xl border border-rule p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink">New to HighLevel?</h2>
        <ul className="mt-3 divide-y divide-rule">
          {offers.map((offer) => (
            <li key={offer.href} className="py-3 first:pt-0 last:pb-0">
              <p className="text-[15px] leading-relaxed text-ink-soft">{offer.text}</p>
              <a
                href={offer.href}
                target="_blank"
                rel="sponsored noopener"
                className="mt-1 inline-flex min-h-[44px] items-center text-[15px] font-semibold text-brand hover:underline"
              >
                {offer.cta}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-mute">{AFFILIATE_NOTE}</p>
      </aside>
    );
  }

  return (
    <section className="border-t border-rule bg-surface" aria-labelledby="ghl-start-heading">
      <div className="page-wrap py-16 md:py-20">
        <h2 id="ghl-start-heading" className="display max-w-2xl text-3xl font-semibold md:text-[2.5rem]">
          New to HighLevel? Start here.
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          Every role on this board asks for hands-on HighLevel experience. These are two free ways to get it.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {offers.map((offer) => (
            <div key={offer.href} className="flex flex-col rounded-xl border border-rule bg-white p-6 sm:p-8">
              <h3 className="text-xl font-semibold tracking-tight text-ink">{offer.title}</h3>
              <p className="mt-2 flex-1 text-[17px] leading-relaxed text-ink-soft">{offer.text}</p>
              <a
                href={offer.href}
                target="_blank"
                rel="sponsored noopener"
                className="press mt-6 inline-flex h-12 items-center self-start rounded-md bg-ink px-5 text-base font-semibold text-white transition-colors hover:bg-ink-2"
              >
                {offer.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-mute">{AFFILIATE_NOTE}</p>
      </div>
    </section>
  );
}
