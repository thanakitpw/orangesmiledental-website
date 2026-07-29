'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { deleteRow, moveRow, nextSortOrder, setActive, upsertRow } from '@/lib/admin/crud';
import { revalidateSite } from '@/lib/admin/revalidate';
import { bool, jsonField, str, type FormState } from '@/lib/admin/form';
import type { Localized } from '@/lib/lang';

const TABLE = 'doctors';

function refresh() {
  revalidatePath('/admin/doctors');
  // The roster is on /doctors; the hero pill on the home page uses the same rows.
  revalidateSite('/doctors');
}

export async function saveDoctor(_prev: FormState, fd: FormData): Promise<FormState> {
  const id = str(fd, 'id') || null;

  if (!str(fd, 'name')) return { error: 'ต้องกรอกชื่อทันตแพทย์' };
  if (!str(fd, 'photo')) return { error: 'ต้องเลือกรูปทันตแพทย์' };

  const values = {
    name: str(fd, 'name'),
    photo: str(fd, 'photo'),
    role_th: str(fd, 'role_th') || 'ทันตแพทย์',
    role_en: str(fd, 'role_en') || 'Dentist',
    bio_th: str(fd, 'bio_th'),
    bio_en: str(fd, 'bio_en'),
    tags: jsonField<Localized[]>(fd, 'tags', []).filter((t) => t.th?.trim() || t.en?.trim()),
    hero_face: bool(fd, 'hero_face'),
    is_active: bool(fd, 'is_active'),
    ...(id ? {} : { sort_order: await nextSortOrder(TABLE) }),
  };

  const result = await upsertRow(TABLE, id, values);
  if (result.error) return { error: result.error };

  refresh();
  if (!id) redirect(`/admin/doctors/${result.id}?saved=1`);
  return { ok: 'บันทึกเรียบร้อยแล้ว' };
}

export async function deleteDoctor(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await deleteRow(TABLE, str(fd, 'id'));
  if (result.error) return { error: result.error };
  refresh();
  redirect('/admin/doctors?deleted=1');
}

export async function toggleDoctor(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await setActive(TABLE, str(fd, 'id'), str(fd, 'active') === 'true');
  if (result.error) return { error: result.error };
  refresh();
  return {};
}

export async function moveDoctor(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await moveRow(TABLE, str(fd, 'id'), str(fd, 'direction') === 'up' ? 'up' : 'down');
  if (result.error) return { error: result.error };
  refresh();
  return {};
}
