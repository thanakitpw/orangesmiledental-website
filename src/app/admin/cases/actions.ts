'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { deleteRow, moveRow, nextSortOrder, setActive, upsertRow } from '@/lib/admin/crud';
import { revalidateSite } from '@/lib/admin/revalidate';
import { bool, slugify, str, type FormState } from '@/lib/admin/form';

const TABLE = 'cases';

function refresh() {
  revalidatePath('/admin/cases');
  revalidateSite('/reviews');
}

export async function saveCase(_prev: FormState, fd: FormData): Promise<FormState> {
  const id = str(fd, 'id') || null;

  if (!str(fd, 'before_key') || !str(fd, 'after_key')) {
    return { error: 'ต้องเลือกทั้งรูปก่อนรักษาและรูปหลังรักษา' };
  }
  if (!str(fd, 'title_th') || !str(fd, 'title_en')) {
    return { error: 'ต้องกรอกหัวข้อเคสทั้งไทยและอังกฤษ' };
  }
  if (!str(fd, 'cat_label_th') || !str(fd, 'cat_label_en')) {
    return { error: 'ต้องกรอกชื่อประเภทการรักษาทั้งไทยและอังกฤษ' };
  }

  // The category key is what the filter chips match on; deriving it from the
  // English label keeps it URL-safe and stops two spellings of "veneer" becoming
  // two chips.
  const category = slugify(str(fd, 'category') || str(fd, 'cat_label_en'));
  if (!category) return { error: 'ระบุรหัสประเภทการรักษาไม่ได้ กรุณากรอกชื่อประเภทเป็นภาษาอังกฤษ' };

  const values = {
    category,
    cat_label_th: str(fd, 'cat_label_th'),
    cat_label_en: str(fd, 'cat_label_en'),
    code: str(fd, 'code'),
    accent: str(fd, 'accent') || '#FF7A00',
    tint: str(fd, 'tint') || '#FFF3E8',
    before_key: str(fd, 'before_key'),
    after_key: str(fd, 'after_key'),
    title_th: str(fd, 'title_th'),
    title_en: str(fd, 'title_en'),
    title_long_th: str(fd, 'title_long_th'),
    title_long_en: str(fd, 'title_long_en'),
    quote_th: str(fd, 'quote_th'),
    quote_en: str(fd, 'quote_en'),
    doctor_th: str(fd, 'doctor_th'),
    doctor_en: str(fd, 'doctor_en'),
    branch_th: str(fd, 'branch_th'),
    branch_en: str(fd, 'branch_en'),
    is_active: bool(fd, 'is_active'),
    ...(id ? {} : { sort_order: await nextSortOrder(TABLE) }),
  };

  const result = await upsertRow(TABLE, id, values);
  if (result.error) return { error: result.error };

  refresh();
  if (!id) redirect(`/admin/cases/${result.id}?saved=1`);
  return { ok: 'บันทึกเรียบร้อยแล้ว' };
}

export async function deleteCase(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await deleteRow(TABLE, str(fd, 'id'));
  if (result.error) return { error: result.error };
  refresh();
  redirect('/admin/cases?deleted=1');
}

export async function toggleCase(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await setActive(TABLE, str(fd, 'id'), str(fd, 'active') === 'true');
  if (result.error) return { error: result.error };
  refresh();
  return {};
}

export async function moveCase(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await moveRow(TABLE, str(fd, 'id'), str(fd, 'direction') === 'up' ? 'up' : 'down');
  if (result.error) return { error: result.error };
  refresh();
  return {};
}
