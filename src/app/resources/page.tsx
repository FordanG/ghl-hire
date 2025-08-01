import Link from 'next/link';
import { 
  BookOpen, 
  Video, 
  Award, 
  Users, 
  TrendingUp, 
  FileText,
  ExternalLink,
  Download,
  Play,
  Calendar
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ResourcesPage() {
  const resources = [
    {
      id: 1,
      title: 'Complete GoHighLevel Certification Guide',
      description: 'Master the fundamentals with our comprehensive certification preparation guide.',
      type: 'Guide',
      icon: BookOpen,
      difficulty: 'Beginner',
      duration: '2 hours',
      category: 'Certification'
    },
    {
      id: 2,
      title: 'Advanced Automation Workflows',
      description: 'Learn to build complex automation sequences that drive results.',
      type: 'Tutorial',
      icon: Video,
      difficulty: 'Advanced',
      duration: '45 min',
      category: 'Automation'
    },
    {
      id: 3,
      title: 'API Integration Best Practices',
      description: 'Developer guide to integrating with GoHighLevel API effectively.',
      type: 'Documentation',
      icon: FileText,
      difficulty: 'Intermediate',
      duration: '30 min',
      category: 'Development'
    },
    {
      id: 4,
      title: 'Client Onboarding Templates',
      description: 'Ready-to-use templates for streamlined client onboarding processes.',
      type: 'Template',
      icon: Download,
      difficulty: 'Beginner',
      duration: '15 min',
      category: 'Templates'
    },
    {
      id: 5,
      title: 'White Label Setup Masterclass',
      description: 'Complete video series on setting up and managing white label instances.',
      type: 'Video Series',
      icon: Play,
      difficulty: 'Advanced',
      duration: '3 hours',
      category: 'White Label'
    },
    {
      id: 6,
      title: 'GoHighLevel Job Interview Prep',
      description: 'Common interview questions and how to showcase your GHL expertise.',
      type: 'Guide',
      icon: Users,
      difficulty: 'All Levels',
      duration: '1 hour',
      category: 'Career'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'GHL Career Workshop: Landing Your First Role',
      date: 'January 15, 2025',
      time: '2:00 PM EST',
      type: 'Workshop',
      spots: '45 spots remaining'
    },
    {
      id: 2,
      title: 'Advanced Funnel Building Techniques',
      date: 'January 22, 2025',
      time: '1:00 PM EST',
      type: 'Webinar',
      spots: '120 spots remaining'
    },
    {
      id: 3,
      title: 'Networking Mixer: GHL Professionals',
      date: 'February 5, 2025',
      time: '6:00 PM EST',
      type: 'Networking',
      spots: '30 spots remaining'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center pt-20 pb-16 px-4 bg-white">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4 fade-in fade-in-1">
          GoHighLevel <span className="text-blue-500">Resources</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8 fade-in fade-in-2">
          Advance your GoHighLevel expertise with our curated collection of guides, tutorials, templates, and certification resources. Stay ahead in the rapidly evolving world of marketing automation.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 fade-in fade-in-3">
          <Link 
            href="#resources" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-500 text-white font-semibold text-base shadow hover:bg-blue-600 transition-colors"
          >
            Explore Resources
          </Link>
          <Link 
            href="#events" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-gray-200 font-semibold text-base hover:bg-blue-50 hover:border-blue-500 transition-colors text-gray-900"
          >
            Upcoming Events
          </Link>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
              Resource Categories
            </h2>
            <p className="text-lg text-gray-600 fade-in fade-in-2">
              Find exactly what you need to advance your GoHighLevel career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow fade-in fade-in-3">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Certification</h3>
              <p className="text-gray-600 text-sm">Prepare for GHL certifications and validate your expertise</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow fade-in fade-in-4">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Career Growth</h3>
              <p className="text-gray-600 text-sm">Interview tips, salary guides, and career advancement strategies</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow fade-in fade-in-5">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Templates</h3>
              <p className="text-gray-600 text-sm">Ready-to-use templates for funnels, workflows, and client materials</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow fade-in fade-in-6">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Video Tutorials</h3>
              <p className="text-gray-600 text-sm">Step-by-step video guides for complex GHL implementations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section id="resources" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
            Featured Resources
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto fade-in fade-in-2">
            Our most popular and valuable resources to help you succeed with GoHighLevel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <div 
                key={resource.id}
                className={`bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow fade-in fade-in-${Math.min(index % 6 + 3, 6)}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-50 rounded-full p-2">
                    <IconComponent className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                      {resource.type}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {resource.difficulty}
                  </span>
                  <span>{resource.duration}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {resource.category}
                  </span>
                  <Link 
                    href="#" 
                    className="inline-flex items-center gap-1 text-blue-500 font-medium hover:underline"
                  >
                    Access <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12 fade-in fade-in-1">
          <Link 
            href="#" 
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            View All Resources
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
              Upcoming Events
            </h2>
            <p className="text-lg text-gray-600 fade-in fade-in-2">
              Join our community events, workshops, and webinars to stay connected and learn from experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div 
                key={event.id}
                className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow fade-in fade-in-${index + 3}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                    {event.type}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                
                <div className="space-y-2 mb-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center">🕐</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {event.spots}
                  </div>
                </div>

                <Link 
                  href="#" 
                  className="block w-full text-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Register Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
            Learning Paths
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto fade-in fade-in-2">
            Structured learning journeys to help you master specific areas of GoHighLevel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 fade-in fade-in-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500 rounded-full p-2">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Beginner to GHL Specialist</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Complete learning path from basic platform navigation to advanced automation workflows. Perfect for newcomers to GoHighLevel.
            </p>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-600">8 modules • 12 hours</span>
              <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                Free
              </span>
            </div>
            <Link 
              href="#" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Learning Path
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 fade-in fade-in-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-500 rounded-full p-2">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">GHL Developer Track</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Advanced technical training for developers working with GoHighLevel API, custom integrations, and white label solutions.
            </p>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-600">12 modules • 20 hours</span>
              <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                Premium
              </span>
            </div>
            <Link 
              href="#" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors"
            >
              Start Learning Path
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-600 mb-8 fade-in fade-in-2">
            Get the latest GoHighLevel resources, job opportunities, and industry insights delivered to your inbox weekly.
          </p>
          
          <div className="max-w-md mx-auto fade-in fade-in-3">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              />
              <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}