/**
 * Where an uploaded image lands in the `media` bucket.
 *
 * These prefixes are not cosmetic. `scripts/upload-media.mjs` derives a row's
 * category by reading the key back apart (`assets/team/x.webp` → 'team'), so an
 * upload that invents its own layout would come back with the wrong category the
 * next time that script runs. The mapping below is the same rule, forwards.
 */
export const MEDIA_CATEGORIES = [
  { value: 'blog', label: 'บทความ', prefix: 'assets/media/blog' },
  { value: 'team', label: 'ทีมทันตแพทย์', prefix: 'assets/team' },
  { value: 'branches', label: 'สาขา', prefix: 'assets/branches' },
  { value: 'services', label: 'บริการ', prefix: 'assets/services' },
  { value: 'reviews', label: 'รีวิว / เคส', prefix: 'assets/reviews' },
  { value: 'gallery', label: 'แกลเลอรีผลงาน', prefix: 'gallery' },
  { value: 'hero', label: 'ภาพ Hero', prefix: 'assets/hero' },
  { value: 'media', label: 'รูปทั่วไป', prefix: 'assets/media' },
  { value: 'assets', label: 'อื่น ๆ', prefix: 'assets' },
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number]['value'];

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  MEDIA_CATEGORIES.map((c) => [c.value, c.label]),
);

export function categoryPrefix(category: string): string {
  return MEDIA_CATEGORIES.find((c) => c.value === category)?.prefix ?? 'assets';
}

/** Gallery images carry a treatment sub-folder; nothing else does. */
export const GALLERY_SUBCATS = [
  { value: 'ortho', label: 'จัดฟัน' },
  { value: 'veneer', label: 'วีเนียร์' },
  { value: 'whitening', label: 'ฟอกสีฟัน' },
  { value: 'denture', label: 'ฟันปลอม' },
  { value: 'bonding', label: 'อุดฟัน' },
  { value: 'implant', label: 'รากฟันเทียม' },
  { value: 'review', label: 'รีวิวรวมเคส' },
] as const;

/**
 * A safe, readable file stem from whatever the browser handed us.
 *
 * Thai filenames are common here and survive fine in a URL, but only after
 * percent-encoding — which turns a browsable storage path into line noise. ASCII
 * only, therefore, with a timestamp-free random suffix added by the caller so two
 * people uploading `cover.jpg` on the same day do not overwrite each other.
 */
export function safeStem(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, '');
  const ascii = withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return ascii || 'image';
}

export function buildMediaKey(opts: {
  category: string;
  galleryCat?: string | null;
  filename: string;
  suffix: string;
  extension: string;
}): string {
  const base = categoryPrefix(opts.category);
  const dir = opts.category === 'gallery' && opts.galleryCat ? `${base}/${opts.galleryCat}` : base;
  return `${dir}/${safeStem(opts.filename)}-${opts.suffix}.${opts.extension}`;
}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Mirrors the bucket's `allowed_mime_types` from migration 0001. */
export const ACCEPTED_UPLOAD_TYPES = ['image/webp', 'image/png', 'image/jpeg', 'image/svg+xml'];
