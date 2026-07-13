const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET ?? 'media';

/**
 * Resolves a media key (e.g. `assets/team/doc1.webp`) to a URL.
 *
 * Serves from Supabase Storage when NEXT_PUBLIC_SUPABASE_URL is configured,
 * and otherwise from the local `public/media` copies that `npm run media:prepare`
 * produces — so the site renders correctly before Supabase exists.
 */
export function mediaUrl(key: string): string {
  if (!key) return '';
  if (/^(https?:|data:|\/media\/)/.test(key)) return key;

  const clean = encodeURI(key.replace(/^\/+/, ''));
  return SUPABASE_URL
    ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${clean}`
    : `/media/${clean}`;
}
