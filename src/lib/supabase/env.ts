/**
 * The two public Supabase values, read once and validated once.
 *
 * The public site is built to survive without them — `mediaUrl()` falls back to
 * `public/media` and `listPosts()` returns an empty array — but the admin cannot:
 * there is nothing meaningful to show a logged-out editor when the database is
 * unreachable. So the admin side throws loudly rather than rendering an empty
 * shell that looks like "no articles yet".
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function requireSupabaseEnv(): { url: string; anonKey: string } {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set to use the admin.',
    );
  }
  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
}
