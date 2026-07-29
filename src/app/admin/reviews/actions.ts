'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { deleteRow, moveRow, nextSortOrder, setActive, upsertRow } from '@/lib/admin/crud';
import { revalidateSite } from '@/lib/admin/revalidate';
import { bool, str, type FormState } from '@/lib/admin/form';

const TABLE = 'reviews';

/** Reviews run as a marquee on the home page only. */
function refresh() {
  revalidatePath('/admin/reviews');
  revalidateSite();
}

export async function saveReview(_prev: FormState, fd: FormData): Promise<FormState> {
  const id = str(fd, 'id') || null;

  if (!str(fd, 'name_th') || !str(fd, 'name_en')) return { error: 'ต้องกรอกชื่อผู้รีวิวทั้งไทยและอังกฤษ' };
  if (!str(fd, 'text_th') || !str(fd, 'text_en')) return { error: 'ต้องกรอกข้อความรีวิวทั้งไทยและอังกฤษ' };

  const nameTh = str(fd, 'name_th');
  const values = {
    // The Thai initial is not the first letter of the English name, so it is its
    // own field — but defaulting it saves the editor a step in the common case.
    initial: str(fd, 'initial') || [...nameTh.replace(/^คุณ/, '')][0] || '',
    name_th: nameTh,
    name_en: str(fd, 'name_en'),
    text_th: str(fd, 'text_th'),
    text_en: str(fd, 'text_en'),
    service_th: str(fd, 'service_th'),
    service_en: str(fd, 'service_en'),
    branch_th: str(fd, 'branch_th'),
    branch_en: str(fd, 'branch_en'),
    is_active: bool(fd, 'is_active'),
    ...(id ? {} : { sort_order: await nextSortOrder(TABLE) }),
  };

  const result = await upsertRow(TABLE, id, values);
  if (result.error) return { error: result.error };

  refresh();
  if (!id) redirect(`/admin/reviews/${result.id}?saved=1`);
  return { ok: 'บันทึกเรียบร้อยแล้ว' };
}

export async function deleteReview(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await deleteRow(TABLE, str(fd, 'id'));
  if (result.error) return { error: result.error };
  refresh();
  // Used from both the list and the edit screen; the edit screen's row no longer
  // exists after this, so both end up on the list.
  redirect('/admin/reviews?deleted=1');
}

export async function toggleReview(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await setActive(TABLE, str(fd, 'id'), str(fd, 'active') === 'true');
  if (result.error) return { error: result.error };
  refresh();
  return {};
}

export async function moveReview(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await moveRow(TABLE, str(fd, 'id'), str(fd, 'direction') === 'up' ? 'up' : 'down');
  if (result.error) return { error: result.error };
  refresh();
  return {};
}
