'use client';

import { createBrowserClient } from '@supabase/ssr';
import { requireSupabaseEnv } from './env';

/**
 * Browser client. Used only by the login form — every other admin write goes
 * through a Server Action, so the browser never needs a database handle.
 */
export function supabaseBrowser() {
  const { url, anonKey } = requireSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
