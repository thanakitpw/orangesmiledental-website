'use client';

import { useActionState } from 'react';
import { SubmitButton } from '@/components/admin/SubmitButton';
import type { FormState } from '@/lib/admin/form';

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

/**
 * One row of a short list, edited in place.
 *
 * The perks and the process steps are three and eight rows of four short fields.
 * Giving each its own list page plus edit page would be four more routes to
 * navigate for something that fits on one screen — so they are edited where they
 * are shown, one small form per row.
 */
export function InlineRowForm({
  id,
  heading,
  saveAction,
  deleteAction,
  deleteLabel,
  children,
}: {
  id: string | null;
  heading: string;
  saveAction: Action;
  deleteAction?: Action;
  deleteLabel?: string;
  children: React.ReactNode;
}) {
  const [state, action] = useActionState<FormState, FormData>(saveAction, null);
  const [deleteState, runDelete] = useActionState<FormState, FormData>(
    deleteAction ?? (async () => null),
    null,
  );

  return (
    <div className="a-repeat__item">
      <div className="a-repeat__head">
        <span>{heading}</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {state?.ok && <span className="a-badge a-badge--ok">{state.ok}</span>}
          {(state?.error || deleteState?.error) && (
            <span className="a-badge" style={{ background: '#fdecec', color: '#8c1c1c' }}>
              {state?.error ?? deleteState?.error}
            </span>
          )}
        </span>
      </div>

      <form action={action}>
        <input type="hidden" name="id" value={id ?? ''} />
        {children}
        <SubmitButton className="a-btn a-btn--sm a-btn--primary">
          {id ? 'บันทึก' : 'เพิ่ม'}
        </SubmitButton>
      </form>

      {id && deleteAction && (
        <form action={runDelete} style={{ marginTop: 8 }}>
          <input type="hidden" name="id" value={id} />
          <SubmitButton
            className="a-btn a-btn--sm a-btn--danger"
            pendingLabel="…"
            confirm={`ลบ "${deleteLabel ?? heading}" ถาวร?`}
          >
            ลบ
          </SubmitButton>
        </form>
      )}
    </div>
  );
}
