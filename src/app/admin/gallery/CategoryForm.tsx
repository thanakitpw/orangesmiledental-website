'use client';

import { useActionState } from 'react';
import { SubmitButton } from '@/components/admin/SubmitButton';
import type { FormState } from '@/lib/admin/form';
import { saveGalleryCategory, deleteGalleryCategory } from './actions';

export function CategoryForm({
  category,
  count = 0,
}: {
  category?: { key: string; label_th: string; label_en: string; sort_order: number };
  count?: number;
}) {
  const [state, save] = useActionState<FormState, FormData>(saveGalleryCategory, null);
  const [deleteState, remove] = useActionState<FormState, FormData>(deleteGalleryCategory, null);

  return (
    <div className="a-repeat__item">
      <div className="a-repeat__head">
        <span>{category ? `${category.label_th} · ${count} รูป` : 'เพิ่มประเภทใหม่'}</span>
        <span style={{ display: 'flex', gap: 8 }}>
          {state?.ok && <span className="a-badge a-badge--ok">{state.ok}</span>}
          {(state?.error || deleteState?.error) && (
            <span className="a-badge" style={{ background: '#fdecec', color: '#8c1c1c' }}>
              {state?.error ?? deleteState?.error}
            </span>
          )}
        </span>
      </div>

      <form action={save}>
        <div className="a-row">
          <div className="a-field">
            <label>ชื่อ (ไทย)</label>
            <input name="label_th" className="a-input" defaultValue={category?.label_th ?? ''} required />
          </div>
          <div className="a-field">
            <label>ชื่อ (อังกฤษ)</label>
            <input name="label_en" className="a-input" defaultValue={category?.label_en ?? ''} required />
          </div>
          <div className="a-field">
            <label>รหัส</label>
            <input
              name="key"
              className="a-input"
              defaultValue={category?.key ?? ''}
              readOnly={Boolean(category)}
              placeholder="ortho"
            />
            {category ? (
              <small>เปลี่ยนรหัสไม่ได้ เพราะรูปทั้งหมดผูกกับรหัสนี้อยู่</small>
            ) : (
              <small>เว้นว่างได้ ระบบจะสร้างจากชื่อภาษาอังกฤษ</small>
            )}
          </div>
          <div className="a-field" style={{ maxWidth: 110 }}>
            <label>ลำดับ</label>
            <input
              name="sort_order"
              type="number"
              className="a-input"
              defaultValue={category?.sort_order ?? 0}
            />
          </div>
        </div>

        <SubmitButton className="a-btn a-btn--sm a-btn--primary">
          {category ? 'บันทึก' : 'เพิ่มประเภท'}
        </SubmitButton>
      </form>

      {category && (
        <form action={remove} style={{ marginTop: 8 }}>
          <input type="hidden" name="key" value={category.key} />
          <SubmitButton
            className="a-btn a-btn--sm a-btn--danger"
            pendingLabel="…"
            confirm={`ลบประเภท "${category.label_th}"?`}
          >
            ลบประเภท
          </SubmitButton>
        </form>
      )}
    </div>
  );
}
