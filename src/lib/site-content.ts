import { createClient } from '@supabase/supabase-js';
import type { Localized } from '@/lib/lang';
import { iconShapes } from '@/content/icons';
import type { IconShape } from '@/components/Icon';

import { SITE } from '@/content/site';
import { BRANCHES, type Branch } from '@/content/branches';
import { DOCTORS, HERO_FACES, type Doctor } from '@/content/doctors';
import { REVIEWS, type Review } from '@/content/reviews';
import { CASES } from '@/content/cases';
import { GALLERY, GALLERY_CATS } from '@/content/gallery.generated';
import {
  HOME_SERVICES,
  SERVICES,
  SERVICE_PERKS,
  HOME_STEPS,
  SERVICE_STEPS,
  type HomeService,
  type Service,
  type Step,
} from '@/content/services';

/**
 * The public site's view of the content tables.
 *
 * Two rules run through all of it:
 *
 *   1. **Shape, don't leak.** Every function returns the same TypeScript type the
 *      page components already consumed as a literal — `Branch`, `Doctor`,
 *      `HomeService` — so moving a section to the database is a change to where
 *      its data comes from, not to how it renders. Icon *names* become icon
 *      *shapes* here, for the same reason.
 *
 *   2. **Fall back on failure, not on emptiness.** If Supabase is unreachable or
 *      the keys are missing on a fresh clone, each function returns the literals in
 *      `src/content/`, so the README's promise that the site runs before Supabase
 *      exists stays true and a database blip degrades to slightly stale content
 *      rather than a blank page. A table that is *empty* is a different thing
 *      entirely — somebody chose that — and is passed through untouched.
 *
 * Reads go through the anon key, so row-level security decides what is visible:
 * the policies from 0006 expose only `is_active` rows.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const db =
  SUPABASE_URL && ANON_KEY
    ? createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } })
    : null;

const pair = (th: string, en: string): Localized => ({ th, en });

type QueryResult<T> = PromiseLike<{ data: T[] | null; error: { message: string } | null }>;

/**
 * One place for "query, log, fall back" so no caller can forget the last part.
 *
 * `null` means the database could not answer — no keys configured, or the query
 * errored. An **empty array is a real answer** and is returned as one.
 *
 * That distinction is the whole point. Treating "zero rows" as a reason to fall
 * back would mean that hiding every review in the admin brings the six seeded
 * ones back to life on the home page, and deleting the last gallery image
 * resurrects all 54. Content the clinic removed must stay removed; only an
 * unreachable database gets the literals.
 */
async function rows<T>(
  table: string,
  build: (q: NonNullable<typeof db>['from'] extends (t: string) => infer B ? B : never) => QueryResult<T>,
): Promise<T[] | null> {
  if (!db) return null;

  const { data, error } = await build(db.from(table));
  if (error) {
    console.error(`[content] ${table} query failed:`, error.message);
    return null;
  }
  return data ?? [];
}

// ------------------------------------------------------------------- settings
export interface SiteSettings {
  phone: string;
  telUrl: string;
  lineUrl: string;
  fbUrl: string;
  email: string;
  legalName: Localized;
  address: Localized;
  hours: Localized;
}

const SETTINGS_FALLBACK: SiteSettings = {
  phone: SITE.phone,
  telUrl: SITE.telUrl,
  lineUrl: SITE.lineUrl,
  fbUrl: SITE.fbUrl,
  email: SITE.email,
  legalName: SITE.legalName,
  address: SITE.address,
  hours: SITE.hours,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await rows<Record<string, string>>('site_settings', (q) => q.select('*').limit(1));
  // The one table where "empty" is not a decision anyone made — there is nothing
  // to render for a clinic with no phone number.
  if (!data || data.length === 0) return SETTINGS_FALLBACK;

  const s = data[0];
  return {
    phone: s.phone,
    telUrl: s.tel_url,
    lineUrl: s.line_url,
    fbUrl: s.fb_url,
    email: s.email,
    legalName: pair(s.legal_name_th, s.legal_name_en),
    address: pair(s.address_th, s.address_en),
    hours: pair(s.hours_th, s.hours_en),
  };
}

// ------------------------------------------------------------------- branches
export async function getBranches(): Promise<Branch[]> {
  const data = await rows<Record<string, string>>('branches', (q) =>
    q.select('*').eq('is_active', true).order('sort_order'),
  );
  if (!data) return BRANCHES;

  return data.map((b) => ({
    key: b.key,
    region: b.region as Branch['region'],
    brand: b.brand,
    accent: b.accent,
    tint: b.tint,
    photo: b.photo,
    name: pair(b.name_th, b.name_en),
    area: pair(b.area_th, b.area_en),
    address: pair(b.address_th, b.address_en),
    hours: pair(b.hours_th, b.hours_en),
    phone: b.phone,
    telUrl: b.tel_url,
    lineUrl: b.line_url,
    line: b.line,
    fbUrl: b.fb_url,
    coords: b.coords,
    mapUrl: b.map_url,
  }));
}

// -------------------------------------------------------------------- doctors
export interface DoctorData {
  doctors: Doctor[];
  /** The four faces stacked in the home-page hero pill. */
  heroFaces: string[];
}

export async function getDoctors(): Promise<DoctorData> {
  const data = await rows<Record<string, never>>('doctors', (q) =>
    q.select('*').eq('is_active', true).order('sort_order'),
  );
  if (!data) return { doctors: DOCTORS, heroFaces: HERO_FACES };

  const list = data as unknown as {
    name: string;
    photo: string;
    role_th: string;
    role_en: string;
    bio_th: string;
    bio_en: string;
    tags: Localized[];
    hero_face: boolean;
  }[];

  return {
    doctors: list.map((d) => ({
      name: d.name,
      photo: d.photo,
      role: pair(d.role_th, d.role_en),
      bio: pair(d.bio_th, d.bio_en),
      tags: Array.isArray(d.tags) ? d.tags : [],
    })),
    // Falling back to the first four faces keeps the hero populated if nobody has
    // ticked the flag yet — an empty pill is a visible hole in the design.
    heroFaces: (list.filter((d) => d.hero_face).length > 0
      ? list.filter((d) => d.hero_face)
      : list.slice(0, 4)
    ).map((d) => d.photo),
  };
}

// -------------------------------------------------------------------- reviews
export async function getReviews(): Promise<Review[]> {
  const data = await rows<Record<string, string>>('reviews', (q) =>
    q.select('*').eq('is_active', true).order('sort_order'),
  );
  if (!data) return REVIEWS;

  return data.map((r) => ({
    init: r.initial,
    name: pair(r.name_th, r.name_en),
    txt: pair(r.text_th, r.text_en),
    svc: pair(r.service_th, r.service_en),
    br: pair(r.branch_th, r.branch_en),
  }));
}

// ---------------------------------------------------------------------- cases
/**
 * `id` and `cat` are separate on purpose.
 *
 * The ported version used one field for both, keyed the before/after slider on it,
 * and got away with it because there was exactly one case per treatment. The
 * moment the clinic adds a second orthodontics case through the admin, two cards
 * would share a slider key and drag in lockstep. `id` is the row's own identity;
 * `cat` is what the filter chips match on.
 */
export interface CaseItem {
  id: string;
  cat: string;
  catLabel: Localized;
  code: string;
  accent: string;
  tint: string;
  before: string;
  after: string;
  title: Localized;
  titleLong: Localized;
  quote: Localized;
  doctor: Localized;
  branch: Localized;
}

export async function getCases(): Promise<CaseItem[]> {
  const data = await rows<Record<string, string>>('cases', (q) =>
    q.select('*').eq('is_active', true).order('sort_order'),
  );

  if (!data) {
    return CASES.map((c) => ({
      id: c.key,
      cat: c.key,
      catLabel: c.catLabel,
      code: c.code,
      accent: c.accent,
      tint: c.tint,
      before: c.before,
      after: c.after,
      title: c.title,
      titleLong: c.titleLong,
      quote: c.quote,
      doctor: c.doctor,
      branch: c.branch,
    }));
  }

  return data.map((c) => ({
    id: c.id,
    cat: c.category,
    catLabel: pair(c.cat_label_th, c.cat_label_en),
    code: c.code,
    accent: c.accent,
    tint: c.tint,
    before: c.before_key,
    after: c.after_key,
    title: pair(c.title_th, c.title_en),
    titleLong: pair(c.title_long_th || c.title_th, c.title_long_en || c.title_en),
    quote: pair(c.quote_th, c.quote_en),
    doctor: pair(c.doctor_th, c.doctor_en),
    branch: pair(c.branch_th, c.branch_en),
  }));
}

// -------------------------------------------------------------------- gallery
export interface GalleryData {
  /** Only categories that actually hold an image, in the order they are arranged. */
  cats: { key: string; label: Localized }[];
  items: { img: string; cat: string }[];
}

export async function getGallery(): Promise<GalleryData> {
  const cats = await rows<Record<string, string>>('gallery_categories', (q) =>
    q.select('*').order('sort_order'),
  );
  const items = await rows<Record<string, string>>('gallery_items', (q) =>
    q.select('img, cat, sort_order').eq('is_active', true).order('sort_order'),
  );

  // Only when the database is unreachable — an emptied gallery stays empty.
  if (!cats || !items) {
    return {
      cats: Object.entries(GALLERY_CATS).map(([key, label]) => ({ key, label })),
      items: GALLERY.map((g) => ({ img: g.img, cat: g.cat })),
    };
  }

  const used = new Set(items.map((i) => i.cat));
  return {
    cats: cats
      .filter((c) => used.has(c.key))
      .map((c) => ({ key: c.key, label: pair(c.label_th, c.label_en) })),
    items: items.map((i) => ({ img: i.img, cat: i.cat })),
  };
}

// ------------------------------------------------------------------- services
export interface ServicePerk {
  tint: string;
  accent: string;
  h: Localized;
  d: Localized;
  icon: IconShape[];
}

export interface ServicesData {
  home: HomeService[];
  page: Service[];
  perks: ServicePerk[];
  homeSteps: Step[];
  serviceSteps: Step[];
}

const SERVICES_FALLBACK: ServicesData = {
  home: HOME_SERVICES,
  page: SERVICES,
  perks: SERVICE_PERKS,
  homeSteps: HOME_STEPS,
  serviceSteps: SERVICE_STEPS,
};

export async function getServices(): Promise<ServicesData> {
  const data = await rows<Record<string, never>>('services', (q) =>
    q.select('*').eq('is_active', true).order('sort_order'),
  );
  const perkRows = await rows<Record<string, string>>('service_perks', (q) =>
    q.select('*').eq('is_active', true).order('sort_order'),
  );
  const stepRows = await rows<Record<string, string>>('service_steps', (q) =>
    q.select('*').order('scope').order('sort_order'),
  );

  if (!data) return SERVICES_FALLBACK;

  const list = data as unknown as {
    photo: string;
    name_th: string;
    name_en: string;
    show_on_home: boolean;
    home_icon: string;
    home_accent: string;
    home_tint: string;
    home_desc_th: string;
    home_desc_en: string;
    show_on_services: boolean;
    icon: string;
    accent: string;
    price_th: string;
    price_en: string;
    desc_th: string;
    desc_en: string;
    items: Localized[];
  }[];

  const steps = (scope: 'home' | 'services'): Step[] =>
    (stepRows ?? [])
      .filter((s) => s.scope === scope)
      .map((s) => ({ n: s.number, h: pair(s.title_th, s.title_en), d: pair(s.body_th, s.body_en) }));

  const homeSteps = steps('home');
  const serviceSteps = steps('services');

  return {
    home: list
      .filter((s) => s.show_on_home)
      .map((s) => ({
        color: s.home_accent,
        tint: s.home_tint,
        photo: s.photo,
        name: pair(s.name_th, s.name_en),
        desc: pair(s.home_desc_th, s.home_desc_en),
        icon: iconShapes(s.home_icon),
      })),
    page: list
      .filter((s) => s.show_on_services)
      .map((s) => ({
        accent: s.accent,
        photo: s.photo,
        name: pair(s.name_th, s.name_en),
        price: pair(s.price_th, s.price_en),
        desc: pair(s.desc_th, s.desc_en),
        items: Array.isArray(s.items) ? s.items : [],
        icon: iconShapes(s.icon),
      })),
    perks: perkRows !== null
      ? perkRows.map((p) => ({
          tint: p.tint,
          accent: p.accent,
          h: pair(p.title_th, p.title_en),
          d: pair(p.body_th, p.body_en),
          icon: iconShapes(p.icon),
        }))
      : SERVICE_PERKS,
    homeSteps: stepRows !== null ? homeSteps : HOME_STEPS,
    serviceSteps: stepRows !== null ? serviceSteps : SERVICE_STEPS,
  };
}
