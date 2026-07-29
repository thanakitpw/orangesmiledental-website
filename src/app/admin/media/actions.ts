'use server';

import { revalidatePath } from 'next/cache';
import { requireStaff } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase/server';
import { revalidateSite } from '@/lib/admin/revalidate';
import { dbMessage, nullable, str, type FormState } from '@/lib/admin/form';

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET ?? 'media';

export async function updateMediaAlt(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireStaff();
  const supabase = await supabaseServer();

  const key = str(fd, 'key');
  if (!key) return { error: 'ไม่พบรูปที่ต้องการแก้ไข' };

  const { error } = await supabase
    .from('media_assets')
    .update({ alt_th: nullable(fd, 'alt_th'), alt_en: nullable(fd, 'alt_en') })
    .eq('key', key);

  if (error) return { error: dbMessage(error) };

  revalidatePath('/admin/media');
  // Alt text reaches the public HTML through gallery and article images.
  revalidateSite('/reviews', '/articles');
  return { ok: 'บันทึกแล้ว' };
}

/**
 * Removes the file and its index row together.
 *
 * There is no reference check, deliberately — `cover_key`, `photo` and the gallery
 * all store keys as plain text with no foreign key to `media_assets`, so a check
 * would have to guess at every table that might mention it and would still miss a
 * key typed by hand into an article's Markdown. The confirmation dialogue names
 * the file and says what cannot be undone; that is the honest guarantee.
 */
export async function deleteMedia(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireStaff();
  const supabase = await supabaseServer();

  const key = str(fd, 'key');
  if (!key) return { error: 'ไม่พบรูปที่ต้องการลบ' };

  const { error: storageError } = await supabase.storage.from(BUCKET).remove([key]);
  if (storageError) return { error: `ลบไฟล์ไม่สำเร็จ: ${storageError.message}` };

  const { error } = await supabase.from('media_assets').delete().eq('key', key);
  if (error) return { error: dbMessage(error, 'ลบข้อมูลรูปไม่สำเร็จ') };

  revalidatePath('/admin/media');
  revalidateSite();
  return { ok: 'ลบรูปแล้ว' };
}
