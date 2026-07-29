'use client';

import { useState } from 'react';
import { mediaUrl } from '@/lib/media';
import { MediaPicker } from './MediaPicker';

/**
 * A media *key* field — `assets/media/blog/cover-ortho.webp`, not a URL.
 *
 * Keys rather than URLs throughout, so `mediaUrl()` stays the single place that
 * decides whether an image is served from Supabase Storage or the local
 * `public/media` fallback. Storing a resolved URL here would hard-code that
 * decision into every row.
 */
export function MediaField({
  name,
  label,
  defaultValue = '',
  hint,
  category,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  /** Pre-filters the picker to one media category, e.g. 'blog' or 'team'. */
  category?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [picking, setPicking] = useState(false);

  return (
    <div className="a-field">
      <label htmlFor={name}>{label}</label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- an arbitrary
          // storage key, re-rendered on every keystroke; next/image would queue
          // an optimizer request per character.
          <img className="a-thumb" src={mediaUrl(value)} alt="" width={44} height={44} />
        ) : (
          <span className="a-thumb" aria-hidden />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            id={name}
            name={name}
            className="a-input"
            value={value}
            required={required}
            placeholder="assets/media/blog/cover-ortho.webp"
            onChange={(e) => setValue(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
            <button type="button" className="a-btn a-btn--sm" onClick={() => setPicking(true)}>
              เลือกจากคลังรูป
            </button>
            {value && (
              <button type="button" className="a-btn a-btn--sm" onClick={() => setValue('')}>
                ล้าง
              </button>
            )}
          </div>
        </div>
      </div>
      {hint && <small>{hint}</small>}

      {picking && (
        <MediaPicker
          category={category}
          onClose={() => setPicking(false)}
          onPick={(key) => {
            setValue(key);
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}
