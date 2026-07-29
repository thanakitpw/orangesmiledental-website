import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase/server';
import { MEDIA_CATEGORIES } from '@/lib/admin/media';
import { MediaUploader } from './MediaUploader';
import { MediaRow, type MediaRowData } from './MediaRow';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 40;

type Search = { category?: string; q?: string; missing_alt?: string; page?: string };

function buildHref(current: Search, patch: Partial<Search>) {
  const params = new URLSearchParams();
  const merged = { ...current, ...patch };
  for (const [k, v] of Object.entries(merged)) if (v) params.set(k, String(v));
  const qs = params.toString();
  return qs ? `/admin/media?${qs}` : '/admin/media';
}

export default async function MediaPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireStaff();
  const search = await searchParams;

  const page = Math.max(1, Number(search.page) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const supabase = await supabaseServer();
  let query = supabase
    .from('media_assets')
    .select('key, category, gallery_cat, alt_th, alt_en, width, height, bytes', { count: 'exact' })
    .order('category')
    .order('key')
    .range(from, from + PAGE_SIZE - 1);

  if (search.category) query = query.eq('category', search.category);
  if (search.q) query = query.ilike('key', `%${search.q}%`);
  if (search.missing_alt) query = query.is('alt_th', null);

  const { data, count, error } = await query;
  const items = (data ?? []) as MediaRowData[];
  const total = count ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <div className="a-head">
        <div>
          <h1>คลังรูปภาพ</h1>
          <p>
            รูปทุกใบบนเว็บเก็บอยู่ที่นี่ อ้างถึงด้วย “key” เช่น{' '}
            <code>assets/team/doc1.webp</code> ไม่ใช่ URL — เวลาเลือกรูปในหน้าอื่นจึงเห็นเป็นชื่อแบบนี้
          </p>
        </div>
      </div>

      <MediaUploader defaultCategory={search.category || 'media'} />

      <div className="a-panel">
        <form className="a-modal__bar" style={{ marginBottom: 14 }}>
          <select name="category" className="a-select" defaultValue={search.category ?? ''}>
            <option value="">ทุกหมวด</option>
            {MEDIA_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input name="q" className="a-input" placeholder="ค้นหาชื่อไฟล์…" defaultValue={search.q ?? ''} />
          <label className="a-check" style={{ padding: 0, alignItems: 'center' }}>
            <input type="checkbox" name="missing_alt" value="1" defaultChecked={Boolean(search.missing_alt)} />
            <span>เฉพาะรูปที่ยังไม่มีคำอธิบาย</span>
          </label>
          <button className="a-btn" type="submit">
            กรอง
          </button>
          {(search.category || search.q || search.missing_alt) && (
            <Link className="a-btn" href="/admin/media">
              ล้าง
            </Link>
          )}
        </form>

        {error ? (
          <div className="a-note a-note--err">โหลดคลังรูปไม่สำเร็จ: {error.message}</div>
        ) : items.length === 0 ? (
          <p className="a-empty">ไม่พบรูปตามเงื่อนไขนี้</p>
        ) : (
          <>
            <p className="a-hint" style={{ marginTop: 0 }}>
              พบ {total} รูป · หน้า {page} จาก {lastPage}
            </p>

            <div className="a-scroll">
              <table className="a-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>รูป</th>
                    <th>ไฟล์</th>
                    <th colSpan={2}>คำอธิบายภาพ (alt text)</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <MediaRow key={item.key} item={item} />
                  ))}
                </tbody>
              </table>
            </div>

            {lastPage > 1 && (
              <div className="a-actions" style={{ marginTop: 16 }}>
                {page > 1 && (
                  <Link className="a-btn" href={buildHref(search, { page: String(page - 1) })}>
                    ← ก่อนหน้า
                  </Link>
                )}
                {page < lastPage && (
                  <Link className="a-btn" href={buildHref(search, { page: String(page + 1) })}>
                    ถัดไป →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
