import { supabaseServer } from '@/lib/supabase/server';

/** Sidebar badge → the table it counts. */
const TABLES: Record<string, string> = {
  articles: 'articles',
  media: 'media_assets',
  reviews: 'reviews',
  cases: 'cases',
  gallery: 'gallery_items',
  doctors: 'doctors',
  branches: 'branches',
  services: 'services',
};

/**
 * Row counts for the sidebar badges.
 *
 * `head: true` asks Postgres for the count and no rows, so this is eight cheap
 * queries rather than eight table scans. A table that fails to count is simply
 * left out of the map and its badge disappears — a missing badge is not worth
 * failing a page render over.
 */
export async function navCounts(): Promise<Record<string, number>> {
  const supabase = await supabaseServer();

  const entries = await Promise.all(
    Object.entries(TABLES).map(async ([key, table]) => {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      return error || count === null ? null : ([key, count] as const);
    }),
  );

  return Object.fromEntries(entries.filter((e): e is readonly [string, number] => e !== null));
}
