// Embeds a content graphic into the body of specific articles.
//
//   node scripts/set-article-images.mjs
//
// The clinic supplied a set of square infographics; five of them map cleanly onto an
// existing article. Each is stored as a bare media key and dropped into the body_md
// after the opening paragraph, before the first "## " — so it reads as a visual summary
// up top. Both locales get it; the alt text is the translation's own title.
//
// Idempotent: an article that already carries its image is left untouched, so this is
// safe to re-run. Note the image lives in body_md, so re-importing an article from its
// JSON draft would drop it — re-run this afterwards.
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

// slug -> media key. Resolved through mediaUrl() at render, same as every other image.
const IMAGES = {
  'signs-you-need-braces': 'assets/media/blog/content/signs-you-need-braces.webp',
  'safe-teeth-whitening': 'assets/media/blog/content/safe-teeth-whitening.webp',
  'dental-veneers-guide': 'assets/media/blog/content/dental-veneers-guide.webp',
  'after-dental-implant-care': 'assets/media/blog/content/after-dental-implant-care.webp',
  'implant-vs-bridge': 'assets/media/blog/content/implant-vs-bridge.webp',
};

/** Drop `![alt](key)` in after the intro, before the first heading (or at the end). */
function withImage(body, imgKey, alt) {
  if (body.includes(`(${imgKey})`)) return null; // already present — nothing to do
  const md = `![${alt}](${imgKey})`;
  const i = body.indexOf('\n## ');
  return i === -1 ? `${body.trimEnd()}\n\n${md}\n` : `${body.slice(0, i)}\n${md}\n${body.slice(i)}`;
}

let changed = 0;
let skipped = 0;

for (const [slug, imgKey] of Object.entries(IMAGES)) {
  const { data: article, error: aErr } = await db
    .from('articles')
    .select('id')
    .eq('slug', slug)
    .single();
  if (aErr || !article) {
    console.error(`✗ ${slug}: article not found`);
    process.exit(1);
  }

  const { data: rows, error: tErr } = await db
    .from('article_translations')
    .select('locale, title, body_md')
    .eq('article_id', article.id);
  if (tErr) {
    console.error(`✗ ${slug}: ${tErr.message}`);
    process.exit(1);
  }

  for (const row of rows) {
    const next = withImage(row.body_md, imgKey, row.title);
    if (!next) {
      skipped++;
      continue;
    }
    const { error: uErr } = await db
      .from('article_translations')
      .update({ body_md: next })
      .eq('article_id', article.id)
      .eq('locale', row.locale);
    if (uErr) {
      console.error(`✗ ${slug} [${row.locale}]: ${uErr.message}`);
      process.exit(1);
    }
    console.log(`✓ ${slug.padEnd(28)} [${row.locale}] image embedded`);
    changed++;
  }
}

console.log(`\nDone — ${changed} translation(s) updated, ${skipped} already had the image.`);
