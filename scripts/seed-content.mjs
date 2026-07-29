/**
 * Moves the hardcoded site content out of src/content/*.ts and into the tables
 * that migration 0006 created.
 *
 * Reads the TypeScript modules directly rather than restating their contents as
 * SQL, so the seed cannot drift from the design it was ported from — a hand-typed
 * copy of 14 doctors and 54 gallery images is a typo waiting to reach production.
 *
 * Idempotent by refusal: a table that already has rows is skipped, never
 * overwritten. Once the clinic has edited a doctor's bio, this script must not be
 * able to stamp the original back over it.
 *
 *   npm run content:seed
 */
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

import { DOCTORS, HERO_FACES } from '../src/content/doctors.ts';
import { BRANCHES } from '../src/content/branches.ts';
import { REVIEWS } from '../src/content/reviews.ts';
import { CASES } from '../src/content/cases.ts';
import { GALLERY, GALLERY_CATS } from '../src/content/gallery.generated.ts';
import { SERVICES, HOME_SERVICES, SERVICE_PERKS, HOME_STEPS, SERVICE_STEPS } from '../src/content/services.ts';
import { SITE } from '../src/content/site.ts';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

/** Insert only into an empty table. Returns what happened, for the summary. */
async function seed(table, rows) {
  const { count, error: countError } = await db.from(table).select('*', { count: 'exact', head: true });
  if (countError) return { table, status: 'error', detail: countError.message };
  if (count > 0) return { table, status: 'skipped', detail: `มีอยู่แล้ว ${count} แถว` };

  const { error } = await db.from(table).insert(rows);
  if (error) return { table, status: 'error', detail: error.message };
  return { table, status: 'seeded', detail: `${rows.length} แถว` };
}

// ------------------------------------------------------------------- settings
const settings = [
  {
    id: 1,
    phone: SITE.phone,
    tel_url: SITE.telUrl,
    line_url: SITE.lineUrl,
    fb_url: SITE.fbUrl,
    email: SITE.email,
    legal_name_th: SITE.legalName.th,
    legal_name_en: SITE.legalName.en,
    address_th: SITE.address.th,
    address_en: SITE.address.en,
    hours_th: SITE.hours.th,
    hours_en: SITE.hours.en,
  },
];

// ------------------------------------------------------------------- branches
const branches = BRANCHES.map((b, i) => ({
  key: b.key,
  region: b.region,
  brand: b.brand,
  accent: b.accent,
  tint: b.tint,
  photo: b.photo,
  name_th: b.name.th,
  name_en: b.name.en,
  area_th: b.area.th,
  area_en: b.area.en,
  address_th: b.address.th,
  address_en: b.address.en,
  hours_th: b.hours.th,
  hours_en: b.hours.en,
  phone: b.phone,
  tel_url: b.telUrl,
  line_url: b.lineUrl,
  line: b.line,
  fb_url: b.fbUrl,
  coords: b.coords,
  map_url: b.mapUrl,
  sort_order: i,
}));

// -------------------------------------------------------------------- doctors
const heroFaces = new Set(HERO_FACES);
const doctors = DOCTORS.map((d, i) => ({
  name: d.name,
  photo: d.photo,
  role_th: d.role.th,
  role_en: d.role.en,
  bio_th: d.bio.th,
  bio_en: d.bio.en,
  tags: d.tags,
  hero_face: heroFaces.has(d.photo),
  sort_order: i,
}));

// -------------------------------------------------------------------- reviews
const reviews = REVIEWS.map((r, i) => ({
  initial: r.init,
  name_th: r.name.th,
  name_en: r.name.en,
  text_th: r.txt.th,
  text_en: r.txt.en,
  service_th: r.svc.th,
  service_en: r.svc.en,
  branch_th: r.br.th,
  branch_en: r.br.en,
  sort_order: i,
}));

// ---------------------------------------------------------------------- cases
const cases = CASES.map((c, i) => ({
  category: c.key,
  cat_label_th: c.catLabel.th,
  cat_label_en: c.catLabel.en,
  code: c.code,
  accent: c.accent,
  tint: c.tint,
  before_key: c.before,
  after_key: c.after,
  title_th: c.title.th,
  title_en: c.title.en,
  title_long_th: c.titleLong.th,
  title_long_en: c.titleLong.en,
  quote_th: c.quote.th,
  quote_en: c.quote.en,
  doctor_th: c.doctor.th,
  doctor_en: c.doctor.en,
  branch_th: c.branch.th,
  branch_en: c.branch.en,
  sort_order: i,
}));

// -------------------------------------------------------------------- gallery
const galleryCats = Object.entries(GALLERY_CATS).map(([key, label], i) => ({
  key,
  label_th: label.th,
  label_en: label.en,
  sort_order: i,
}));

const galleryItems = GALLERY.map((g, i) => ({ img: g.img, cat: g.cat, sort_order: i }));

// ------------------------------------------------------------------- services
/**
 * Which icon each card uses, by name.
 *
 * The source arrays hold raw SVG path data, and the home card and the Services
 * card for the same treatment often use *different* marks — orthodontics is a
 * smiley on the home page and a shield on the Services page. That difference is
 * part of the design, so it is preserved rather than normalised away.
 */
const ICONS = {
  general: { home: 'heart-pulse', page: 'heart' },
  ortho: { home: 'smiley', page: 'shield-plus' },
  implant: { home: 'implant-post', page: 'implant-stem' },
  rootcanal: { home: 'shield-check', page: 'drop-plus' },
  prostho: { home: 'crown', page: 'case' },
  veneer: { home: 'sparkle-star', page: 'sparkle' },
  whitening: { home: 'sun', page: 'sun-rays' },
  pediatric: { home: 'shield-plus', page: 'family' },
};

/** Both arrays are in the same treatment order; this is that order, named. */
const SERVICE_KEYS = [
  'general',
  'ortho',
  'implant',
  'rootcanal',
  'prostho',
  'veneer',
  'whitening',
  'pediatric',
];

if (SERVICES.length !== SERVICE_KEYS.length || HOME_SERVICES.length !== SERVICE_KEYS.length) {
  console.error(
    `Service list length changed (page ${SERVICES.length}, home ${HOME_SERVICES.length}, keys ${SERVICE_KEYS.length}).\n` +
      'Update SERVICE_KEYS in this script before seeding — pairing them by index is only safe while they match.',
  );
  process.exit(1);
}

const services = SERVICE_KEYS.map((key, i) => {
  const page = SERVICES[i];
  const home = HOME_SERVICES[i];
  return {
    key,
    photo: page.photo,
    name_th: page.name.th,
    name_en: page.name.en,

    show_on_home: true,
    home_icon: ICONS[key].home,
    home_accent: home.color,
    home_tint: home.tint,
    home_desc_th: home.desc.th,
    home_desc_en: home.desc.en,

    show_on_services: true,
    icon: ICONS[key].page,
    accent: page.accent,
    price_th: page.price.th,
    price_en: page.price.en,
    desc_th: page.desc.th,
    desc_en: page.desc.en,
    items: page.items,

    sort_order: i,
  };
});

const PERK_ICONS = ['card', 'shield-tick', 'chat'];
const perks = SERVICE_PERKS.map((perk, i) => ({
  icon: PERK_ICONS[i] ?? 'card',
  accent: perk.accent,
  tint: perk.tint,
  title_th: perk.h.th,
  title_en: perk.h.en,
  body_th: perk.d.th,
  body_en: perk.d.en,
  sort_order: i,
}));

const steps = [
  ...HOME_STEPS.map((s, i) => ({ scope: 'home', ...stepRow(s, i) })),
  ...SERVICE_STEPS.map((s, i) => ({ scope: 'services', ...stepRow(s, i) })),
];

function stepRow(step, i) {
  return {
    number: step.n,
    title_th: step.h.th,
    title_en: step.h.en,
    body_th: step.d.th,
    body_en: step.d.en,
    sort_order: i,
  };
}

// ----------------------------------------------------------------------- run
console.log(`Seeding site content into ${url}\n`);

const results = [];
results.push(await seed('site_settings', settings));
results.push(await seed('branches', branches));
results.push(await seed('doctors', doctors));
results.push(await seed('reviews', reviews));
results.push(await seed('cases', cases));
// Categories first: gallery_items.cat is a foreign key onto them.
results.push(await seed('gallery_categories', galleryCats));
results.push(await seed('gallery_items', galleryItems));
results.push(await seed('services', services));
results.push(await seed('service_perks', perks));
results.push(await seed('service_steps', steps));

let failed = 0;
for (const r of results) {
  const mark = r.status === 'seeded' ? '✓' : r.status === 'skipped' ? '–' : '✗';
  if (r.status === 'error') failed++;
  console.log(`${mark} ${r.table.padEnd(20)} ${r.detail}`);
}

console.log(
  failed > 0
    ? `\n${failed} table(s) failed. Nothing was overwritten — fix the error and re-run.`
    : '\nDone. Re-running is safe: tables that already hold rows are left alone.',
);
process.exit(failed > 0 ? 1 : 0);
