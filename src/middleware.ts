import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SITE } from '@/content/site';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/env';

const CANONICAL_HOST = new URL(SITE.url).host;

/**
 * Two jobs, kept apart on purpose.
 *
 * For the public site: the project is still reachable at
 * orangesmiledental-website.vercel.app, and that copy is byte-for-byte the real
 * site — which is exactly what Google treats as duplicate content. The canonical
 * tags point at the real domain, but a hard noindex on every other host is the
 * part that cannot be misread.
 *
 * For /admin: refresh the Supabase session cookie and bounce signed-out visitors
 * to the login screen. This runs only under /admin — a session refresh is a round
 * trip to Supabase, and making every public page wait on one to render a cached
 * marketing page would be a real cost for no benefit.
 *
 * The redirect here is a convenience, not the security boundary. Every admin page
 * calls `requireStaff()` itself, and row-level security is what actually decides
 * what a request can touch.
 */
export async function middleware(req: NextRequest) {
  const isAdmin = req.nextUrl.pathname.startsWith('/admin');
  return isAdmin ? adminGate(req) : publicHeaders(req);
}

function publicHeaders(req: NextRequest) {
  const res = NextResponse.next();
  const host = req.headers.get('host');
  if (host && host !== CANONICAL_HOST) {
    res.headers.set('x-robots-tag', 'noindex, nofollow');
  }
  return res;
}

async function adminGate(req: NextRequest) {
  // The back office is never a search result, on any host.
  let res = NextResponse.next({ request: req });
  res.headers.set('x-robots-tag', 'noindex, nofollow');

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return res;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) req.cookies.set(name, value);
        res = NextResponse.next({ request: req });
        res.headers.set('x-robots-tag', 'noindex, nofollow');
        for (const { name, value, options } of list) res.cookies.set(name, value, options);
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // /admin/reset is reached from a password-recovery email, by definition before
  // a session exists — gating it would make the recovery link useless.
  const isOpenPage =
    req.nextUrl.pathname === '/admin/login' || req.nextUrl.pathname === '/admin/reset';

  if (!user && !isOpenPage) {
    const to = req.nextUrl.clone();
    to.pathname = '/admin/login';
    // So the login form can send them back where they were headed.
    to.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(to);
  }

  // Note the deliberate absence of the mirror rule — signed-in users are NOT
  // bounced off the login page from here. A session is not the same thing as
  // being staff: an invited user whose address never made it onto
  // `staff_allowlist` has one but no profile. Redirecting them to /admin would
  // meet requireStaff(), get sent back to /admin/login, and loop forever. The
  // login page resolves that case itself, where the profile is actually visible.
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
