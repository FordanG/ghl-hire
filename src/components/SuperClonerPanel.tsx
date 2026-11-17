import { SUPER_CLONER_URL } from '@/lib/site';

interface SuperClonerPanelProps {
  /** 'band' is the full-width homepage section; 'card' sits inside articles and sidebars. */
  variant?: 'band' | 'card';
  /** Card only: a line that fits the page it sits on. */
  title?: string;
}

const pages = ['Opt-in page', 'Sales page', 'Order form', 'Upsell', 'Thank-you page'];

/** A small drawing of what the product does: pages copied from one side to the other. */
function CloneDiagram() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 sm:gap-5" aria-hidden="true">
      <div className="min-w-0">
        <p className="mb-2 truncate text-xs font-medium text-slate-400">Any GHL funnel</p>
        <ul className="space-y-1.5">
          {pages.map((page) => (
            <li key={page} className="truncate rounded border border-white/15 bg-white/5 px-2.5 py-2 text-[13px] text-slate-200 sm:px-3 sm:text-sm">
              {page}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="hex flex h-11 w-11 items-center justify-center bg-gold text-xs font-semibold text-ink">1</span>
        <span className="text-xs text-slate-400">click</span>
      </div>
      <div className="min-w-0">
        <p className="mb-2 truncate text-xs font-medium text-slate-400">Your account</p>
        <ul className="space-y-1.5">
          {pages.map((page) => (
            <li key={page} className="flex items-center justify-between rounded border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-2 text-[13px] text-white sm:px-3 sm:text-sm">
              <span className="truncate">{page}</span>
              <span className="ml-2 hidden text-xs text-emerald-300 sm:inline">cloned</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SuperClonerPanel({
  variant = 'band',
  title = 'Rebuilding a funnel by hand? Clone it in one click.',
}: SuperClonerPanelProps) {
  if (variant === 'card') {
    return (
      <aside className="field-ink rounded-xl p-6 text-white sm:p-7">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-300">
          Super Cloner copies a whole GoHighLevel funnel into your own builder, fully editable. From $20, no subscription.
        </p>
        <a
          href={SUPER_CLONER_URL}
          target="_blank"
          rel="sponsored noopener"
          className="press mt-5 inline-flex h-11 items-center rounded-md bg-gold px-5 text-[15px] font-semibold text-ink transition-colors hover:bg-white"
        >
          Try Super Cloner
        </a>
      </aside>
    );
  }

  return (
    <section className="field-ink text-white" aria-labelledby="super-cloner-heading">
      <div className="page-wrap grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:py-24">
        <div>
          <h2 id="super-cloner-heading" className="display text-3xl font-semibold md:text-[2.75rem]">
            Clone an entire GoHighLevel funnel in one click
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
            Super Cloner is a Chrome extension that copies any GHL funnel or website you can open and pastes it into your own builder. Every page arrives fully editable, so a rebuild that takes days is done before your coffee is.
          </p>
          <ul className="mt-6 grid max-w-xl gap-x-6 gap-y-2 text-[15px] text-slate-200 sm:grid-cols-3">
            <li>Starts at $20</li>
            <li>No subscription</li>
            <li>Credits never expire</li>
          </ul>
          <a
            href={SUPER_CLONER_URL}
            target="_blank"
            rel="sponsored noopener"
            className="press mt-8 inline-flex h-12 items-center rounded-md bg-gold px-6 text-base font-semibold text-ink transition-colors hover:bg-white"
          >
            Try Super Cloner
          </a>
        </div>
        <div className="hidden rounded-xl border border-white/10 bg-white/[0.04] p-7 sm:block">
          <CloneDiagram />
        </div>
      </div>
    </section>
  );
}
