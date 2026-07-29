'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { mediaUrl } from '@/lib/media';
import { MEDIA_CATEGORIES } from '@/lib/admin/media';

export interface MediaItem {
  key: string;
  category: string;
  gallery_cat: string | null;
  alt_th: string | null;
  alt_en: string | null;
  width: number | null;
  height: number | null;
}

/**
 * Pick an existing image, or upload one without leaving the form.
 *
 * The second half matters more than it looks: without it, adding an article means
 * going to the media page, uploading, copying the key, coming back, and hoping the
 * draft survived. Every one of those steps is a chance to lose work.
 */
export function MediaPicker({
  category,
  onPick,
  onClose,
}: {
  category?: string;
  onPick: (key: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState(category ?? '');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (filter) params.set('category', filter);
    if (q) params.set('q', q);

    try {
      const res = await fetch(`/admin/api/media?${params}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'โหลดรูปไม่สำเร็จ');
      setItems(body.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'โหลดรูปไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [filter, q]);

  // Debounced so typing in the search box does not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(load, q ? 250 : 0);
    return () => clearTimeout(timer);
  }, [load, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function upload(file: File) {
    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.set('file', file);
    fd.set('category', filter || category || 'media');

    try {
      const res = await fetch('/admin/api/media/upload', { method: 'POST', body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'อัปโหลดไม่สำเร็จ');
      onPick(body.item.key);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'อัปโหลดไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="a-modal" role="dialog" aria-modal="true" aria-label="เลือกรูปภาพ" onMouseDown={onClose}>
      <div className="a-modal__box" onMouseDown={(e) => e.stopPropagation()}>
        <div className="a-modal__head">
          <strong>เลือกรูปจากคลัง</strong>
          <button type="button" className="a-btn a-btn--sm" onClick={onClose}>
            ปิด
          </button>
        </div>

        <div className="a-modal__bar">
          <select className="a-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">ทุกหมวด</option>
            {MEDIA_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            className="a-input"
            placeholder="ค้นหาชื่อไฟล์…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            type="button"
            className="a-btn a-btn--primary"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
          >
            {uploading ? 'กำลังอัปโหลด…' : 'อัปโหลดรูปใหม่'}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/webp,image/png,image/jpeg,image/svg+xml"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = '';
            }}
          />
        </div>

        {error && <div className="a-note a-note--err">{error}</div>}

        <div className="a-modal__body">
          {loading ? (
            <p className="a-empty">กำลังโหลด…</p>
          ) : items.length === 0 ? (
            <p className="a-empty">ไม่พบรูปในหมวดนี้</p>
          ) : (
            <div className="a-mediagrid">
              {items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="a-mediacard"
                  onClick={() => onPick(item.key)}
                  title={item.key}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- up to 300
                      arbitrary storage keys per open; the optimizer is the wrong tool. */}
                  <img src={mediaUrl(item.key)} alt={item.alt_th ?? ''} loading="lazy" />
                  <span>{item.key.split('/').pop()}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
