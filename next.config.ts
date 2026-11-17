import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance Optimizations
  compress: true, // Enable gzip compression

  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'], // Modern image formats
    minimumCacheTTL: 60, // Cache optimized images for 60 seconds
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Production source maps (smaller, faster)
  productionBrowserSourceMaps: false,

  // Use Turbopack (default in Next.js 16)
  turbopack: {},

  // Redirects for URL consistency
  async redirects() {
    return [
      // The board is free: the old plans page now explains featured listings.
      { source: '/pricing', destination: '/featured', permanent: true },
      // Old category and resource pages carried made-up salary and demand figures.
      { source: '/categories', destination: '/jobs', permanent: true },
      { source: '/jobs/category/ghl-developer', destination: '/jobs?q=developer', permanent: true },
      { source: '/jobs/category/automation-specialist', destination: '/jobs?q=automation', permanent: true },
      { source: '/jobs/category/funnel-builder', destination: '/jobs?q=funnel', permanent: true },
      { source: '/jobs/category/:slug', destination: '/jobs', permanent: true },
      { source: '/resources', destination: '/blog', permanent: true },
      { source: '/company/billing/:path*', destination: '/company/dashboard/billing', permanent: false },
      {
        source: '/sign-up',
        destination: '/signup',
        permanent: true,
      },
      {
        source: '/sign-in',
        destination: '/signin',
        permanent: true,
      },
      {
        source: '/auth/sign-up',
        destination: '/signup',
        permanent: true,
      },
      {
        source: '/auth/sign-in',
        destination: '/signin',
        permanent: true,
      },
    ];
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
