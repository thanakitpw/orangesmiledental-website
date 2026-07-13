/**
 * Pushes public/media -> Supabase Storage (bucket `media`) and indexes every
 * file in the `media_assets` table.
 *
 * Prereqs:
 *   1. Run supabase/migrations/0001_media.sql against your project.
 *   2. Fill NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.
 *   3. npm run media:prepare   (produces public/media + manifest.json)
 *
 * Then: npm run media:upload
 *
 * Idempotent — re-running upserts rather than duplicating.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import 'dotenv/config';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA_DIR = path.join(ROOT, 'public', 'media');
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET ?? 'media';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n' +
      'Copy .env.example to .env and fill them in (Supabase dashboard → Project Settings → API).',
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const CONTENT_TYPES = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

/** 'assets/team/doc1.webp' -> 'team'; 'gallery/ortho/001.webp' -> 'gallery'. */
function categorize(key) {
  const parts = key.split('/');
  if (parts[0] === 'gallery') return { category: 'gallery', galleryCat: parts[1] };
  // assets/<group>/<file> — the group is the meaningful bucket (team, branches, …).
  if (parts[0] === 'assets' && parts.length >= 3) {
    // assets/media/blog/x.webp nests one deeper.
    const group = parts[1] === 'media' && parts[2] === 'blog' ? 'blog' : parts[1];
    return { category: group, galleryCat: null };
  }
  return { category: parts[0] ?? 'misc', galleryCat: null };
}

const manifest = JSON.parse(await readFile(path.join(MEDIA_DIR, 'manifest.json'), 'utf8'));
console.log(`Uploading ${manifest.length} files to ${url} (bucket: ${BUCKET})…\n`);

// Gallery ordering must survive the round-trip, so number within each category.
const galleryCounters = {};
const rows = [];
let uploaded = 0;
let failed = 0;

for (const entry of manifest) {
  const { key, source } = entry;
  const abs = path.join(MEDIA_DIR, key);
  const ext = path.extname(key).toLowerCase();
  const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream';

  let body;
  try {
    body = await readFile(abs);
  } catch {
    console.warn(`!  missing locally, skipping: ${key}`);
    failed++;
    continue;
  }

  const { error } = await supabase.storage.from(BUCKET).upload(key, body, {
    contentType,
    upsert: true,
    cacheControl: '31536000', // immutable marketing assets
  });

  if (error) {
    console.error(`✗ ${key}: ${error.message}`);
    failed++;
    continue;
  }

  const { category, galleryCat } = categorize(key);
  let sortOrder = 0;
  if (galleryCat) {
    galleryCounters[galleryCat] = (galleryCounters[galleryCat] ?? 0) + 1;
    sortOrder = galleryCounters[galleryCat];
  }

  let width = null;
  let height = null;
  if (ext !== '.svg') {
    try {
      const meta = await sharp(body).metadata();
      width = meta.width ?? null;
      height = meta.height ?? null;
    } catch {
      /* dimensions are nice-to-have, not required */
    }
  }

  rows.push({
    key,
    category,
    gallery_cat: galleryCat,
    sort_order: sortOrder,
    width,
    height,
    bytes: body.length,
    source_path: source,
  });

  uploaded++;
  if (uploaded % 25 === 0) process.stdout.write(`  …${uploaded}/${manifest.length}\n`);
}

console.log(`\nIndexing ${rows.length} rows in media_assets…`);
for (let i = 0; i < rows.length; i += 100) {
  const chunk = rows.slice(i, i + 100);
  const { error } = await supabase.from('media_assets').upsert(chunk, { onConflict: 'key' });
  if (error) {
    console.error(`✗ media_assets upsert failed: ${error.message}`);
    process.exit(1);
  }
}

console.log(`\n✓ ${uploaded} uploaded, ${failed} failed, ${rows.length} indexed`);
console.log(
  `  Images now resolve from ${url}/storage/v1/object/public/${BUCKET}/…\n` +
    '  Restart `npm run dev` so the app picks up NEXT_PUBLIC_SUPABASE_URL.',
);
