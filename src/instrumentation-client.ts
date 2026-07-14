/**
 * Next.js client instrumentation entry point.
 *
 * Next.js loads this automatically in the browser bundle, so importing and
 * calling initSentry() here is what enables client-side error tracking.
 * Server and Edge initialization live in instrumentation.ts.
 */

import { initSentry } from '@/lib/sentry';

initSentry();
