import { NextResponse, type NextRequest } from 'next/server';
import { SITE } from '@/content/site';

const CANONICAL_HOST = new URL(SITE.url).host;

/**
 * The project is still reachable at orangesmiledental-website.vercel.app, and that
 * copy is byte-for-byte the real site — which is exactly what Google treats as
 * duplicate content. The canonical tags point at the real domain, but a hard
 * noindex on every other host is the part that cannot be misread.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const host = req.headers.get('host');
  if (host && host !== CANONICAL_HOST) {
    res.headers.set('x-robots-tag', 'noindex, nofollow');
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
