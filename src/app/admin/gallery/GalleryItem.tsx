'use client';

import { useActionState } from 'react';
import { mediaUrl } from '@/lib/media';
import { SubmitButton } from '@/components/admin/SubmitButton';
import type { FormState } from '@/lib/admin/form';
import { deleteGalleryItem, moveGalleryItem, toggleGalleryItem } from './actions';

export function GalleryItem({
  id,
  img,
  cat,
  isActive,
  first,
  last,
}: {
  id: string;
  img: string;
  cat: string;
  isActive: boolean;
  first: boolean;
  last: boolean;
}) {
  const [moveState, move] = useActionState<FormState, FormData>(moveGalleryItem, null);
  const [toggleState, toggle] = useActionState<FormState, FormData>(toggleGalleryItem, null);
  const [deleteState, remove] = useActionState<FormState, FormData>(deleteGalleryItem, null);

  const error = moveState?.error ?? toggleState?.error ?? deleteState?.error;

  return (
    <div className="a-mediacard" style={{ cursor: 'default', opacity: isActive ? 1 : 0.45 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={mediaUrl(img)} alt="" loading="lazy" />

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <form action={move}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="cat" value={cat} />
          <input type="hidden" name="direction" value="up" />
          <button className="a-btn a-btn--sm" type="submit" disabled={first} aria-label="เลื่อนซ้าย">
            ←
          </button>
        </form>

        <form action={move}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="cat" value={cat} />
          <input type="hidden" name="direction" value="down" />
          <button className="a-btn a-btn--sm" type="submit" disabled={last} aria-label="เลื่อนขวา">
            →
          </button>
        </form>

        <form action={toggle}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="active" value={isActive ? 'false' : 'true'} />
          <SubmitButton className="a-btn a-btn--sm" pendingLabel="…">
            {isActive ? 'ซ่อน' : 'แสดง'}
          </SubmitButton>
        </form>

        <form action={remove}>
          <input type="hidden" name="id" value={id} />
          <SubmitButton
            className="a-btn a-btn--sm a-btn--danger"
            pendingLabel="…"
            confirm={'เอารูปนี้ออกจากแกลเลอรี?\n\nไฟล์รูปยังอยู่ในคลังรูปภาพ ไม่ได้ถูกลบไปด้วย'}
          >
            ลบ
          </SubmitButton>
        </form>
      </div>

      {error && (
        <span className="a-badge" style={{ background: '#fdecec', color: '#8c1c1c' }}>
          {error}
        </span>
      )}
    </div>
  );
}
