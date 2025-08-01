import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, MapPin, Clock, DollarSign, Calendar, ExternalLink, Bookmark } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockJobs } from '@/lib/mock-data';

interface JobDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = mockJobs.find(j => j.id === id);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />
      
      {/* Job Header */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          href="/jobs" 
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8 fade-in fade-in-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        {/* Job Title and Meta */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 border-b border-gray-200 pb-8 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-gray-900 fade-in fade-in-2">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-gray-500 text-base mb-4 fade-in fade-in-3">
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {job.company}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.type}
              </span>
              {job.salary && (
                <span className="inline-flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {job.salary}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Posted {job.postedDate}
              </span>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 fade-in fade-in-4">
              {job.skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 lg:flex-col fade-in fade-in-5">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
              <ExternalLink className="w-5 h-5" />
              Apply Now
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              <Bookmark className="w-5 h-5" />
              Save Job
            </button>
          </div>
        </div>

        {/* Job Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="fade-in fade-in-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="fade-in fade-in-1">
              <h2 className="text-xl font-semibold mb-4">Key Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="fade-in fade-in-2">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-gray-50 rounded-xl p-6 fade-in fade-in-3">
              <h3 className="font-semibold mb-4">About {job.company}</h3>
              <p className="text-gray-600 text-sm mb-4">
                A leading company in the GoHighLevel ecosystem, specializing in marketing automation and client success.
              </p>
              <Link 
                href="#" 
                className="text-blue-500 font-medium hover:underline text-sm"
              >
                View Company Profile →
              </Link>
            </div>

            {/* Job Stats */}
            <div className="bg-gray-50 rounded-xl p-6 fade-in fade-in-4">
              <h3 className="font-semibold mb-4">Job Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Job Type:</span>
                  <span className="font-medium">{job.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Salary:</span>
                    <span className="font-medium">{job.salary}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Posted:</span>
                  <span className="font-medium">{job.postedDate}</span>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-gray-50 rounded-xl p-6 fade-in fade-in-5">
              <h3 className="font-semibold mb-4">Similar Jobs</h3>
              <div className="space-y-3">
                {mockJobs.slice(0, 3).filter(j => j.id !== job.id).map((similarJob) => (
                  <Link 
                    key={similarJob.id}
                    href={`/jobs/${similarJob.id}`}
                    className="block p-3 bg-white rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="font-medium text-sm text-gray-900 mb-1">
                      {similarJob.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {similarJob.company} • {similarJob.location}
                    </div>
                  </Link>
                ))}
              </div>
              <Link 
                href="/jobs" 
                className="block text-blue-500 font-medium hover:underline text-sm mt-4"
              >
                View All Jobs →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-blue-50 rounded-xl p-8 fade-in fade-in-6">
          <h3 className="text-xl font-semibold mb-2">Ready to Apply?</h3>
          <p className="text-gray-600 mb-6">
            Join the GoHighLevel community and take your career to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
              <ExternalLink className="w-5 h-5" />
              Apply Now
            </button>
            <Link 
              href="/jobs" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 font-semibold rounded-lg hover:bg-white transition-colors"
            >
              Browse More Jobs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}