import { supabaseServer } from '@/lib/supabase/server';

/**
 * Reads for the admin list and edit screens.
 *
 * Deliberately untyped beyond `Record<string, any>`: these screens render whatever
 * columns the table has, and hand-maintaining a mirror of ten table shapes would
 * be a second source of truth that drifts the first time a column is added. The
 * Server Actions that write are where the shape is stated explicitly, because
 * that is where getting it wrong has consequences.
 *
 * Staff see hidden rows too — the `is_active` filter is on the anon policy only.
 */
export type AdminRow = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export async function listRows(
  table: string,
  opts: { order?: string[]; select?: string } = {},
): Promise<AdminRow[]> {
  const supabase = await supabaseServer();
  let query = supabase.from(table).select(opts.select ?? '*');
  for (const column of opts.order ?? ['sort_order']) query = query.order(column);

  const { data, error } = await query;
  if (error) throw new Error(`โหลดข้อมูลจากตาราง ${table} ไม่สำเร็จ: ${error.message}`);
  return (data ?? []) as AdminRow[];
}

/** `new` is a route, not a row, so it never reaches Postgres as a uuid. */
export async function getRow(table: string, id: string): Promise<AdminRow | null> {
  if (id === 'new') return null;

  const supabase = await supabaseServer();
  const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return data as AdminRow;
}

export async function getSingleton(table: string): Promise<AdminRow | null> {
  const supabase = await supabaseServer();
  const { data } = await supabase.from(table).select('*').limit(1).maybeSingle();
  return (data as AdminRow) ?? null;
}
