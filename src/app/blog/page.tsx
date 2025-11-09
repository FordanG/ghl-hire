'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Tag,
  Search,
  TrendingUp,
  Eye
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  category: string;
  tags: string[] | null;
  published_at: string;
  reading_time_minutes: number | null;
  views_count: number;
  author: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
}

const categories = [
  'All',
  'Career Advice',
  'GHL Tips',
  'Industry News',
  'Success Stories',
  'Tutorials',
  'Best Practices'
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory, searchTerm]);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(id, full_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      const postsData = data || [];
      setPosts(postsData);

      // Set the most recent post as featured
      if (postsData.length > 0) {
        setFeaturedPost(postsData[0]);
      }

    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              GHL Hire Blog
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Career advice, industry insights, and success stories from the GoHighLevel community
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
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
        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading articles...</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && selectedCategory === 'All' && !searchTerm && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-2xl font-bold">Featured Article</h2>
                </div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredPost.cover_image ? (
                      <img
                        src={featuredPost.cover_image}
                        alt={featuredPost.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 md:h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <BookOpen className="w-24 h-24 text-white opacity-50" />
                      </div>
                    )}
                    <div className="p-8 flex flex-col justify-center">
                      <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4 w-fit">
                        {featuredPost.category}
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        {featuredPost.author && (
                          <div className="flex items-center gap-2">
                            {featuredPost.author.avatar_url ? (
                              <img
                                src={featuredPost.author.avatar_url}
                                alt={featuredPost.author.full_name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <span>{featuredPost.author.full_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(featuredPost.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        {featuredPost.reading_time_minutes && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featuredPost.reading_time_minutes} min read
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Blog Posts Grid */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {selectedCategory === 'All' ? 'Latest Articles' : selectedCategory}
                  <span className="text-gray-500 text-xl ml-2">({filteredPosts.length})</span>
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
                    >
                      {post.cover_image ? (
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3 w-fit">
                          {post.category}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(post.published_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            {post.reading_time_minutes && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {post.reading_time_minutes} min
                              </div>
                            )}
                          </div>
                          {post.views_count > 0 && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views_count}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Stay Updated with GHL Hire Insights
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get the latest career tips, industry news, and job opportunities delivered to your inbox
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
