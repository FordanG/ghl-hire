import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center md:justify-between text-gray-500 border-t border-gray-200 mt-6 bg-white">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold tracking-tight text-gray-900">
          GHL<span className="font-light text-blue-400">Hire</span>
        </span>
        <span className="ml-4 text-xs">© 2024</span>
      </div>
      
      <div className="flex items-center gap-6 mt-4 md:mt-0">
        <Link href="/privacy" className="transition-colors hover:text-gray-900">
          Privacy Policy
        </Link>
        <Link href="/terms" className="transition-colors hover:text-gray-900">
          Terms
        </Link>
        <Link href="/contact" className="transition-colors hover:text-gray-900">
          Contact
        </Link>
      </div>
    </footer>
  );
}