import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';

const middleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  return middleware(request);
}

export const config = {
  // Match all pathnames except static files, API routes, and Next.js internals
  matcher: ['/', '/(fr|en|nl)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};

