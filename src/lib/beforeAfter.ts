'use client';

import { useCallback, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

/**
 * Drag-to-compare state for the before/after sliders.
 *
 * Positions are keyed per card, so several sliders can coexist on a page and
 * only the one under the pointer moves. Ported from the pointer-capture logic in
 * the source components.
 *
 * @param start initial divider position, as a percentage
 */
export function useBeforeAfter(start = 50) {
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [interacted, setInteracted] = useState(false);
  const dragging = useRef<string | null>(null);

  const update = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const key = el.getAttribute('data-key');
    if (!key) return;
    const r = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    setPositions((prev) => ({ ...prev, [key]: pct }));
    setInteracted(true);
  }, []);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      dragging.current = e.currentTarget.getAttribute('data-key');
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* unsupported */
      }
      update(e);
    },
    [update],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (dragging.current && dragging.current === e.currentTarget.getAttribute('data-key')) {
        update(e);
      }
    },
    [update],
  );

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* unsupported */
    }
  }, []);

  /** Divider offset + the clip-path that reveals the "before" image up to it. */
  const posOf = useCallback(
    (key: string) => {
      const pos = positions[key] ?? start;
      return { posPct: `${pos}%`, clip: `inset(0 ${100 - pos}% 0 0)` };
    },
    [positions, start],
  );

  const handlers = { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };

  return { posOf, handlers, interacted };
}
