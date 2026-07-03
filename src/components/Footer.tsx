import Link from 'next/link';
import Image from 'next/image';

const footerLinkClass =
  'px-3 py-2 min-h-[44px] flex items-center rounded-md text-gray-500 transition-colors hover:text-gray-900 hover:bg-gray-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 press';

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center md:justify-between text-gray-500 border-t border-gray-200 mt-6 bg-white gap-4">
      <div className="flex items-center gap-2">
        <Image
          src="/logo-mark.png"
          alt=""
          width={24}
          height={24}
          className="h-6 w-6"
        />
        <span className="text-lg font-semibold tracking-tight text-gray-900">
          GHL<span className="font-light text-blue-400">Hire</span>
        </span>
        <span className="ml-3 text-xs text-gray-400">© 2025</span>
      </div>

      {/* Links with proper touch target size (min 44px height) */}
      <nav
        className="flex flex-wrap items-center justify-center gap-1 sm:gap-2"
        aria-label="Footer navigation"
      >
        <Link href="/privacy" className={footerLinkClass}>
          Privacy Policy
        </Link>
        <Link href="/terms" className={footerLinkClass}>
          Terms
        </Link>
        <Link href="/contact" className={footerLinkClass}>
          Contact
        </Link>
      </nav>
    </footer>
  );
}
