'use client';

import { useState } from 'react';

/**
 * A hex colour, editable as a swatch or as text.
 *
 * Both, because both are needed: the picker is how someone chooses a colour, and
 * the text box is how they paste the exact brand hex a designer gave them. A
 * colour input alone silently rounds what you type; a text box alone means
 * guessing what `#1FA39B` looks like.
 */
export function ColorField({
  name,
  label,
  defaultValue = '#FF7A00',
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue || '#FF7A00');
  const valid = /^#[0-9a-fA-F]{6}$/.test(value);

  return (
    <div className="a-field">
      <label htmlFor={name}>{label}</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="color"
          aria-label={`${label} — เลือกสี`}
          value={valid ? value : '#FF7A00'}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          style={{
            width: 42,
            height: 36,
            padding: 2,
            border: '1px solid #d5d9de',
            borderRadius: 8,
            background: '#fff',
            flex: 'none',
          }}
        />
        <input
          id={name}
          name={name}
          className="a-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
        />
      </div>
      {hint && <small>{hint}</small>}
      {!valid && <small style={{ color: '#c02626' }}>ต้องเป็นรหัสสีแบบ #RRGGBB เช่น #FF7A00</small>}
    </div>
  );
}
