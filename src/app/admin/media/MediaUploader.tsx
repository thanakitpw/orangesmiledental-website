'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MEDIA_CATEGORIES, GALLERY_SUBCATS } from '@/lib/admin/media';

interface Progress {
  done: number;
  total: number;
  current: string;
}

export function MediaUploader({ defaultCategory = 'media' }: { defaultCategory?: string }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState(defaultCategory);
  const [galleryCat, setGalleryCat] = useState<string>(GALLERY_SUBCATS[0].value);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [done, setDone] = useState(0);

  async function upload(files: FileList) {
    setErrors([]);
    setDone(0);
    const list = Array.from(files);
    const failures: string[] = [];
    let ok = 0;

    // One at a time rather than Promise.all: twenty parallel sharp conversions on
    // one function instance is how you turn an upload into a timeout, and the
    // sequential version is what makes a truthful progress count possible.
    for (const [index, file] of list.entries()) {
      setProgress({ done: index, total: list.length, current: file.name });

      const fd = new FormData();
      fd.set('file', file);
      fd.set('category', category);
      if (category === 'gallery') fd.set('gallery_cat', galleryCat);

      try {
        const res = await fetch('/admin/api/media/upload', { method: 'POST', body: fd });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? 'อัปโหลดไม่สำเร็จ');
        ok += 1;
      } catch (e) {
        failures.push(`${file.name}: ${e instanceof Error ? e.message : 'อัปโหลดไม่สำเร็จ'}`);
      }
    }

    setProgress(null);
    setErrors(failures);
    setDone(ok);
    if (ok > 0) router.refresh();
  }

  return (
    <div className="a-panel">
      <h2>อัปโหลดรูปใหม่</h2>
      <p>
        เลือกได้หลายไฟล์พร้อมกัน ระบบจะย่อให้ไม่เกิน 2000px และแปลงเป็น WebP ให้อัตโนมัติ
        เพื่อให้เว็บโหลดเร็ว — อัปโหลดรูปจากมือถือได้เลย ไม่ต้องย่อมาก่อน
      </p>

      <div className="a-row">
        <div className="a-field">
          <label htmlFor="up_category">หมวด</label>
          <select
            id="up_category"
            className="a-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {MEDIA_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <small>หมวดเป็นตัวกำหนดโฟลเดอร์ที่ไฟล์ไปอยู่ เลือกให้ตรงจะหาเจอง่ายทีหลัง</small>
        </div>

        {category === 'gallery' && (
          <div className="a-field">
            <label htmlFor="up_gallery">ประเภทการรักษา</label>
            <select
              id="up_gallery"
              className="a-select"
              value={galleryCat}
              onChange={(e) => setGalleryCat(e.target.value)}
            >
              {GALLERY_SUBCATS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/webp,image/png,image/jpeg,image/svg+xml"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) upload(e.target.files);
          e.target.value = '';
        }}
      />

      <div className="a-actions">
        <button
          type="button"
          className="a-btn a-btn--primary"
          disabled={Boolean(progress)}
          onClick={() => fileInput.current?.click()}
        >
          เลือกไฟล์…
        </button>
        {progress && (
          <span className="a-hint">
            กำลังอัปโหลด {progress.done + 1}/{progress.total} — {progress.current}
          </span>
        )}
      </div>

      {done > 0 && !progress && (
        <div className="a-note a-note--ok" style={{ marginTop: 12, marginBottom: 0 }}>
          อัปโหลดสำเร็จ {done} ไฟล์ — อย่าลืมใส่คำอธิบายภาพให้รูปใหม่ด้านล่าง
        </div>
      )}

      {errors.length > 0 && (
        <div className="a-note a-note--err" style={{ marginTop: 12, marginBottom: 0 }}>
          {errors.map((e) => (
            <div key={e}>{e}</div>
          ))}
        </div>
      )}
    </div>
  );
}
