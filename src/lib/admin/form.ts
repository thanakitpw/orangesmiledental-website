import type { PostgrestError } from '@supabase/supabase-js';

/** What every admin Server Action returns, and what `useActionState` renders. */
export type FormState = { error?: string; ok?: string } | null;

export const str = (fd: FormData, key: string): string => (fd.get(key) ?? '').toString().trim();

export const nullable = (fd: FormData, key: string): string | null => str(fd, key) || null;

export const bool = (fd: FormData, key: string): boolean => {
  const v = fd.get(key);
  return v === 'on' || v === 'true' || v === '1';
};

export const int = (fd: FormData, key: string, fallback = 0): number => {
  const n = Number(str(fd, key));
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
};

export const csv = (fd: FormData, key: string): string[] =>
  str(fd, key)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * A `<input type="date">` value as an ISO instant at UTC midnight.
 *
 * Deliberately date-only. The columns are timestamptz and a datetime-local input
 * would look more precise, but its value carries no zone — `new Date(value)` would
 * resolve it against the *server's* clock, which on Vercel is UTC, not Bangkok. The
 * site only ever prints a date (`formatDate` reads UTC parts), so pinning to UTC
 * midnight is both simpler and the only version that cannot drift by a day.
 */
export const dateField = (fd: FormData, key: string): string | null => {
  const v = str(fd, key);
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T00:00:00.000Z` : null;
};

/** ISO instant → the `yyyy-mm-dd` an `<input type="date">` expects. */
export const toDateInput = (iso: string | null | undefined): string =>
  iso ? new Date(iso).toISOString().slice(0, 10) : '';

export function jsonField<T>(fd: FormData, key: string, fallback: T): T {
  const raw = str(fd, key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Lower-case, hyphenated, ASCII — the shape the article routes already use. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9฀-๿]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Postgres speaks in constraint names. The clinic does not.
 *
 * The constraints in migrations 0002–0004 exist to stop the site making a claim
 * nobody stands behind — "reviewed by a dentist" with no dentist attached. When
 * one fires it means the editor tried to do exactly that, so the message has to
 * say which claim is missing, not `violates check constraint`.
 */
const CONSTRAINT_MESSAGES: Record<string, string> = {
  published_requires_attribution: 'บทความที่เผยแพร่ต้องระบุชื่อผู้เขียนก่อน',
  published_requires_date: 'บทความที่เผยแพร่ต้องระบุวันที่เผยแพร่',
  reviewer_needs_name_and_date: 'ผู้ตรวจทานต้องมีทั้งชื่อและวันที่ตรวจทาน หรือไม่ใส่ทั้งคู่',
  license_needs_a_reviewer: 'เลขใบอนุญาตต้องมีชื่อผู้ตรวจทานกำกับด้วย',
  license_belongs_to_a_person: 'เลขใบอนุญาตเป็นของบุคคล ใส่กับผู้ตรวจทานแบบ "ทีมทันตแพทย์" ไม่ได้',
  reviewed_flag_matches_reviewer: 'ติ๊ก "ตรวจทานทางการแพทย์แล้ว" ไม่ได้ถ้ายังไม่มีชื่อผู้ตรวจทาน',
};

export function dbMessage(error: PostgrestError, fallback = 'บันทึกไม่สำเร็จ'): string {
  for (const [name, message] of Object.entries(CONSTRAINT_MESSAGES)) {
    if (error.message.includes(name)) return message;
  }
  if (error.code === '23505') return 'มีข้อมูลซ้ำอยู่แล้ว (slug หรือรหัสซ้ำกับรายการอื่น)';
  if (error.code === '42501') return 'ไม่มีสิทธิ์บันทึกข้อมูลนี้ กรุณาเข้าสู่ระบบใหม่';
  return `${fallback}: ${error.message}`;
}
