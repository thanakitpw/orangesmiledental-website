/**
 * Compresses every source image into public/media as WebP, extracts the hero
 * cover that was embedded as base64 in the designer's image-slot state, and
 * writes:
 *   - public/media/manifest.json  (source path -> media key, consumed by media:upload)
 *   - src/content/gallery.generated.ts  (ordered gallery list for the Reviews page)
 *
 * Safe to re-run: unchanged outputs are skipped.
 */
import { readFile, writeFile, mkdir, readdir, stat, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { GALLERY_GROUPS, GALLERY_CATS } from './media-groups.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'Website creation request');
const OUT = path.join(ROOT, 'public', 'media');

const manifest = [];
let converted = 0;
let skipped = 0;

/** Encode one image to WebP at `key` under public/media. */
async function emit(sourceFile, key, { maxWidth = 1800, quality = 82 } = {}) {
  const dest = path.join(OUT, key);
  await mkdir(path.dirname(dest), { recursive: true });

  // Skip if the output is newer than the source.
  if (existsSync(dest)) {
    const [s, d] = await Promise.all([stat(sourceFile), stat(dest)]);
    if (d.mtimeMs >= s.mtimeMs) {
      manifest.push({ key, source: path.relative(SRC, sourceFile) });
      skipped++;
      return;
    }
  }

  if (key.endsWith('.svg')) {
    await copyFile(sourceFile, dest);
  } else {
    await sharp(sourceFile)
      .rotate() // honour EXIF orientation before we strip metadata
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(dest);
  }

  manifest.push({ key, source: path.relative(SRC, sourceFile) });
  converted++;
  if (converted % 25 === 0) process.stdout.write(`  …${converted} converted\n`);
}

/**
 * The hero cover. The designer baked a low-res (1200px) copy into the slot state as a
 * base64 data URI; with withoutEnlargement that capped the output at 1200px, and it read
 * visibly soft — "แตก" — on retina desktops where the banner is drawn ~1200 CSS px wide.
 * The real composite is the 8000px original under uploads/, so resize that instead, down
 * to a retina-friendly 2400px.
 *
 * The key is version-tagged (-2x) on purpose: the old object ships with a one-year
 * immutable cache-control, so a browser that already has it will only re-fetch under a
 * URL it has never seen.
 */
async function emitHeroCover() {
  const key = 'assets/hero/home-hero-cover-2x.webp';
  const original = path.join(SRC, 'uploads', 'home-hero-source.jpg');

  let source = original;
  let sourceLabel = path.relative(SRC, original);
  if (!existsSync(original)) {
    // Fallback: the low-res copy embedded in the slot state.
    const state = JSON.parse(await readFile(path.join(SRC, '.image-slots.state.json'), 'utf8'));
    const dataUri = state['home-hero-cover']?.u;
    if (!dataUri) {
      console.warn('!  no hero source found — hero will be blank');
      return;
    }
    source = Buffer.from(dataUri.slice(dataUri.indexOf(',') + 1), 'base64');
    sourceLabel = '.image-slots.state.json#home-hero-cover';
  }

  const dest = path.join(OUT, key);
  await mkdir(path.dirname(dest), { recursive: true });
  await sharp(source)
    .rotate() // honour EXIF orientation before metadata is stripped
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(dest);
  manifest.push({ key, source: sourceLabel });
  converted++;
  console.log('✓ hero cover extracted (2400px from the original)');
}

/** Walk assets/** and mirror it into public/media/assets/**, swapping raster ext -> .webp. */
async function emitAssets(dir = 'assets') {
  const abs = path.join(SRC, dir);
  for (const entry of await readdir(abs, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const rel = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) {
      await emitAssets(rel);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) continue;
    const key = ext === '.svg' ? rel : rel.replace(/\.(png|jpe?g|webp)$/i, '.webp');
    await emit(path.join(abs, entry.name), key);
  }
}

/** Gallery files carry Thai names; re-key them to ASCII `gallery/<cat>/NNN.webp`. */
async function emitGallery() {
  const counters = {};
  const items = [];
  for (const [cat, dir, files] of GALLERY_GROUPS) {
    for (const file of files) {
      const source = path.join(SRC, 'uploads', 'หัตถการ', dir, file);
      if (!existsSync(source)) {
        console.warn(`!  missing gallery file, skipping: ${dir}${file}`);
        continue;
      }
      counters[cat] = (counters[cat] ?? 0) + 1;
      const key = `gallery/${cat}/${String(counters[cat]).padStart(3, '0')}.webp`;
      await emit(source, key, { maxWidth: 1200, quality: 78 });
      items.push({ key, cat });
    }
  }
  return items;
}

/** The Reviews gallery is data, not layout — generate it so it can't drift from disk. */
async function writeGalleryModule(items) {
  const body = items.map((i) => `  { img: '${i.key}', cat: '${i.cat}' },`).join('\n');
  const cats = Object.entries(GALLERY_CATS)
    .map(([k, v]) => `  ${k}: { th: '${v.th}', en: '${v.en}' },`)
    .join('\n');

  const file = `// GENERATED by scripts/prepare-media.mjs — do not edit by hand.
// Regenerate with: npm run media:prepare

export type GalleryCat = keyof typeof GALLERY_CATS;

export const GALLERY_CATS = {
${cats}
} as const;

export interface GalleryItem {
  img: string;
  cat: GalleryCat;
}

export const GALLERY: GalleryItem[] = [
${body}
];
`;
  const dest = path.join(ROOT, 'src', 'content', 'gallery.generated.ts');
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, file);
  console.log(`✓ src/content/gallery.generated.ts — ${items.length} gallery images`);
}

console.log('Preparing media…');
await mkdir(OUT, { recursive: true });
await emitHeroCover();
await emitAssets();
const galleryItems = await emitGallery();
await writeGalleryModule(galleryItems);

manifest.sort((a, b) => a.key.localeCompare(b.key));
await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(`\n✓ ${converted} converted, ${skipped} up-to-date, ${manifest.length} files in manifest`);
console.log('  Next: npm run media:upload  (pushes public/media -> Supabase Storage)');
