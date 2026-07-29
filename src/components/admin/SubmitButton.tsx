'use client';

import { useFormStatus } from 'react-dom';

/**
 * A submit button that disables itself while its form is in flight.
 *
 * Must be a child of the <form> it belongs to — `useFormStatus` reads the nearest
 * enclosing form, which is also why this cannot live in the same component as the
 * <form> element itself.
 */
export function SubmitButton({
  children,
  pendingLabel,
  className = 'a-btn a-btn--primary',
  confirm,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  /** When set, the click has to be confirmed before the form submits. */
  confirm?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {pending ? (pendingLabel ?? 'กำลังบันทึก…') : children}
    </button>
  );
}
