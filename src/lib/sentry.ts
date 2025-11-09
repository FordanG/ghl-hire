/**
 * Sentry Error Monitoring Configuration
 *
 * Sentry provides real-time error tracking and performance monitoring
 * Documentation: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 *
 * Setup Instructions:
 * 1. Create account at https://sentry.io
 * 2. Create new Next.js project
 * 3. Copy DSN to NEXT_PUBLIC_SENTRY_DSN environment variable
 * 4. Install package: npm install @sentry/nextjs
 * 5. Run: npx @sentry/wizard@latest -i nextjs
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

/**
 * Initialize Sentry
 */
export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,

    // Performance Monitoring
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0, // Sample 10% in production

    // Session Replay
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions
    replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors

    // Filter sensitive data
    beforeSend(event, hint) {
      // Remove sensitive data from error reports
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }

      // Filter out non-critical errors
      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof Error) {
          // Ignore certain errors
          if (
            error.message.includes('Network request failed') ||
            error.message.includes('Failed to fetch')
          ) {
            return null; // Don't send to Sentry
          }
        }
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'cancelled',
    ],

    // Set context tags
    initialScope: {
      tags: {
        platform: 'web',
      },
    },
  });
}

/**
 * Capture exception with context
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.setContext('additional', context);
  }
  Sentry.captureException(error);
}

/**
 * Capture message
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Set user context
 */
export function setUser(user: { id: string; email?: string; username?: string } | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Start transaction for performance monitoring
 */
export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({
    name,
    op,
  });
}

// Initialize Sentry if DSN is configured
if (typeof window !== 'undefined') {
  initSentry();
}

export { Sentry };
