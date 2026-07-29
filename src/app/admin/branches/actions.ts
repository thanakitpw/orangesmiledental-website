'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { deleteRow, moveRow, nextSortOrder, setActive, upsertRow } from '@/lib/admin/crud';
import { revalidateWholeSite } from '@/lib/admin/revalidate';
import { bool, slugify, str, type FormState } from '@/lib/admin/form';

const TABLE = 'branches';

/**
 * Branches appear in the footer, which the root layout renders on every page —
 * so a per-path bust is not enough here.
 */
function refresh() {
  revalidatePath('/admin/branches');
  revalidateWholeSite();
}

/** '094-420-9555' → 'tel:0944209555'. */
function telHref(phone: string, provided: string): string {
  if (provided) return provided;
  const digits = phone.replace(/[^0-9+]/g, '');
  return digits ? `tel:${digits}` : '';
}

export async function saveBranch(_prev: FormState, fd: FormData): Promise<FormState> {
  const id = str(fd, 'id') || null;

  if (!str(fd, 'name_th') || !str(fd, 'name_en')) return { error: 'ต้องกรอกชื่อสาขาทั้งไทยและอังกฤษ' };

  const key = slugify(str(fd, 'key') || str(fd, 'name_en'));
  if (!key) return { error: 'ระบุรหัสสาขาไม่ได้ กรุณากรอกรหัสสาขาหรือชื่อสาขาภาษาอังกฤษ' };

  const coords = str(fd, 'coords');
  // The embedded map is built from these numbers. A malformed pair would drop the
  // pin somewhere in the ocean rather than fail visibly, so check the shape.
  if (coords && !/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(coords)) {
    return { error: 'พิกัดต้องอยู่ในรูปแบบ ละติจูด,ลองจิจูด เช่น 13.7624012,100.7291678' };
  }

  const phone = str(fd, 'phone');
  const values = {
    key,
    region: str(fd, 'region') === 'pty' ? 'pty' : 'bkk',
    brand: str(fd, 'brand') || 'Orange Smile',
    accent: str(fd, 'accent') || '#FF7A00',
    tint: str(fd, 'tint') || '#FFF3E8',
    photo: str(fd, 'photo'),
    name_th: str(fd, 'name_th'),
    name_en: str(fd, 'name_en'),
    area_th: str(fd, 'area_th'),
    area_en: str(fd, 'area_en'),
    address_th: str(fd, 'address_th'),
    address_en: str(fd, 'address_en'),
    hours_th: str(fd, 'hours_th'),
    hours_en: str(fd, 'hours_en'),
    phone,
    tel_url: telHref(phone, str(fd, 'tel_url')),
    line_url: str(fd, 'line_url'),
    line: str(fd, 'line'),
    fb_url: str(fd, 'fb_url'),
    coords: coords.replace(/\s+/g, ''),
    map_url: str(fd, 'map_url'),
    is_active: bool(fd, 'is_active'),
    ...(id ? {} : { sort_order: await nextSortOrder(TABLE) }),
  };

  const result = await upsertRow(TABLE, id, values);
  if (result.error) return { error: result.error };

  refresh();
  if (!id) redirect(`/admin/branches/${result.id}?saved=1`);
  return { ok: 'บันทึกเรียบร้อยแล้ว' };
}

export async function deleteBranch(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await deleteRow(TABLE, str(fd, 'id'));
  if (result.error) return { error: result.error };
  refresh();
  redirect('/admin/branches?deleted=1');
}

export async function toggleBranch(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await setActive(TABLE, str(fd, 'id'), str(fd, 'active') === 'true');
  if (result.error) return { error: result.error };
  refresh();
  return {};
}

export async function moveBranch(_prev: FormState, fd: FormData): Promise<FormState> {
  const result = await moveRow(TABLE, str(fd, 'id'), str(fd, 'direction') === 'up' ? 'up' : 'down');
  if (result.error) return { error: result.error };
  refresh();
  return {};
}
