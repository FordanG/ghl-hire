import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="fade-in fade-in-1">
            <div className="text-6xl font-bold text-blue-500 mb-4">404</div>
            <h1 className="text-3xl font-semibold mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="space-y-4 fade-in fade-in-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            
            <div className="text-center">
              <Link 
                href="/jobs" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-medium"
              >
                <Search className="w-4 h-4" />
                Browse Jobs
              </Link>
            </div>
          </div>

          <div className="mt-12 fade-in fade-in-3">
            <h3 className="font-semibold mb-4">Popular Pages</h3>
            <div className="space-y-2">
              <Link href="/jobs" className="block text-blue-600 hover:text-blue-500 transition-colors">
                Job Listings
              </Link>
              <Link href="/employers" className="block text-blue-600 hover:text-blue-500 transition-colors">
                For Employers
              </Link>
              <Link href="/resources" className="block text-blue-600 hover:text-blue-500 transition-colors">
                Resources
              </Link>
              <Link href="/contact" className="block text-blue-600 hover:text-blue-500 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}