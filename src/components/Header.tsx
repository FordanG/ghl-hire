import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-2xl font-semibold tracking-tight fade-in fade-in-1 text-gray-900">
            GHL<span className="font-light text-blue-400">Hire</span>
          </Link>
          <span className="ml-4 px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-500 font-medium tracking-tight fade-in fade-in-2">
            GoHighLevel
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <Link 
            href="/jobs" 
            className="text-gray-500 px-2 py-1 transition-colors fade-in fade-in-3 hover:text-gray-900 hover:underline"
          >
            Jobs
          </Link>
          <Link 
            href="/employers" 
            className="text-gray-500 px-2 py-1 transition-colors fade-in fade-in-4 hover:text-gray-900 hover:underline"
          >
            Employers
          </Link>
          <Link 
            href="/resources" 
            className="text-gray-500 px-2 py-1 transition-colors fade-in fade-in-5 hover:text-gray-900 hover:underline"
          >
            Resources
          </Link>
          <Link 
            href="/signin" 
            className="text-gray-500 px-2 py-1 transition-colors fade-in fade-in-6 hover:text-gray-900 hover:underline"
          >
            Sign In
          </Link>
        </nav>
        
        <Link 
          href="/post-job" 
          className="ml-6 px-4 py-2 rounded-md bg-blue-500 font-semibold tracking-tight shadow hover:bg-blue-600 transition-colors fade-in fade-in-6 text-white"
        >
          Post a Job
        </Link>
      </div>
    </header>
  );
}