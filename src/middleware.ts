import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Rate limiting storage (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware
 */
function rateLimiter(request: NextRequest): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const path = request.nextUrl.pathname;

  // Skip rate limiting for static files
  if (path.startsWith('/_next') || path.startsWith('/static') || path.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)) {
    return null;
  }

  // Different limits for different endpoints
  const limits: Record<string, { requests: number; window: number }> = {
    '/api/auth': { requests: 5, window: 60000 }, // 5 requests per minute
    '/api/ai': { requests: 20, window: 60000 }, // 20 requests per minute
    '/api': { requests: 100, window: 60000 }, // 100 requests per minute for other API routes
  };

  // Find matching limit
  let limit = { requests: 200, window: 60000 }; // Default: 200 requests per minute
  for (const [prefix, config] of Object.entries(limits)) {
    if (path.startsWith(prefix)) {
      limit = config;
      break;
    }
  }

  const key = `${ip}:${path.split('/').slice(0, 3).join('/')}`; // Group by first 3 path segments
  const now = Date.now();
  const record = rateLimit.get(key);

  if (!record || now > record.resetTime) {
    // Create new record
    rateLimit.set(key, {
      count: 1,
      resetTime: now + limit.window,
    });
    return null;
  }

  if (record.count >= limit.requests) {
    // Rate limit exceeded
    const resetIn = Math.ceil((record.resetTime - now) / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': resetIn.toString(),
          'X-RateLimit-Limit': limit.requests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': record.resetTime.toString(),
        },
      }
    );
  }

  // Increment counter
  record.count++;
  return null;
}

/**
 * Clean up old rate limit records periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimit.entries()) {
    if (now > record.resetTime) {
      rateLimit.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Update Supabase session first
  const response = await updateSession(request);

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL || '',
      'http://localhost:3000',
      'http://localhost:3001',
    ];

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }

  return response;
}

/**
 * Only signed-in areas and API routes run this middleware.
 *
 * Public pages (home, jobs, guides, employers) are prebuilt and served from
 * the CDN. Matching them here would turn every visit, including every crawler
 * hit, into an edge function call plus a serverless function call, which is
 * what pushed the Netlify team past its free function limit. Security headers
 * for all routes are set in netlify.toml instead.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/company/:path*',
    '/post-job/:path*',
    '/admin/:path*',
    '/edit-job/:path*',
    '/applications/:path*',
    '/profile/:path*',
    '/notifications/:path*',
    '/job-alerts/:path*',
    '/auth/:path*',
    '/api/:path*',
  ],
};
