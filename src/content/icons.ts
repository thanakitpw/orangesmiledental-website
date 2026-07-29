import { p, type IconShape } from '@/components/Icon';

/**
 * The line icons a service or perk can use, addressed by name.
 *
 * These stay in code while everything else about a service moves to the database,
 * and that is a deliberate line rather than an omission. An icon is a set of SVG
 * path commands — `M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3…` — and a
 * text box holding that string is not a feature anyone at a dental clinic can use.
 * It is, however, an excellent way to render a blank square on the home page. So
 * the admin offers a dropdown of these, and adding a genuinely new icon stays a
 * developer's job: one entry here.
 *
 * Names describe the drawing, not the service, so `whitening` can switch to a
 * different mark without the key becoming a lie.
 */
export const SERVICE_ICONS: Record<string, IconShape[]> = {
  'heart-pulse': [
    p('M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z'),
    p('M3.5 12H8l1-2 2 5 2-7 1.4 4H21'),
  ],
  heart: [
    p('M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z'),
  ],
  smiley: [
    { el: 'circle', attrs: { cx: 12, cy: 12, r: 10 } },
    p('M8 14s1.5 2 4 2 4-2 4-2'),
    { el: 'line', attrs: { x1: 9, y1: 9, x2: 9.01, y2: 9 } },
    { el: 'line', attrs: { x1: 15, y1: 9, x2: 15.01, y2: 9 } },
  ],
  'implant-post': [
    { el: 'circle', attrs: { cx: 12, cy: 5, r: 3 } },
    { el: 'line', attrs: { x1: 12, y1: 22, x2: 12, y2: 8 } },
    p('M5 12H2a10 10 0 0 0 20 0h-3'),
  ],
  'implant-stem': [
    p('M12 5v14'),
    p('M5 12H2a10 10 0 0 0 20 0h-3'),
    p('M12 5a3 3 0 1 0 0-3 3 3 0 0 0 0 3'),
  ],
  'shield-check': [
    p('M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'),
    p('m9 12 2 2 4-4'),
  ],
  'shield-plus': [p('M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5z'), p('M9 12h6M12 9v6')],
  'shield-tick': [p('M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5z'), p('m9 12 2 2 4-4')],
  crown: [p('m2 4 3.5 13h13L22 4l-5.5 6L12 3 7.5 10z'), p('M5.5 21h13')],
  case: [
    p('M3 7h18M3 7l1 12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2l1-12'),
    p('M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'),
  ],
  'sparkle-star': [
    p('M9.9 15.5 8.5 14 2.4 12.4a.5.5 0 0 1 0-1L8.5 9.9 9.9 3.8a.5.5 0 0 1 1 0l1.5 6.1 6.1 1.5a.5.5 0 0 1 0 1l-6.1 1.5-1.5 6.1a.5.5 0 0 1-1 0z'),
    p('M20 3v4M22 5h-4'),
  ],
  sparkle: [
    p('M9.9 15.5 8.5 14l-6.1-1.6a.5.5 0 0 1 0-1L8.5 9.9 9.9 3.8a.5.5 0 0 1 1 0l1.5 6.1 6.1 1.5a.5.5 0 0 1 0 1l-6.1 1.5-1.5 6.1a.5.5 0 0 1-1 0z'),
  ],
  sun: [
    { el: 'circle', attrs: { cx: 12, cy: 12, r: 4 } },
    p('M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4'),
  ],
  'sun-rays': [
    p('M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4'),
    p('M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8'),
  ],
  'drop-plus': [p('M12 22s-8-6-8-12a8 8 0 0 1 16 0c0 6-8 12-8 12Z'), p('M12 8v6')],
  family: [
    p('M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'),
    p('M15 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'),
    p('M12 14c-3 0-6 2-6 5h12c0-3-3-5-6-5Z'),
  ],
  card: [p('M3 7h18v10H3z'), p('M3 11h18')],
  chat: [
    p('M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z'),
  ],
};

export type ServiceIconName = keyof typeof SERVICE_ICONS;

/** For the admin dropdown: every name, with a label an editor can recognise. */
export const ICON_OPTIONS: { value: string; label: string }[] = [
  { value: 'heart-pulse', label: 'หัวใจ + คลื่นชีพจร' },
  { value: 'heart', label: 'หัวใจ' },
  { value: 'smiley', label: 'หน้ายิ้ม' },
  { value: 'implant-post', label: 'รากเทียม (หัวกลม)' },
  { value: 'implant-stem', label: 'รากเทียม (แกนตรง)' },
  { value: 'shield-check', label: 'โล่ + ถูก' },
  { value: 'shield-plus', label: 'โล่ + บวก' },
  { value: 'shield-tick', label: 'โล่ + เครื่องหมายถูก' },
  { value: 'crown', label: 'มงกุฎ / ครอบฟัน' },
  { value: 'case', label: 'กระเป๋าเครื่องมือ' },
  { value: 'sparkle-star', label: 'ประกาย + ดาว' },
  { value: 'sparkle', label: 'ประกาย' },
  { value: 'sun', label: 'ดวงอาทิตย์ (วงกลมทึบ)' },
  { value: 'sun-rays', label: 'ดวงอาทิตย์ (รัศมี)' },
  { value: 'drop-plus', label: 'หยดน้ำ' },
  { value: 'family', label: 'ครอบครัว / เด็ก' },
  { value: 'card', label: 'บัตรเครดิต' },
  { value: 'chat', label: 'กล่องข้อความ' },
];

/** Unknown names fall back to a neutral mark rather than rendering nothing. */
export function iconShapes(name: string | null | undefined): IconShape[] {
  return (name && SERVICE_ICONS[name]) || SERVICE_ICONS.heart;
}
