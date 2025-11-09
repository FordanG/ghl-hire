'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  BookOpen,
  FileText,
  Video,
  Wrench,
  Download,
  Eye,
  Star,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  resource_type: 'guide' | 'template' | 'tool' | 'video' | 'course' | 'ebook';
  url: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  category: string;
  tags: string[] | null;
  is_premium: boolean;
  download_count: number;
  views_count: number;
  published_at: string;
}

const resourceTypes = [
  { value: 'all', label: 'All Resources', icon: BookOpen },
  { value: 'guide', label: 'Guides', icon: FileText },
  { value: 'template', label: 'Templates', icon: FileText },
  { value: 'tool', label: 'Tools', icon: Wrench },
  { value: 'video', label: 'Videos', icon: Video },
  { value: 'course', label: 'Courses', icon: BookOpen },
  { value: 'ebook', label: 'eBooks', icon: BookOpen }
];

const categories = [
  'All',
  'Career Development',
  'GHL Training',
  'Interview Prep',
  'Resume Building',
  'Skill Development',
  'Industry Insights'
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, selectedType, selectedCategory, searchTerm, showPremiumOnly]);

  const fetchResources = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      setResources(data || []);

    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.resource_type === selectedType);
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Premium filter
    if (showPremiumOnly) {
      filtered = filtered.filter(resource => resource.is_premium);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredResources(filtered);
  };

  const handleResourceClick = async (resource: Resource) => {
    // Increment view count
    await supabase
      .from('resources')
      .update({ views_count: (resource.views_count || 0) + 1 })
      .eq('id', resource.id);

    // If it's a file download, increment download count
    if (resource.file_url) {
      await supabase
        .from('resources')
        .update({ download_count: (resource.download_count || 0) + 1 })
        .eq('id', resource.id);
    }

    // Open URL or download file
    if (resource.url) {
      window.open(resource.url, '_blank');
    } else if (resource.file_url) {
      window.open(resource.file_url, '_blank');
    }
  };

  const getResourceIcon = (type: string) => {
    const resourceType = resourceTypes.find(t => t.value === type);
    return resourceType ? resourceType.icon : BookOpen;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Career Resources
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Free guides, templates, and tools to help you succeed in your GoHighLevel career
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Type Filter Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {resourceTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                    selectedType === type.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category and Premium Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={showPremiumOnly}
              onChange={(e) => setShowPremiumOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium text-gray-700">Premium Only</span>
          </label>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No resources found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedType === 'all' ? 'All Resources' : resourceTypes.find(t => t.value === selectedType)?.label}
                <span className="text-gray-500 text-xl ml-2">({filteredResources.length})</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const Icon = getResourceIcon(resource.resource_type);

                return (
                  <div
                    key={resource.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
                  >
                    {resource.thumbnail_url ? (
                      <img
                        src={resource.thumbnail_url}
                        alt={resource.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Icon className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600 capitalize">
                            {resource.resource_type}
                          </span>
                        </div>
                        {resource.is_premium && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            <Star className="w-3 h-3" />
                            Premium
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {resource.views_count}
                          </div>
                          {resource.file_url && (
                            <div className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {resource.download_count}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleResourceClick(resource)}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        {resource.file_url ? (
                          <>
                            <Download className="w-4 h-4" />
                            Download
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            View Resource
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Looking for personalized career guidance?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Browse our blog for expert advice, success stories, and industry insights
          </p>
          <Link
            href="/blog"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Visit Our Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
