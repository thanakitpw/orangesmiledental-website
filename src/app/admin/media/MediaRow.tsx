'use client';

import { useActionState } from 'react';
import { mediaUrl } from '@/lib/media';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { CATEGORY_LABEL } from '@/lib/admin/media';
import type { FormState } from '@/lib/admin/form';
import { updateMediaAlt, deleteMedia } from './actions';

export interface MediaRowData {
  key: string;
  category: string;
  gallery_cat: string | null;
  alt_th: string | null;
  alt_en: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
}

const kb = (bytes: number | null) => (bytes ? `${Math.round(bytes / 1024)} KB` : '—');

export function MediaRow({ item }: { item: MediaRowData }) {
  const [state, action] = useActionState<FormState, FormData>(updateMediaAlt, null);
  const [deleteState, deleteAction] = useActionState<FormState, FormData>(deleteMedia, null);

  return (
    <tr>
      <td>
        <a href={mediaUrl(item.key)} target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary storage
              keys listed 60 at a time; next/image would queue an optimizer request each. */}
          <img className="a-thumb" src={mediaUrl(item.key)} alt="" loading="lazy" />
        </a>
      </td>

      <td style={{ maxWidth: 260 }}>
        <div style={{ fontWeight: 600, overflowWrap: 'anywhere', fontSize: 12.5 }}>{item.key}</div>
        <div className="a-num" style={{ fontSize: 11.5 }}>
          {CATEGORY_LABEL[item.category] ?? item.category}
          {item.gallery_cat && ` · ${item.gallery_cat}`}
          {' · '}
          {item.width && item.height ? `${item.width}×${item.height}` : '—'} · {kb(item.bytes)}
        </div>
      </td>

      <td colSpan={2}>
        <form action={action} style={{ display: 'grid', gap: 6 }}>
          <input type="hidden" name="key" value={item.key} />
          <div className="a-pair" style={{ gap: 8 }}>
            <input
              className="a-input"
              name="alt_th"
              defaultValue={item.alt_th ?? ''}
              placeholder="คำอธิบายภาพ (ไทย)"
              aria-label={`คำอธิบายภาษาไทยของ ${item.key}`}
            />
            <input
              className="a-input"
              name="alt_en"
              defaultValue={item.alt_en ?? ''}
              placeholder="Alt text (English)"
              aria-label={`English alt text for ${item.key}`}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <SubmitButton className="a-btn a-btn--sm">บันทึกคำอธิบาย</SubmitButton>
            {state?.ok && <span className="a-badge a-badge--ok">{state.ok}</span>}
            {state?.error && <span className="a-badge" style={{ background: '#fdecec', color: '#8c1c1c' }}>{state.error}</span>}
          </div>
        </form>
      </td>

      <td style={{ textAlign: 'end' }}>
        <form action={deleteAction}>
          <input type="hidden" name="key" value={item.key} />
          <SubmitButton
            className="a-btn a-btn--sm a-btn--danger"
            pendingLabel="…"
            confirm={`ลบ ${item.key} ถาวร?\n\nถ้ามีหน้าไหนใช้รูปนี้อยู่ รูปจะหายไปจากหน้านั้นทันที และกู้คืนไม่ได้`}
          >
            ลบ
          </SubmitButton>
          {deleteState?.error && (
            <div className="a-badge" style={{ background: '#fdecec', color: '#8c1c1c', marginTop: 6 }}>
              {deleteState.error}
            </div>
          )}
        </form>
      </td>
    </tr>
  );
}
