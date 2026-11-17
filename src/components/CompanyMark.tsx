import { monogram } from '@/lib/jobs';

interface CompanyMarkProps {
  name: string;
  logoUrl?: string | null;
  featured?: boolean;
  size?: 'sm' | 'md' | 'lg';
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
        featured ? 'bg-gold text-ink' : 'bg-ink text-white'
      }`}
    >
      {monogram(name)}
    </span>
  );
}
