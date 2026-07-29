'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { SubmitButton } from './SubmitButton';
import type { FormState } from '@/lib/admin/form';

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

/**
 * The frame around every "edit one row" screen: heading, save state, and the
 * delete panel that has to live outside the main <form> because HTML forbids
 * nesting forms and a delete button that quietly submitted the save form would be
 * worse than no delete button at all.
 *
 * Each entity supplies its own fields as children. What is shared here is only
 * what is genuinely identical — which is why the fields are not.
 */
export function EntityForm({
  id,
  title,
  subtitle,
  backHref,
  backLabel = '← กลับรายการ',
  saveAction,
  deleteAction,
  deleteLabel,
  justCreated,
  createLabel = 'สร้าง',
  updateLabel = 'บันทึกการแก้ไข',
  headerExtra,
  children,
}: {
  id: string | null;
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel?: string;
  saveAction: Action;
  deleteAction?: Action;
  /** Names the row in the delete confirmation. */
  deleteLabel?: string;
  justCreated?: boolean;
  createLabel?: string;
  updateLabel?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [state, action] = useActionState<FormState, FormData>(saveAction, null);
  const [deleteState, runDelete] = useActionState<FormState, FormData>(
    deleteAction ?? (async () => null),
    null,
  );

  return (
    <>
      <div className="a-head">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="a-actions">
          <Link className="a-btn" href={backHref}>
            {backLabel}
          </Link>
          {headerExtra}
        </div>
      </div>

      {justCreated && <div className="a-note a-note--ok">สร้างเรียบร้อยแล้ว</div>}
      {state?.error && <div className="a-note a-note--err">{state.error}</div>}
      {state?.ok && <div className="a-note a-note--ok">{state.ok}</div>}
      {deleteState?.error && <div className="a-note a-note--err">{deleteState.error}</div>}

      <form action={action}>
        <input type="hidden" name="id" value={id ?? ''} />
        {children}

        <div className="a-actions">
          <SubmitButton>{id ? updateLabel : createLabel}</SubmitButton>
          <Link className="a-btn" href={backHref}>
            ยกเลิก
          </Link>
        </div>
      </form>

      {id && deleteAction && (
        <form action={runDelete} className="a-panel" style={{ marginTop: 24 }}>
          <input type="hidden" name="id" value={id} />
          <h2>ลบรายการนี้</h2>
          <p>
            ลบแล้วกู้คืนไม่ได้ ถ้าแค่ต้องการเอาออกจากหน้าเว็บชั่วคราว ให้กลับไปหน้ารายการแล้วกด “ซ่อน”
            แทน — ข้อมูลจะยังอยู่ครบและเปิดกลับได้ทันที
          </p>
          <SubmitButton
            className="a-btn a-btn--danger"
            pendingLabel="กำลังลบ…"
            confirm={`ลบ "${deleteLabel ?? 'รายการนี้'}" อย่างถาวร?`}
          >
            ลบถาวร
          </SubmitButton>
        </form>
      )}
    </>
  );
}
