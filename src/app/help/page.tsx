'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, Search, ChevronDown, ChevronUp, BookOpen, Users, Briefcase, CreditCard, Settings, Mail } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: any;
  faqs: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button in the top right corner. You can sign up as a job seeker or employer. Fill in your basic information, verify your email, and complete your profile to get started.'
      },
      {
        question: 'What is GHL Hire?',
        answer: 'GHL Hire is a specialized job board connecting GoHighLevel professionals with agencies and companies in the GHL ecosystem. We focus exclusively on GHL-related positions including developers, automation specialists, funnel builders, and more.'
      },
      {
        question: 'Is GHL Hire free to use?',
        answer: 'Job seekers can create profiles and apply to jobs completely free. Employers can post their first job for free, with premium features available through our paid plans.'
      }
    ]
  },
  {
    title: 'For Job Seekers',
    icon: Users,
    faqs: [
      {
        question: 'How do I apply for jobs?',
        answer: 'Browse jobs, click on positions that interest you, and click the "Apply" button. You\'ll need to complete your profile first. You can track all your applications in your dashboard.'
      },
      {
        question: 'Can I save jobs to apply later?',
        answer: 'Yes! Click the bookmark icon on any job listing to save it. Access your saved jobs anytime from your dashboard.'
      },
      {
        question: 'How do job alerts work?',
        answer: 'Create custom job alerts based on your preferences (job type, location, skills, etc.). You\'ll receive notifications when new matching jobs are posted. You can manage your alerts in the Job Alerts section.'
      },
      {
        question: 'How do I update my profile?',
        answer: 'Go to your dashboard and click "Edit Profile". Keep your profile updated with your latest experience, skills, and portfolio items to attract employers.'
      }
    ]
  },
  {
    title: 'For Employers',
    icon: Briefcase,
    faqs: [
      {
        question: 'How do I post a job?',
        answer: 'Click "Post a Job" from your company dashboard. Fill in the job details including title, description, requirements, and compensation. You can preview your posting before publishing.'
      },
      {
        question: 'How long do job postings stay active?',
        answer: 'Standard job postings remain active for 30 days. You can extend, edit, or close postings at any time from your dashboard.'
      },
      {
        question: 'Can I manage multiple job postings?',
        answer: 'Yes! You can create and manage unlimited job postings through your company dashboard. Track applications, views, and performance for each posting.'
      },
      {
        question: 'How do I review applications?',
        answer: 'Access all applications from your company dashboard. You can filter, sort, and update application statuses. Candidates are notified when their status changes.'
      },
      {
        question: 'What analytics are available?',
        answer: 'Our analytics dashboard shows job views, application rates, conversion metrics, and performance trends. Use these insights to optimize your job postings.'
      }
    ]
  },
  {
    title: 'Billing & Pricing',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept Maya Payments and all major credit cards. All transactions are secure and encrypted.'
      },
      {
        question: 'Can I get a refund?',
        answer: 'Refunds are available within 7 days of purchase if you haven\'t used the service. Contact support@ghlhire.com for refund requests.'
      },
      {
        question: 'Do you offer discounts for multiple job postings?',
        answer: 'Yes! We offer volume discounts for companies posting multiple jobs. Contact our sales team for custom pricing.'
      }
    ]
  },
  {
    title: 'Account & Settings',
    icon: Settings,
    faqs: [
      {
        question: 'How do I change my password?',
        answer: 'Go to Settings > Security and click "Change Password". You\'ll need to verify your current password before setting a new one.'
      },
      {
        question: 'How do I delete my account?',
        answer: 'Contact support@ghlhire.com to request account deletion. Please note this action is permanent and cannot be undone.'
      },
      {
        question: 'How do I manage email notifications?',
        answer: 'Go to Notifications > Preferences to customize which emails you receive and how often. You can control notifications for applications, job matches, and more.'
      },
      {
        question: 'Can I have multiple users on one company account?',
        answer: 'Yes! Premium plans include multi-user access with role-based permissions. Manage team members from your company settings.'
      }
    ]
  }
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState<string[]>([faqCategories[0].title]);
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleQuestion = (question: string) => {
    setOpenQuestions(prev =>
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-blue-100 mb-8">
            Find answers to common questions and learn how to make the most of GHL Hire
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            const isOpen = openCategories.includes(category.title);

            return (
              <div key={category.title} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.title)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
                    <span className="text-sm text-gray-500">({category.faqs.length})</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-gray-200">
                    {category.faqs.map((faq, index) => {
                      const isQuestionOpen = openQuestions.includes(faq.question);

                      return (
                        <div key={index} className="border-b border-gray-100 last:border-b-0">
                          <button
                            onClick={() => toggleQuestion(faq.question)}
                            className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-start justify-between gap-4"
                          >
                            <span className="font-medium text-gray-900">{faq.question}</span>
                            {isQuestionOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            )}
                          </button>

                          {isQuestionOpen && (
                            <div className="px-6 pb-4 text-gray-600">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-6">
              Try different keywords or browse all categories
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Contact Support CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link
            href="/support"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
