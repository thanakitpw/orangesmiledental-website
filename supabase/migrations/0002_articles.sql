-- Articles for the clinic blog.
--
-- Split into a language-neutral row plus one translation row per locale, so TH and
-- EN stay in lockstep and a third locale can be added without touching the base
-- table.
--
-- The constraints at the bottom are the point of this file. These are health
-- articles, and the failure mode that matters is not a broken page — it is a page
-- that quietly claims a dentist vouched for it when none did. So:
--
--   * nothing publishes without a named party taking responsibility,
--   * a reviewer is all-or-nothing: name + licence + date, or none of the three,
--   * `medically_reviewed` cannot be set unless a reviewer actually exists.
--
-- An unreviewed article can still go live; it simply cannot pretend otherwise, and
-- the article page renders the "not yet reviewed by a dentist" line from that flag.

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null check (category in ('ortho','implants','aesthetic','pediatric','general')),
  cover_key text not null,

  status text not null default 'draft' check (status in ('draft','in_review','published')),
  published_at timestamptz,

  author_name text,
  author_credentials text,
  reviewer_name text,
  reviewer_license text,
  reviewed_at timestamptz,
  medically_reviewed boolean not null default false,

  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint published_requires_attribution check (
    status <> 'published' or author_name is not null
  ),
  constraint published_requires_date check (
    status <> 'published' or published_at is not null
  ),
  constraint reviewer_is_complete check (
    (reviewer_name is null and reviewer_license is null and reviewed_at is null)
    or (reviewer_name is not null and reviewer_license is not null and reviewed_at is not null)
  ),
  constraint reviewed_flag_matches_reviewer check (
    medically_reviewed = false or reviewer_name is not null
  )
);

create table if not exists public.article_translations (
  article_id uuid not null references public.articles(id) on delete cascade,
  locale text not null check (locale in ('th','en')),

  title text not null,
  excerpt text not null,
  body_md text not null,

  -- Kept apart from title/excerpt on purpose: what wins a click in a search result
  -- and what reads well on a card are not the same sentence.
  meta_title text,
  meta_description text,
  keywords text[] not null default '{}',

  -- [{ "q": "...", "a": "..." }] — rendered as the FAQ block and as FAQPage JSON-LD.
  faq jsonb not null default '[]'::jsonb,
  reading_minutes integer not null default 3,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (article_id, locale)
);

create index if not exists articles_status_published_idx
  on public.articles (status, published_at desc);
create index if not exists articles_category_idx on public.articles (category);

alter table public.articles enable row level security;
alter table public.article_translations enable row level security;

-- Anonymous readers see published rows only, so a draft cannot leak to the browser
-- even if a query forgets to filter. Writes go through the service-role key, which
-- bypasses RLS — no insert/update/delete policy is granted to anon on purpose.
create policy "published articles are readable"
  on public.articles for select
  to anon, authenticated
  using (status = 'published');

create policy "translations of published articles are readable"
  on public.article_translations for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.articles a
      where a.id = article_translations.article_id
        and a.status = 'published'
    )
  );

-- security invoker, and EXECUTE revoked: as a SECURITY DEFINER function in the
-- public schema this was exposed as an anon-callable RPC (/rest/v1/rpc/…), which
-- Supabase's own linter flags. Triggers fire regardless of the EXECUTE grant.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.touch_updated_at() from public, anon, authenticated;

drop trigger if exists articles_touch_updated_at on public.articles;
create trigger articles_touch_updated_at
  before update on public.articles
  for each row execute function public.touch_updated_at();

drop trigger if exists article_translations_touch_updated_at on public.article_translations;
create trigger article_translations_touch_updated_at
  before update on public.article_translations
  for each row execute function public.touch_updated_at();
