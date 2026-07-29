-- The rest of the site, moved out of TypeScript and into the database.
--
-- Until now only articles and images lived here; the doctors, branches, reviews,
-- before/after cases, gallery and service copy were literals in `src/content/*.ts`.
-- That was the right call while the site was being ported — the source HTML was
-- the spec, and a typed literal is the cheapest way to be exactly faithful to it.
-- It stops being the right call the moment the clinic wants to change a phone
-- number without a developer, which is what these tables are for.
--
-- Three conventions, applied everywhere:
--
--   * `_th` / `_en` column pairs rather than a translations table. Articles earn
--     the extra table because their bodies are long and a third locale is
--     plausible; a doctor's job title is two short strings that are always edited
--     together, and splitting them would double the row count to buy nothing.
--   * `is_active` rather than DELETE. A doctor who leaves and comes back, a branch
--     that closes for renovation, a review pulled while it is checked — all of
--     these want to come back with their text intact. Anon RLS only ever sees the
--     active rows, so hiding is genuinely hiding.
--   * `sort_order`, because every one of these lists is arranged deliberately in
--     the design and alphabetical order is not the arrangement.
--
-- What deliberately did NOT move: the SVG icon paths (see src/content/icons.ts).
-- A textarea containing `M19 14c1.49-1.46 3-3.21…` is not something the clinic can
-- use, but it is an excellent way to render a blank square, so icons stay a named
-- dropdown backed by code.

-- ---------------------------------------------------------------- site settings
-- One row, forever. `check (id = 1)` is what makes that true rather than merely
-- intended: without it the first accidental INSERT creates a second set of contact
-- details, and nothing on the site would say which one is live.
create table if not exists public.site_settings (
  id            smallint primary key default 1 check (id = 1),
  phone         text not null,
  tel_url       text not null,
  line_url      text not null,
  fb_url        text not null,
  email         text not null,
  legal_name_th text not null,
  legal_name_en text not null,
  address_th    text not null,
  address_en    text not null,
  hours_th      text not null,
  hours_en      text not null,
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------- branches
create table if not exists public.branches (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  region     text not null check (region in ('bkk', 'pty')),
  brand      text not null default 'Orange Smile',
  accent     text not null default '#FF7A00',
  tint       text not null default '#FFF3E8',
  photo      text not null default '',
  name_th    text not null, name_en    text not null,
  area_th    text not null default '', area_en text not null default '',
  address_th text not null default '', address_en text not null default '',
  hours_th   text not null default '', hours_en text not null default '',
  phone      text not null default '',
  tel_url    text not null default '',
  line_url   text not null default '',
  line       text not null default '',
  fb_url     text not null default '',
  -- 'lat,lng'. The embedded map is built from this rather than from a place-name
  -- search, which drops the pin on the district instead of the clinic.
  coords     text not null default '',
  map_url    text not null default '',
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------- doctors
create table if not exists public.doctors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  photo      text not null default '',
  role_th    text not null default 'ทันตแพทย์',
  role_en    text not null default 'Dentist',
  bio_th     text not null default '',
  bio_en     text not null default '',
  -- [{ "th": "จัดฟัน", "en": "Orthodontics" }, …]
  tags       jsonb not null default '[]'::jsonb,
  -- The four faces stacked in the home-page hero pill. A flag rather than a second
  -- hardcoded list of photo paths that silently drifts from the roster.
  hero_face  boolean not null default false,
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------- reviews
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  -- Single character in the avatar circle. Kept as its own column because the
  -- Thai initial is not the first character of the English name.
  initial    text not null default '',
  name_th    text not null, name_en    text not null,
  text_th    text not null, text_en    text not null,
  service_th text not null default '', service_en text not null default '',
  branch_th  text not null default '', branch_en  text not null default '',
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------- before/after cases
-- `id` is the slider identity, not `category`. The TypeScript version keyed the
-- drag position on the category string, which worked only because there was
-- exactly one case per category — add a second orthodontics case and both sliders
-- would move together. Making these editable is precisely what would have caused
-- that, so the key becomes the row's own id.
create table if not exists public.cases (
  id            uuid primary key default gen_random_uuid(),
  category      text not null,
  cat_label_th  text not null, cat_label_en  text not null,
  code          text not null default '',
  accent        text not null default '#FF7A00',
  tint          text not null default '#FFF3E8',
  before_key    text not null,
  after_key     text not null,
  title_th      text not null, title_en      text not null,
  -- The Reviews page has room for a longer headline than the home page does.
  title_long_th text not null default '', title_long_en text not null default '',
  quote_th      text not null default '', quote_en      text not null default '',
  doctor_th     text not null default '', doctor_en     text not null default '',
  branch_th     text not null default '', branch_en     text not null default '',
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------- gallery
create table if not exists public.gallery_categories (
  key        text primary key,
  label_th   text not null,
  label_en   text not null,
  sort_order integer not null default 0
);

create table if not exists public.gallery_items (
  id         uuid primary key default gen_random_uuid(),
  img        text not null,
  cat        text not null references public.gallery_categories(key) on update cascade,
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_items_cat_idx on public.gallery_items (cat, sort_order);

-- ---------------------------------------------------------------------- services
-- One row per treatment, carrying both cards it appears on.
--
-- The home grid and the Services page show the same eight treatments but are not
-- the same card: different copy, different icon, and — checked against the
-- original design — different accent colours for four of them (implants are teal
-- on the home page and orange on the Services page). Merging them into one set of
-- columns would quietly restyle the site. Hence the `home_*` pairs.
create table if not exists public.services (
  id               uuid primary key default gen_random_uuid(),
  key              text not null unique,
  photo            text not null default '',
  name_th          text not null, name_en text not null,

  show_on_home     boolean not null default true,
  home_icon        text not null default 'heart',
  home_accent      text not null default '#FF7A00',
  home_tint        text not null default '#FFF3E8',
  home_desc_th     text not null default '', home_desc_en text not null default '',

  show_on_services boolean not null default true,
  icon             text not null default 'heart',
  accent           text not null default '#FF7A00',
  price_th         text not null default '', price_en text not null default '',
  desc_th          text not null default '', desc_en  text not null default '',
  -- [{ "th": "ขูดหินปูน + ขัดฟัน", "en": "Scaling & polishing" }, …]
  items            jsonb not null default '[]'::jsonb,

  sort_order       integer not null default 0,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- The three benefit cards under the Services process section. Promo copy —
-- "ผ่อน 0% นานสูงสุด 10 เดือน" — is exactly the sort of claim that changes without
-- warning and must never need a deploy to correct.
create table if not exists public.service_perks (
  id         uuid primary key default gen_random_uuid(),
  icon       text not null default 'card',
  accent     text not null default '#FF7A00',
  tint       text not null default '#FFF3E8',
  title_th   text not null, title_en text not null,
  body_th    text not null default '', body_en text not null default '',
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The four-step process appears on both the home and Services pages, worded
-- slightly differently on each. `scope` keeps the two lists apart rather than
-- flattening the difference away.
create table if not exists public.service_steps (
  id         uuid primary key default gen_random_uuid(),
  scope      text not null check (scope in ('home', 'services')),
  number     text not null,
  title_th   text not null, title_en text not null,
  body_th    text not null default '', body_en text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------- RLS
--
-- Same shape on every table: anon sees the live site, staff sees everything and
-- can write. Anon's policy filters on `is_active` so "hidden" means hidden even
-- if a query on the site forgets to filter — the same reasoning as the
-- published-only policy on articles in 0002.
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings', 'branches', 'doctors', 'reviews', 'cases',
    'gallery_categories', 'gallery_items', 'services', 'service_perks', 'service_steps'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public reads %s" on public.%I', t, t);
    execute format('drop policy if exists "staff manage %s" on public.%I', t, t);

    if t in ('site_settings', 'gallery_categories', 'service_steps') then
      -- No is_active column: these are page furniture, all of it live.
      execute format(
        'create policy "public reads %s" on public.%I for select to anon, authenticated using (true)', t, t);
    else
      execute format(
        'create policy "public reads %s" on public.%I for select to anon, authenticated using (is_active)', t, t);
    end if;

    execute format(
      'create policy "staff manage %s" on public.%I for all to authenticated using (public.is_staff()) with check (public.is_staff())',
      t, t);

    execute format(
      'drop trigger if exists %I on public.%I', t || '_touch_updated_at', t);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.touch_updated_at()',
      t || '_touch_updated_at', t);
  end loop;
end $$;
