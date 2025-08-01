'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  BarChart3,
  CreditCard,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/company/dashboard', icon: LayoutDashboard },
  { name: 'Job Postings', href: '/company/dashboard/jobs', icon: Briefcase },
  { name: 'Applications', href: '/company/dashboard/applications', icon: Users },
  { name: 'Company Profile', href: '/company/dashboard/profile', icon: Building2 },
  { name: 'Analytics', href: '/company/dashboard/analytics', icon: BarChart3 },
  { name: 'Billing', href: '/company/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/company/dashboard/settings', icon: Settings },
];

interface CompanyDashboardLayoutProps {
  children: React.ReactNode;
}

export default function CompanyDashboardLayout({ children }: CompanyDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
             onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GHL</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Hire</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Company</span>
              </Link>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Building2 className="w-4 h-4 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">TechFlow Solutions</p>
                <p className="text-xs text-gray-500">Company Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GHL</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Hire</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Company</span>
              </Link>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Building2 className="w-4 h-4 text-gray-600" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">TechFlow Solutions</p>
                <p className="text-xs text-gray-500">Company Admin</p>
              </div>
              <button className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Top bar for desktop */}
        <div className="hidden md:block bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search candidates, applications..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">TechFlow Solutions</p>
                    <p className="text-xs text-gray-500">Company Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}