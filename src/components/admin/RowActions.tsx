'use client';

import { useActionState } from 'react';
import { SubmitButton } from './SubmitButton';
import type { FormState } from '@/lib/admin/form';

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

/**
 * Reorder / show / hide / delete, for one row of any content list.
 *
 * The actions arrive as props rather than being imported: Server Actions are
 * passable values, so each entity hands in its own three and this component stays
 * ignorant of which table it is operating on. That is what keeps seven list pages
 * from carrying seven copies of the same four buttons.
 */
export function RowActions({
  id,
  isActive,
  label,
  onMove,
  onToggle,
  onDelete,
  first,
  last,
}: {
  id: string;
  isActive: boolean;
  /** Names the row in the delete confirmation, so it cannot be misread. */
  label: string;
  onMove: Action;
  onToggle: Action;
  onDelete: Action;
  first: boolean;
  last: boolean;
}) {
  const [moveState, moveAction] = useActionState<FormState, FormData>(onMove, null);
  const [toggleState, toggleAction] = useActionState<FormState, FormData>(onToggle, null);
  const [deleteState, deleteAction] = useActionState<FormState, FormData>(onDelete, null);

  const error = moveState?.error ?? toggleState?.error ?? deleteState?.error;

  return (
    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
      <form action={moveAction} style={{ display: 'flex', gap: 5 }}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <button className="a-btn a-btn--sm" type="submit" disabled={first} aria-label="เลื่อนขึ้น">
          ↑
        </button>
      </form>

      <form action={moveAction} style={{ display: 'flex', gap: 5 }}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <button className="a-btn a-btn--sm" type="submit" disabled={last} aria-label="เลื่อนลง">
          ↓
        </button>
      </form>

      <form action={toggleAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="active" value={isActive ? 'false' : 'true'} />
        <SubmitButton className="a-btn a-btn--sm" pendingLabel="…">
          {isActive ? 'ซ่อน' : 'แสดง'}
        </SubmitButton>
      </form>

      <form action={deleteAction}>
        <input type="hidden" name="id" value={id} />
        <SubmitButton
          className="a-btn a-btn--sm a-btn--danger"
          pendingLabel="…"
          confirm={`ลบ "${label}" ถาวร?\n\nถ้าแค่อยากเอาออกจากหน้าเว็บชั่วคราว ให้กด "ซ่อน" แทน — ข้อมูลจะยังอยู่ครบ`}
        >
          ลบ
        </SubmitButton>
      </form>

      {error && (
        <span className="a-badge" style={{ background: '#fdecec', color: '#8c1c1c' }}>
          {error}
        </span>
      )}
    </div>
  );
}
