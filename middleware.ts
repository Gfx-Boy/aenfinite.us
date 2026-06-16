import { NextRequest, NextResponse } from 'next/server';

/**
 * 1. Redirects www.<domain> to the bare domain (301).
 *    Both hostnames used to serve the full site as duplicates, which made
 *    Google split ranking signals between two copies of every page
 *    ("Duplicate, Google chose different canonical" in Search Console).
 *
 * 2. Lowercases page URLs so legacy mixed-case links keep working
 *    (e.g. /work/Olly/ -> /work/olly/). This replaces the old per-page
 *    redirects() rules in next.config.ts, which matched case-insensitively
 *    and redirected pages to themselves in a loop. Redirecting only when
 *    the path differs from its lowercase form makes a loop impossible.
 */

const LOWERCASE_SECTIONS = /^\/(work|services|city|cities|agency)\//;

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // www -> apex
  if (host.startsWith('www.')) {
    url.host = host.slice(4);
    return NextResponse.redirect(url, 301);
  }

  // case normalization for page sections (never static assets)
  const { pathname } = url;
  if (LOWERCASE_SECTIONS.test(pathname)) {
    const lower = pathname.toLowerCase();
    if (pathname !== lower) {
      url.pathname = lower;
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on pages, not on Next internals/static files.
  matcher: ['/((?!_next/|wp-content/|wp-includes/|js/|favicon|.*\\.[a-zA-Z0-9]+$).*)'],
};
