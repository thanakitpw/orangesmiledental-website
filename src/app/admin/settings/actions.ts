'use server';

import { revalidatePath } from 'next/cache';
import { requireStaff } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase/server';
import { revalidateWholeSite } from '@/lib/admin/revalidate';
import { dbMessage, str, type FormState } from '@/lib/admin/form';

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireStaff();

  const phone = str(fd, 'phone');
  if (!phone) return { error: 'ต้องกรอกเบอร์โทรหลัก' };
  if (!str(fd, 'line_url')) return { error: 'ต้องกรอกลิงก์ LINE — ปุ่มติดต่อทุกหน้าใช้ลิงก์นี้' };

  const digits = phone.replace(/[^0-9+]/g, '');

  const values = {
    id: 1,
    phone,
    // Derived rather than asked for: nobody types `tel:` links correctly by hand,
    // and a broken one fails silently on the one device that matters — a phone.
    tel_url: str(fd, 'tel_url') || (digits ? `tel:${digits}` : ''),
    line_url: str(fd, 'line_url'),
    fb_url: str(fd, 'fb_url'),
    email: str(fd, 'email'),
    legal_name_th: str(fd, 'legal_name_th'),
    legal_name_en: str(fd, 'legal_name_en'),
    address_th: str(fd, 'address_th'),
    address_en: str(fd, 'address_en'),
    hours_th: str(fd, 'hours_th'),
    hours_en: str(fd, 'hours_en'),
  };

  const supabase = await supabaseServer();
  const { error } = await supabase.from('site_settings').upsert(values, { onConflict: 'id' });
  if (error) return { error: dbMessage(error) };

  revalidatePath('/admin/settings');
  // These land in the footer and the nav, which every page renders.
  revalidateWholeSite();
  return { ok: 'บันทึกเรียบร้อยแล้ว — หน้าเว็บอัปเดตทุกหน้าแล้ว' };
}
