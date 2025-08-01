'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto fade-in fade-in-2">
            Have questions about GHL Hire? We&apos;re here to help. Reach out to our team and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="fade-in fade-in-3">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 rounded-full p-3">
                    <Mail className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-gray-600">support@ghlhire.com</p>
                    <p className="text-gray-600">hello@ghlhire.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 rounded-full p-3">
                    <Phone className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri 9AM-5PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 rounded-full p-3">
                    <MapPin className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office</h3>
                    <p className="text-gray-600">123 Business Ave<br />Suite 100<br />Austin, TX 78701</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 rounded-full p-3">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM EST</p>
                    <p className="text-gray-600">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Links */}
            <div className="mt-12 fade-in fade-in-4">
              <h3 className="font-semibold mb-4">Quick Help</h3>
              <div className="space-y-3">
                <a href="#" className="block text-blue-600 hover:text-blue-500 transition-colors">
                  How do I post a job?
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-500 transition-colors">
                  How do I apply for jobs?
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-500 transition-colors">
                  Pricing information
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-500 transition-colors">
                  Account management
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-8 fade-in fade-in-5">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-50 rounded-xl fade-in fade-in-6">
            <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-4">Get help via email with detailed responses</p>
            <p className="text-blue-600 font-medium">Response within 24 hours</p>
          </div>

          <div className="text-center p-6 bg-gray-50 rounded-xl fade-in fade-in-1">
            <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm mb-4">Speak directly with our support team</p>
            <p className="text-blue-600 font-medium">Available Mon-Fri 9AM-5PM</p>
          </div>

          <div className="text-center p-6 bg-gray-50 rounded-xl fade-in fade-in-2">
            <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-4">Instant help with our live chat feature</p>
            <p className="text-blue-600 font-medium">Coming soon</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}