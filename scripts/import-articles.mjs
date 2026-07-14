// Imports drafted articles into Supabase.
//
//   node scripts/import-articles.mjs <dir-of-json> [--publish]
//
// Every article is screened before it goes anywhere near the database. These are
// health articles written by a language model and not yet read by a dentist, so
// the screen looks for the specific ways that content goes wrong: a drug with a
// dose attached, a promised outcome, an invented citation, or a named clinician
// implying a review that never happened. A hit blocks the import — it does not
// warn and continue.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const DIR = process.argv[2];
const PUBLISH = process.argv.includes('--publish');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!DIR || !url || !key) {
  console.error('usage: node scripts/import-articles.mjs <dir> [--publish]');
  console.error('needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const AUTHOR = 'ทีมงาน Orange Smile Dental';

/** Language-neutral facts about each piece. Order here is the order on the page. */
const META = {
  'signs-you-need-braces':        { cat: 'ortho',     cover: 'cover-ortho.webp',        date: '2026-06-12', featured: true },
  'after-dental-implant-care':    { cat: 'implants',  cover: 'cover-implant-care.webp', date: '2026-06-05' },
  'safe-teeth-whitening':         { cat: 'aesthetic', cover: 'cover-whitening.webp',    date: '2026-05-28' },
  'clear-aligners-vs-metal-braces': { cat: 'ortho',   cover: 'cover-clear-metal.webp',  date: '2026-05-20' },
  'dental-veneers-guide':         { cat: 'aesthetic', cover: 'cover-veneer.webp',       date: '2026-05-14' },
  'childs-first-dental-visit':    { cat: 'pediatric', cover: 'cover-pediatric.webp',    date: '2026-05-08' },
  'toothache-at-night':           { cat: 'general',   cover: 'cover-night-pain.webp',   date: '2026-05-02' },
  'how-often-dental-scaling':     { cat: 'general',   cover: 'cover-scaling.webp',      date: '2026-04-25' },
  'implant-vs-bridge':            { cat: 'implants',  cover: 'cover-bridge.webp',       date: '2026-04-18' },
  'cleaning-teeth-with-braces':   { cat: 'ortho',     cover: 'cover-braces-clean.webp', date: '2026-04-10' },
};

// `negatable` marks a phrase that is only a problem when it is asserted. "ไม่มีการ
// รักษาใดที่รับประกันผลได้" is the honest sentence we want; "รับประกันผล" on its own
// is the advertising claim we do not. The screen reads the words in front of the
// match before deciding, rather than banning the vocabulary outright.
const SCREENS = [
  {
    label: 'a drug named with a dose',
    // "ibuprofen 400 mg", "พาราเซตามอล 500 มก." — no trailing \b: a Thai
    // abbreviation ends in "." and a word boundary can never follow it.
    re: /\d+\s?(mg|มก\.|มิลลิกรัม|ml|มล\.|grams?)/i,
  },
  {
    label: 'a bleaching concentration',
    re: /(peroxide|เปอร์ออกไซด์|ไฮโดรเจน)[^.\n]{0,40}\d+\s?%|\d+\s?%[^.\n]{0,20}(peroxide|เปอร์ออกไซด์)/i,
  },
  {
    label: 'a guaranteed outcome',
    re: /(หายขาด|ได้ผล\s?100\s?%|รับประกันผล|ขาวถาวร|การันตีผล|guaranteed result|permanently white)/i,
    negatable: true,
  },
  {
    label: 'a named clinician (implies a review that has not happened)',
    re: /(ทพ\.|ทพญ\.|ท\.\d{3,}|\bDr\.?\s+[A-Z][a-z]+|นพ\.)/,
  },
  {
    label: 'a citation to a study that cannot be checked',
    re: /(จากงานวิจัย|ผลการศึกษาพบว่า|งานวิจัยระบุ|a study (found|showed)|research shows that)/i,
  },
  {
    label: 'a price',
    re: /(\d[\d,]{2,}\s?(บาท|฿|THB)|ราคาเริ่มต้นที่\s?\d)/i,
  },
];

const NEGATION = /(ไม่|มิได้|ปราศจาก|no |not |never |cannot |can't )[^.\n]{0,30}$/i;

// Reviewed exceptions. A phrase only lands here after a human has read the sentence
// it sits in and judged it sound — and the reason is written down, so the next
// person can disagree. Loosening a regex would waive the check for every future
// article; this waives it for one sentence, on the record.
const ALLOW = [
  {
    slug: 'safe-teeth-whitening',
    locale: 'en',
    phrase: 'permanently white',
    why: 'appears in the "who should not whiten" list — "Anyone expecting permanently white, porcelain-bright teeth" — it warns against the expectation rather than promising it',
  },
];

function screen(slug, locale, text) {
  const hits = [];
  for (const s of SCREENS) {
    const re = new RegExp(s.re.source, s.re.flags.includes('g') ? s.re.flags : s.re.flags + 'g');
    for (const m of text.matchAll(re)) {
      const found = m[0].trim();
      const before = text.slice(Math.max(0, m.index - 40), m.index);

      if (s.negatable && NEGATION.test(before)) continue; // a denial, not a claim

      const waived = ALLOW.find(
        (a) => a.slug === slug && a.locale === locale && found.toLowerCase().includes(a.phrase.toLowerCase()),
      );
      if (waived) {
        console.log(`  ⚠️  ยกเว้นให้: ${slug} [${locale}] "${found}" — ${waived.why}`);
        continue;
      }

      hits.push(`  ✗ ${slug} [${locale}] ${s.label} → "…${before.slice(-25).trim()} 〔${found}〕…"`);
      break; // one hit per screen is enough to block
    }
  }
  return hits;
}

// ---- load ------------------------------------------------------------------

const posts = [];
for (const f of readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()) {
  const parsed = JSON.parse(readFileSync(join(DIR, f), 'utf8'));
  posts.push(...(Array.isArray(parsed) ? parsed : [parsed]));
}
console.log(`อ่านบทความได้ ${posts.length} เรื่อง จาก ${DIR}\n`);

// ---- screen ----------------------------------------------------------------

const problems = [];
for (const p of posts) {
  if (!META[p.slug]) problems.push(`  ✗ ${p.slug} — ไม่รู้จัก slug นี้ (ไม่มีใน META)`);
  for (const loc of ['th', 'en']) {
    const b = p[loc];
    if (!b) {
      problems.push(`  ✗ ${p.slug} — ขาดภาษา ${loc}`);
      continue;
    }
    problems.push(...screen(p.slug, loc, [b.title, b.excerpt, b.body_md, ...(b.faq ?? []).flatMap((f) => [f.q, f.a])].join('\n')));
    if (!b.body_md || b.body_md.length < 1500) {
      problems.push(`  ✗ ${p.slug} [${loc}] — เนื้อหาสั้นผิดปกติ (${b.body_md?.length ?? 0} ตัวอักษร)`);
    }
  }
}

if (problems.length) {
  console.error('ด่านตรวจไม่ผ่าน — ไม่ import อะไรทั้งสิ้น:\n');
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('✅ ด่านตรวจผ่านทุกเรื่อง (ไม่มีขนาดยา ความเข้มข้น คำการันตี ชื่อหมอ งานวิจัยลอย หรือราคา)\n');

// ---- write -----------------------------------------------------------------

for (const p of posts) {
  const m = META[p.slug];
  const row = {
    slug: p.slug,
    category: m.cat,
    cover_key: `assets/media/blog/${m.cover}`,
    featured: !!m.featured,
    author_name: AUTHOR,
    author_credentials: null,
    // reviewer_* stay null. They get filled in when a dentist has actually read
    // the article — never from this script.
    status: PUBLISH ? 'published' : 'draft',
    published_at: PUBLISH ? `${m.date}T09:00:00Z` : null,
  };

  const { data, error } = await db.from('articles').upsert(row, { onConflict: 'slug' }).select('id').single();
  if (error) {
    console.error(`✗ ${p.slug}: ${error.message}`);
    process.exit(1);
  }

  const translations = ['th', 'en'].map((loc) => ({
    article_id: data.id,
    locale: loc,
    title: p[loc].title,
    excerpt: p[loc].excerpt,
    body_md: p[loc].body_md,
    meta_title: p[loc].meta_title,
    meta_description: p[loc].meta_description,
    keywords: p[loc].keywords ?? [],
    faq: p[loc].faq ?? [],
    reading_minutes: p[loc].reading_minutes ?? 4,
  }));

  const { error: tErr } = await db
    .from('article_translations')
    .upsert(translations, { onConflict: 'article_id,locale' });
  if (tErr) {
    console.error(`✗ ${p.slug} (แปล): ${tErr.message}`);
    process.exit(1);
  }

  const words = p.th.body_md.length;
  console.log(`✅ ${p.slug.padEnd(32)} ${row.status.padEnd(9)} ${String(words).padStart(5)} ตัวอักษร · FAQ ${p.th.faq.length} ข้อ`);
}

console.log(`\nเสร็จ ${posts.length} เรื่อง${PUBLISH ? ' — เผยแพร่แล้ว' : ' — เก็บเป็นฉบับร่าง (ใส่ --publish เพื่อเผยแพร่)'}`);
