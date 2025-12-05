import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center md:justify-between text-gray-500 border-t border-gray-200 mt-6 bg-white gap-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold tracking-tight text-gray-900">
          GHL<span className="font-light text-blue-400">Hire</span>
        </span>
        <span className="ml-4 text-xs">© 2025</span>
      </div>

      {/* Links with proper touch target size (min 44px height) */}
      <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-4" aria-label="Footer navigation">
        <Link
          href="/privacy"
          className="px-3 py-2 min-h-[44px] flex items-center transition-colors hover:text-gray-900 rounded-md hover:bg-gray-50"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="px-3 py-2 min-h-[44px] flex items-center transition-colors hover:text-gray-900 rounded-md hover:bg-gray-50"
        >
          Terms
        </Link>
        <Link
          href="/contact"
          className="px-3 py-2 min-h-[44px] flex items-center transition-colors hover:text-gray-900 rounded-md hover:bg-gray-50"
        >
          Contact
        </Link>
      </nav>
    </footer>
  );
}