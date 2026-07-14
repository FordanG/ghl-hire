/**
 * Next.js instrumentation entry point.
 *
 * Next.js loads this automatically at startup for the Node.js server and Edge
 * runtimes. Initializing Sentry here is what makes server route, API,
 * Whop webhook, and edge middleware errors reach Sentry. The browser runtime is
 * initialized separately in instrumentation-client.ts.
 */

import * as Sentry from '@sentry/nextjs';
import { initSentry } from '@/lib/sentry';

export function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' ||
    process.env.NEXT_RUNTIME === 'edge'
  ) {
    initSentry();
  }
}

// Forwards Next.js server-side request errors (route handlers, server
// components, middleware) to Sentry.
export const onRequestError = Sentry.captureRequestError;
