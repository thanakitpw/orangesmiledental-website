'use server';

import { revalidatePath } from 'next/cache';
import { requireStaff } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase/server';
import { deleteRow, moveRow, nextSortOrder, setActive, upsertRow } from '@/lib/admin/crud';
import { revalidateSite } from '@/lib/admin/revalidate';
import { dbMessage, int, slugify, str, type FormState } from '@/lib/admin/form';

const TABLE = 'gallery_items';

function refresh() {
  revalidatePath('/admin/gallery');
  revalidateSite('/reviews');
}

/**
 * Adds one or more images at once.
 *
 * The clinic adds gallery photos in batches — a morning's worth of finished
 * cases — so the picker hands back a list of keys and they all land in the same
 * category in one submit. One at a time would be the same work five times.
 */
export async function addGalleryItems(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireStaff();

  const cat = str(fd, 'cat');
  if (!cat) return { error: 'ต้องเลือกประเภทการรักษาก่อน' };

  const keys = fd
    .getAll('keys')
    .map((k) => k.toString().trim())
    .filter(Boolean);

  if (keys.length === 0) return { error: 'ยังไม่ได้เลือกรูป' };

  const start = await nextSortOrder(TABLE);
  const supabase = await supabaseServer();
  const { error } = await supabase
    .from(TABLE)
    .insert(keys.map((img, i) => ({ img, cat, sort_order: start + i })));

  if (error) return { error: dbMessage(error) };

  refresh();
  return { ok: `เพิ่มรูปแล้ว ${keys.length} รูป` };
}

export async function deleteGalleryItem(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await deleteRow(TABLE, str(fd, 'id'));
  if (result.error) return { error: result.error };
  refresh();
  return { ok: 'ลบแล้ว' };
}

export async function toggleGalleryItem(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await setActive(TABLE, str(fd, 'id'), str(fd, 'active') === 'true');
  if (result.error) return { error: result.error };
  refresh();
  return {};
}

export async function moveGalleryItem(_prev: FormState, fd: FormData): Promise<FormState> {
  const cat = str(fd, 'cat');
  const result = await moveRow(
    TABLE,
    str(fd, 'id'),
    str(fd, 'direction') === 'up' ? 'up' : 'down',
    // Reordering is per category: moving a veneer photo "up" should step past the
    // veneer photo above it, not whatever row happens to sit next in the table.
    cat ? { column: 'cat', value: cat } : undefined,
  );
  if (result.error) return { error: result.error };
  refresh();
  return {};
}

// -------------------------------------------------------------- categories

export async function saveGalleryCategory(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireStaff();

  const key = slugify(str(fd, 'key') || str(fd, 'label_en'));
  if (!key) return { error: 'ต้องระบุรหัสประเภท หรือชื่อประเภทภาษาอังกฤษ' };
  if (!str(fd, 'label_th') || !str(fd, 'label_en')) {
    return { error: 'ต้องกรอกชื่อประเภททั้งไทยและอังกฤษ' };
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.from('gallery_categories').upsert(
    {
      key,
      label_th: str(fd, 'label_th'),
      label_en: str(fd, 'label_en'),
      sort_order: int(fd, 'sort_order', 0),
    },
    { onConflict: 'key' },
  );

  if (error) return { error: dbMessage(error) };

  refresh();
  return { ok: 'บันทึกประเภทแล้ว' };
}

export async function deleteGalleryCategory(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireStaff();
  const supabase = await supabaseServer();
  const key = str(fd, 'key');

  // gallery_items.cat is a foreign key, so Postgres would refuse anyway — but
  // "still has 21 photos in it" is a more useful sentence than a constraint name.
  const { count } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('cat', key);

  if ((count ?? 0) > 0) {
    return { error: `ลบไม่ได้ — ยังมีรูปอยู่ในประเภทนี้ ${count} รูป ให้ย้ายหรือลบรูปออกก่อน` };
  }

  const { error } = await supabase.from('gallery_categories').delete().eq('key', key);
  if (error) return { error: dbMessage(error, 'ลบประเภทไม่สำเร็จ') };

  refresh();
  return { ok: 'ลบประเภทแล้ว' };
}
