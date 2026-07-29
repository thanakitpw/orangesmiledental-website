'use client';

import { useActionState, useState } from 'react';
import { mediaUrl } from '@/lib/media';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { SubmitButton } from '@/components/admin/SubmitButton';
import type { FormState } from '@/lib/admin/form';
import { addGalleryItems } from './actions';

export function GalleryAdder({ categories }: { categories: { key: string; label_th: string }[] }) {
  const [state, action] = useActionState<FormState, FormData>(addGalleryItems, null);
  const [keys, setKeys] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);

  return (
    <div className="a-panel">
      <h2>เพิ่มรูปผลงาน</h2>
      <p>เลือกรูปจากคลังทีละหลายใบได้ หรือกดอัปโหลดรูปใหม่จากในหน้าต่างเลือกรูปได้เลย</p>

      {state?.error && <div className="a-note a-note--err">{state.error}</div>}
      {state?.ok && <div className="a-note a-note--ok">{state.ok}</div>}

      <form action={action}>
        <div className="a-row">
          <div className="a-field">
            <label htmlFor="cat">ประเภทการรักษา</label>
            <select id="cat" name="cat" className="a-select" required defaultValue="">
              <option value="" disabled>
                — เลือกประเภท —
              </option>
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label_th}
                </option>
              ))}
            </select>
          </div>
        </div>

        {keys.map((k) => (
          <input key={k} type="hidden" name="keys" value={k} />
        ))}

        {keys.length > 0 && (
          <div className="a-mediagrid" style={{ margin: '10px 0 14px' }}>
            {keys.map((k) => (
              <div key={k} className="a-mediacard" style={{ cursor: 'default' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mediaUrl(k)} alt="" loading="lazy" />
                <button
                  type="button"
                  className="a-btn a-btn--sm"
                  onClick={() => setKeys((prev) => prev.filter((x) => x !== k))}
                >
                  เอาออก
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="a-actions">
          <button type="button" className="a-btn" onClick={() => setPicking(true)}>
            เลือกรูป… {keys.length > 0 && `(เลือกแล้ว ${keys.length})`}
          </button>
          <SubmitButton>เพิ่มเข้าแกลเลอรี</SubmitButton>
        </div>
      </form>

      {picking && (
        <MediaPicker
          category="gallery"
          onClose={() => setPicking(false)}
          onPick={(key) => {
            // The dialog stays open so a batch can be picked in one go; a repeat
            // click on the same image is a misclick, not a request for a duplicate.
            setKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
          }}
        />
      )}
    </div>
  );
}
