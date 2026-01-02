import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Rate limiting storage (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Security headers
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Content Security Policy
const CSP = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com https://api.resend.com https://*.paymaya.com;
  frame-src 'self' https://*.paymaya.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

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
    '/api/payments': { requests: 10, window: 60000 }, // 10 requests per minute
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
  const path = request.nextUrl.pathname;

  // Redirect all traffic to waitlist (pre-launch mode)
  const allowedPaths = ['/waitlist', '/api', '/_next', '/favicon.ico'];
  const isAllowed = allowedPaths.some(p => path.startsWith(p)) || path.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/);

  if (!isAllowed) {
    return NextResponse.redirect(new URL('/waitlist', request.url));
  }

  // Apply rate limiting
  const rateLimitResponse = rateLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Update Supabase session first
  let response = await updateSession(request);

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Apply CSP header (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Content-Security-Policy', CSP);
  }

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

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
