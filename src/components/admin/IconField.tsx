'use client';

import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { ICON_OPTIONS, iconShapes } from '@/content/icons';

/**
 * Picks one of the line icons registered in `src/content/icons.ts`, with a live
 * preview — the names describe the drawing ("โล่ + ถูก"), but seeing it is faster
 * than reading it.
 *
 * A dropdown rather than a free text field on purpose: the underlying value is
 * SVG path data, which is not something anyone should be typing into a CMS.
 */
export function IconField({
  name,
  label,
  defaultValue,
  accent = '#FF7A00',
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  accent?: string;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue || 'heart');

  return (
    <div className="a-field">
      <label htmlFor={name}>{label}</label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 9,
            background: '#f3f4f6',
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
          }}
        >
          <Icon shapes={iconShapes(value)} stroke={accent} size={22} />
        </span>
        <select
          id={name}
          name={name}
          className="a-select"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {ICON_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {hint && <small>{hint}</small>}
    </div>
  );
}
