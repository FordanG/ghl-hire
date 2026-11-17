import { monogram } from '@/lib/jobs';

interface CompanyMarkProps {
  name: string;
  logoUrl?: string | null;
  featured?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Brand-safe tones so a list of monograms does not read as one stamp.
const TONES = ['bg-ink text-white', 'bg-brand text-white', 'bg-[#1c4a8a] text-white', 'bg-[#33527d] text-white', 'bg-[#0f6e8c] text-white'];

function toneFor(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length];
}

const SIZE = {
  sm: 'h-10 w-10 text-[13px]',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-lg',
};

/**
 * Company logo, or a monogram set in the hexagon from the GHL Hire mark.
 */
export default function CompanyMark({ name, logoUrl, featured = false, size = 'md' }: CompanyMarkProps) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt=""
        loading="lazy"
        className={`${SIZE[size]} shrink-0 rounded-md border border-rule bg-white object-contain`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`hex ${SIZE[size]} inline-flex shrink-0 items-center justify-center font-semibold tracking-tight ${
        featured ? 'bg-gold text-ink' : toneFor(name)
      }`}
    >
      {monogram(name)}
    </span>
  );
}
