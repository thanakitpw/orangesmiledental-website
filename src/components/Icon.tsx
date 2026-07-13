import type { CSSProperties } from 'react';

export interface IconShape {
  /** SVG element name: 'path' | 'circle' | 'line' | 'polygon' … */
  el: string;
  attrs: Record<string, string | number>;
}

/** Shorthand for the common case of a plain <path d="…">. */
export const p = (d: string): IconShape => ({ el: 'path', attrs: { d } });

/**
 * Renders the line icons from the source components. They were built there with
 * React.createElement over raw SVG children, so shapes are kept as data here and
 * the stroke colour is passed per usage — same output, just declarative.
 */
export function Icon({
  shapes,
  stroke = 'currentColor',
  size = 26,
  strokeWidth = 1.8,
  style,
}: {
  shapes: IconShape[];
  stroke?: string;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {shapes.map((s, i) => {
        const El = s.el as 'path';
        return <El key={i} {...s.attrs} />;
      })}
    </svg>
  );
}
