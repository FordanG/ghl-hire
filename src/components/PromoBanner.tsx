import { SUPER_CLONER_URL } from '@/lib/site';

/**
 * Site-wide Super Cloner strip. Always visible: the board exists to send
 * GoHighLevel builders to Super Cloner, so it is not dismissible.
 */
export default function PromoBanner() {
  return (
    <div className="bg-ink text-white">
      <p className="page-wrap py-2 text-center text-sm">
        <span className="text-slate-300">Rebuilding a funnel by hand?</span>{' '}
        <a
          href={SUPER_CLONER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline min-h-0 min-w-0 font-semibold text-white underline decoration-gold decoration-2 underline-offset-4 hover:text-gold"
        >
          Clone it in one click with Super Cloner
        </a>
      </p>
    </div>
  );
}
