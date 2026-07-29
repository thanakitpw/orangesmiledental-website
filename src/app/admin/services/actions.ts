'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { deleteRow, moveRow, nextSortOrder, setActive, upsertRow } from '@/lib/admin/crud';
import { revalidateSite } from '@/lib/admin/revalidate';
import { bool, jsonField, slugify, str, type FormState } from '@/lib/admin/form';
import type { Localized } from '@/lib/lang';

const TABLE = 'services';

function refresh() {
  revalidatePath('/admin/services');
  revalidateSite('/services');
}

export async function saveService(_prev: FormState, fd: FormData): Promise<FormState> {
  const id = str(fd, 'id') || null;

  if (!str(fd, 'name_th') || !str(fd, 'name_en')) return { error: 'ต้องกรอกชื่อบริการทั้งไทยและอังกฤษ' };

  const key = slugify(str(fd, 'key') || str(fd, 'name_en'));
  if (!key) return { error: 'ระบุรหัสบริการไม่ได้ กรุณากรอกรหัสหรือชื่อบริการภาษาอังกฤษ' };

  const values = {
    key,
    photo: str(fd, 'photo'),
    name_th: str(fd, 'name_th'),
    name_en: str(fd, 'name_en'),

    show_on_home: bool(fd, 'show_on_home'),
    home_icon: str(fd, 'home_icon') || 'heart',
    home_accent: str(fd, 'home_accent') || '#FF7A00',
    home_tint: str(fd, 'home_tint') || '#FFF3E8',
    home_desc_th: str(fd, 'home_desc_th'),
    home_desc_en: str(fd, 'home_desc_en'),

    show_on_services: bool(fd, 'show_on_services'),
    icon: str(fd, 'icon') || 'heart',
    accent: str(fd, 'accent') || '#FF7A00',
    price_th: str(fd, 'price_th'),
    price_en: str(fd, 'price_en'),
    desc_th: str(fd, 'desc_th'),
    desc_en: str(fd, 'desc_en'),
    items: jsonField<Localized[]>(fd, 'items', []).filter((i) => i.th?.trim() || i.en?.trim()),

    is_active: bool(fd, 'is_active'),
    ...(id ? {} : { sort_order: await nextSortOrder(TABLE) }),
  };

  const result = await upsertRow(TABLE, id, values);
  if (result.error) return { error: result.error };

  refresh();
  if (!id) redirect(`/admin/services/${result.id}?saved=1`);
  return { ok: 'บันทึกเรียบร้อยแล้ว' };
}

export async function deleteService(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await deleteRow(TABLE, str(fd, 'id'));
  if (result.error) return { error: result.error };
  refresh();
  redirect('/admin/services?deleted=1');
}

export async function toggleService(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await setActive(TABLE, str(fd, 'id'), str(fd, 'active') === 'true');
  if (result.error) return { error: result.error };
  refresh();
  return {};
}

export async function moveService(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await moveRow(TABLE, str(fd, 'id'), str(fd, 'direction') === 'up' ? 'up' : 'down');
  if (result.error) return { error: result.error };
  refresh();
  return {};
}

// ------------------------------------------------------------------- perks
// The three benefit cards under the Services process section. Small enough that
// they share this file rather than earning a screen of their own.

export async function savePerk(_prev: FormState, fd: FormData): Promise<FormState> {
  const id = str(fd, 'id') || null;
  if (!str(fd, 'title_th') || !str(fd, 'title_en')) return { error: 'ต้องกรอกหัวข้อทั้งไทยและอังกฤษ' };

  const values = {
    icon: str(fd, 'icon') || 'card',
    accent: str(fd, 'accent') || '#FF7A00',
    tint: str(fd, 'tint') || '#FFF3E8',
    title_th: str(fd, 'title_th'),
    title_en: str(fd, 'title_en'),
    body_th: str(fd, 'body_th'),
    body_en: str(fd, 'body_en'),
    is_active: bool(fd, 'is_active'),
    ...(id ? {} : { sort_order: await nextSortOrder('service_perks') }),
  };

  const result = await upsertRow('service_perks', id, values);
  if (result.error) return { error: result.error };

  refresh();
  revalidatePath('/admin/services/extras');
  return { ok: 'บันทึกเรียบร้อยแล้ว' };
}

export async function deletePerk(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await deleteRow('service_perks', str(fd, 'id'));
  if (result.error) return { error: result.error };
  refresh();
  revalidatePath('/admin/services/extras');
  return { ok: 'ลบแล้ว' };
}

// ------------------------------------------------------------------- steps
// The four-step process. `scope` keeps the home and Services wordings apart —
// they differ slightly in the original design and that difference is preserved.

export async function saveStep(_prev: FormState, fd: FormData): Promise<FormState> {
  const id = str(fd, 'id') || null;
  if (!str(fd, 'title_th') || !str(fd, 'title_en')) return { error: 'ต้องกรอกหัวข้อทั้งไทยและอังกฤษ' };

  const values = {
    scope: str(fd, 'scope') === 'services' ? 'services' : 'home',
    number: str(fd, 'number') || '01',
    title_th: str(fd, 'title_th'),
    title_en: str(fd, 'title_en'),
    body_th: str(fd, 'body_th'),
    body_en: str(fd, 'body_en'),
    ...(id ? {} : { sort_order: await nextSortOrder('service_steps') }),
  };

  const result = await upsertRow('service_steps', id, values);
  if (result.error) return { error: result.error };

  refresh();
  revalidatePath('/admin/services/extras');
  return { ok: 'บันทึกเรียบร้อยแล้ว' };
}

export async function deleteStep(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await deleteRow('service_steps', str(fd, 'id'));
  if (result.error) return { error: result.error };
  refresh();
  revalidatePath('/admin/services/extras');
  return { ok: 'ลบแล้ว' };
}
