import { requireStaff } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase/server';
import { dbMessage } from './form';

/**
 * The parts every content table's admin does identically.
 *
 * Seven tables — reviews, cases, gallery, doctors, branches, services, settings —
 * all need the same four verbs, and the interesting differences between them are
 * entirely in their *fields*, not in how a row is written. These helpers hold the
 * boring half so each entity's Server Actions can be a short, readable list of
 * what its columns are.
 *
 * They are helpers, not Server Actions. Each entity declares its own actions in
 * its own `'use server'` file, because that is where validation and the set of
 * pages to revalidate actually belong.
 */

export interface RowResult {
  error?: string;
  id?: string;
}

export async function upsertRow(
  table: string,
  id: string | null,
  values: Record<string, unknown>,
): Promise<RowResult> {
  await requireStaff();
  const supabase = await supabaseServer();

  const { data, error } = id
    ? await supabase.from(table).update(values).eq('id', id).select('id').single()
    : await supabase.from(table).insert(values).select('id').single();

  if (error) return { error: dbMessage(error) };
  return { id: data.id };
}

export async function deleteRow(table: string, id: string): Promise<RowResult> {
  await requireStaff();
  const supabase = await supabaseServer();

  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) return { error: dbMessage(error, 'ลบไม่สำเร็จ') };
  return {};
}

export async function setActive(table: string, id: string, isActive: boolean): Promise<RowResult> {
  await requireStaff();
  const supabase = await supabaseServer();

  const { error } = await supabase.from(table).update({ is_active: isActive }).eq('id', id);
  if (error) return { error: dbMessage(error, 'เปลี่ยนสถานะไม่สำเร็จ') };
  return {};
}

/**
 * Moves a row one place up or down by swapping `sort_order` with its neighbour.
 *
 * Swapping rather than renumbering the whole list: two writes instead of N, and
 * no window in which a concurrent edit sees half a renumbering. The neighbour is
 * found by `sort_order` and then by `id`, so rows that were seeded with the same
 * order value still have a stable, total ordering to move through instead of
 * silently refusing to move.
 */
export async function moveRow(
  table: string,
  id: string,
  direction: 'up' | 'down',
  scope?: { column: string; value: string },
): Promise<RowResult> {
  await requireStaff();
  const supabase = await supabaseServer();

  const { data: rows, error } = await supabase
    .from(table)
    .select('id, sort_order')
    .order('sort_order')
    .order('id');

  if (error) return { error: dbMessage(error, 'จัดลำดับไม่สำเร็จ') };

  const list = scope
    ? ((rows ?? []) as Record<string, unknown>[]).filter((r) => r[scope.column] === scope.value)
    : ((rows ?? []) as Record<string, unknown>[]);

  const index = list.findIndex((r) => r.id === id);
  const target = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= list.length) return {};

  const a = list[index] as { id: string; sort_order: number };
  const b = list[target] as { id: string; sort_order: number };

  // Equal sort_order values would make a swap a no-op, so give them distinct ones.
  const [aOrder, bOrder] =
    a.sort_order === b.sort_order
      ? direction === 'up'
        ? [b.sort_order - 1, b.sort_order]
        : [b.sort_order + 1, b.sort_order]
      : [b.sort_order, a.sort_order];

  const results = await Promise.all([
    supabase.from(table).update({ sort_order: aOrder }).eq('id', a.id),
    supabase.from(table).update({ sort_order: bOrder }).eq('id', b.id),
  ]);

  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: dbMessage(failed.error, 'จัดลำดับไม่สำเร็จ') };
  return {};
}

/** Puts a new row at the end of its list. */
export async function nextSortOrder(table: string): Promise<number> {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from(table)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  return ((data?.sort_order as number | undefined) ?? -1) + 1;
}
