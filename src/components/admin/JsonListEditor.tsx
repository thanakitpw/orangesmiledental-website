'use client';

import { useState } from 'react';

export interface JsonListField {
  key: string;
  label: string;
  textarea?: boolean;
  placeholder?: string;
}

type Row = Record<string, string>;

/**
 * Edits a repeating list that is stored as one jsonb column.
 *
 * Three different shapes in this schema are the same problem — an ordered list of
 * short records with no identity of their own: article FAQs (`{q, a}`), a doctor's
 * specialities (`{th, en}`) and a service's bullet points (`{th, en}`). None of
 * them is worth its own table, and none of them is editable as raw JSON by anyone
 * who is not a programmer.
 *
 * The value ships as JSON in a hidden input, so the surrounding <form> stays a
 * plain uncontrolled form and the Server Action reads it with `jsonField()`.
 */
export function JsonListEditor({
  name,
  label,
  hint,
  fields,
  initial = [],
  addLabel = 'เพิ่มรายการ',
}: {
  name: string;
  label: string;
  hint?: string;
  fields: JsonListField[];
  initial?: Row[];
  addLabel?: string;
}) {
  const [rows, setRows] = useState<Row[]>(initial);

  const blank = (): Row => Object.fromEntries(fields.map((f) => [f.key, '']));

  const update = (index: number, key: string, value: string) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));

  const move = (index: number, delta: number) =>
    setRows((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  return (
    <div className="a-field">
      <span className="a-legend">{label}</span>
      {hint && <small>{hint}</small>}

      {/* Empty rows are dropped rather than saved — the Server Actions filter them
          out too, but not sending them keeps the payload honest. */}
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(rows.filter((r) => fields.some((f) => r[f.key]?.trim())))}
      />

      <div className="a-repeat">
        {rows.map((row, index) => (
          <div className="a-repeat__item" key={index}>
            <div className="a-repeat__head">
              <span>#{index + 1}</span>
              <span style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  className="a-btn a-btn--sm"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="เลื่อนขึ้น"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="a-btn a-btn--sm"
                  onClick={() => move(index, 1)}
                  disabled={index === rows.length - 1}
                  aria-label="เลื่อนลง"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="a-btn a-btn--sm a-btn--danger"
                  onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}
                >
                  ลบ
                </button>
              </span>
            </div>

            {fields.map((f) => (
              <div className="a-field" key={f.key} style={{ marginBottom: 8 }}>
                <label>{f.label}</label>
                {f.textarea ? (
                  <textarea
                    className="a-textarea"
                    rows={3}
                    value={row[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => update(index, f.key, e.target.value)}
                  />
                ) : (
                  <input
                    className="a-input"
                    value={row[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => update(index, f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <button type="button" className="a-btn a-btn--sm" onClick={() => setRows((prev) => [...prev, blank()])}>
          + {addLabel}
        </button>
      </div>
    </div>
  );
}
