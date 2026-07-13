-- Orange Smile Dental — media storage.
--
-- Images live in a public Storage bucket; `media_assets` indexes them so the app
-- (and any future admin UI) can query images by key or category instead of
-- guessing at storage paths.
--
-- Applied to project pxvefuesqnwotxlyrtpk on 2026-07-13.
-- Run this once against a fresh project, then `npm run media:upload`.

-- ---------------------------------------------------------------- bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760, -- 10 MB; the compressed WebP files are far below this
  array['image/webp', 'image/png', 'image/jpeg', 'image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- NOTE: deliberately NO policies on storage.objects for this bucket.
--
-- A public bucket already serves objects by URL without any SELECT policy.
-- Adding a broad `using (bucket_id = 'media')` SELECT policy would ALSO let any
-- anon client call the list endpoint and enumerate every file in the bucket —
-- which Supabase's own security linter flags (public_bucket_allows_listing).
-- Writes are done by the upload script using the service role, which bypasses
-- RLS, so no INSERT/UPDATE policy is needed either.

-- ---------------------------------------------------------------- index table
create table if not exists public.media_assets (
  id          uuid primary key default gen_random_uuid(),
  -- Storage path inside the `media` bucket, e.g. 'assets/team/doc1.webp'.
  key         text        not null unique,
  -- Coarse grouping: 'team' | 'branches' | 'services' | 'reviews' | 'media' | 'blog' | 'gallery' | 'hero'.
  category    text        not null,
  -- For gallery images: the treatment category ('ortho', 'veneer', …). Null otherwise.
  gallery_cat text,
  -- Preserves the position the designer's gallery was authored in.
  sort_order  integer     not null default 0,
  width       integer,
  height      integer,
  bytes       integer,
  alt_th      text,
  alt_en      text,
  -- Where the file came from in the original handoff, for traceability.
  source_path text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists media_assets_category_idx on public.media_assets (category);
create index if not exists media_assets_gallery_idx  on public.media_assets (gallery_cat, sort_order);

alter table public.media_assets enable row level security;

-- The table only describes images that are already public, so anon read is fine.
drop policy if exists "media_assets is publicly readable" on public.media_assets;
create policy "media_assets is publicly readable"
  on public.media_assets for select
  to anon, authenticated
  using (true);

-- Writes come from the upload script (service role). Spelled out for clarity even
-- though the service role bypasses RLS.
drop policy if exists "media_assets is service-role writable" on public.media_assets;
create policy "media_assets is service-role writable"
  on public.media_assets for all
  to service_role
  using (true)
  with check (true);

-- `set search_path = ''` keeps the trigger immune to search_path hijacking.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists media_assets_touch_updated_at on public.media_assets;
create trigger media_assets_touch_updated_at
  before update on public.media_assets
  for each row execute function public.touch_updated_at();
