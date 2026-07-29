'use client';

import { useActionState } from 'react';
import { toggleArticleStatus } from './actions';
import { SubmitButton } from '@/components/admin/SubmitButton';
import type { FormState } from '@/lib/admin/form';

/**
 * Publish / unpublish from the list.
 *
 * Publishing can genuinely fail — an article with no author trips
 * `published_requires_attribution` — so this keeps its own action state rather
 * than firing and hoping. The error lands next to the row that caused it.
 */
export function StatusToggle({
  id,
  slug,
  status,
  publishedAt,
}: {
  id: string;
  slug: string;
  status: string;
  publishedAt: string | null;
}) {
  const [state, action] = useActionState<FormState, FormData>(toggleArticleStatus, null);
  const isPublished = status === 'published';

  return (
    <form action={action} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="published_at" value={publishedAt ?? ''} />
      <input type="hidden" name="to" value={isPublished ? 'draft' : 'published'} />

      <SubmitButton
        className="a-btn a-btn--sm"
        pendingLabel="…"
        confirm={isPublished ? 'ย้ายบทความนี้กลับเป็นฉบับร่าง? หน้าเว็บจะไม่แสดงบทความนี้อีก' : undefined}
      >
        {isPublished ? 'ซ่อน' : 'เผยแพร่'}
      </SubmitButton>

      {state?.error && (
        <span className="a-badge" style={{ background: '#fdecec', color: '#8c1c1c' }}>
          {state.error}
        </span>
      )}
    </form>
  );
}
