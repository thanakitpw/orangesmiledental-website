import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { requireSupabaseEnv } from './env';

/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 *
 * It carries the signed-in staff member's session, deliberately — not the service
 * role. Every write the admin performs therefore still has to satisfy row-level
 * security, so a bug in a Server Action cannot do more than the person who
 * triggered it is allowed to do. The service-role key stays where it started: in
 * the CLI upload scripts, never in a request path.
 */
export async function supabaseServer() {
  const { url, anonKey } = requireSupabaseEnv();
  const store = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Server Components cannot set cookies. The middleware refreshes the
          // session on every /admin request, so nothing is lost by ignoring it here.
        }
      },
    },
  });
}
