import type { NextConfig } from "next";

// Security headers for every route. Set here (not in middleware) so prebuilt
// pages carry them without invoking a function. netlify.toml headers do not
// reach pages served by the Next.js runtime, so this is the source of truth.
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com https://api.resend.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

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
      { source: '/waitlist', destination: '/#subscribe', permanent: false },
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
        source: '/:path*',
        headers:
          process.env.NODE_ENV === 'production'
            ? [...securityHeaders, { key: 'Content-Security-Policy', value: contentSecurityPolicy }]
            : securityHeaders,
      },
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
