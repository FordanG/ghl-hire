import Link from 'next/link';
import Image from 'next/image';
import { AFFILIATE_NOTE, CONTACT_EMAIL, GHL_BOOTCAMP_URL, GHL_TRIAL_URL, SUPER_CLONER_URL } from '@/lib/site';

const linkClass =
  'inline-flex min-h-[40px] items-center text-[15px] text-slate-300 transition-colors hover:text-white outline-none focus-visible:underline';

const columns = [
  {
    title: 'Job seekers',
    links: [
      { href: '/jobs', label: 'Browse jobs' },
      { href: '/jobs?remote=1', label: 'Remote jobs' },
      { href: '/blog', label: 'AI guides' },
      { href: '/signup', label: 'Create a profile' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { href: '/post-job', label: 'Post a job free' },
      { href: '/employers', label: 'How it works' },
      { href: '/featured', label: 'Featured listings' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="field-ink mt-auto text-white">
      <div className="page-wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Image src="/logo-mark.png" alt="" width={28} height={28} className="h-7 w-7" />
            <span>
              GHL<span className="font-normal text-blue-300">Hire</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-slate-300">
            The free job board for GoHighLevel work. Free to post, free to apply.
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold text-white">{column.title}</h2>
            <ul className="mt-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav aria-label="HighLevel tools">
          <h2 className="text-sm font-semibold text-white">HighLevel tools</h2>
          <ul className="mt-3">
            <li>
              <a href={SUPER_CLONER_URL} target="_blank" rel="sponsored noopener" className={linkClass}>
                Super Cloner funnel cloner
              </a>
            </li>
            <li>
              <a href={GHL_TRIAL_URL} target="_blank" rel="sponsored noopener" className={linkClass}>
                HighLevel 14-day free trial
              </a>
            </li>
            <li>
              <a href={GHL_BOOTCAMP_URL} target="_blank" rel="sponsored noopener" className={linkClass}>
                Free HighLevel Bootcamp
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="page-wrap flex flex-col gap-2 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 GHL Hire. Not affiliated with HighLevel Inc. {AFFILIATE_NOTE}</p>
          <nav className="flex gap-5" aria-label="Legal">
            <Link href="/privacy" className="inline-flex min-h-[40px] items-center hover:text-white">Privacy</Link>
            <Link href="/terms" className="inline-flex min-h-[40px] items-center hover:text-white">Terms</Link>
            <Link href="/help" className="inline-flex min-h-[40px] items-center hover:text-white">Help</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
