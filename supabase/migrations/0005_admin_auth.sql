-- Staff accounts for the admin back office.
--
-- The clinic's team all get the same powers — there is no editor/publisher split,
-- because with two to five people who sit in the same room a role matrix is
-- ceremony that buys nothing. Membership in `profiles` IS the permission.
--
-- What the design does take seriously is who gets *into* that table. Two gates,
-- because either one alone is a single toggle away from disaster:
--
--   1. Public sign-up is switched off in the Supabase Auth settings, so the only
--      way an auth user appears is an invite someone on the team sent.
--   2. Even then, the trigger below hands out a profile only to an address that
--      was put on `staff_allowlist` first. A stray sign-up — or an invite sent to
--      the wrong address — lands a user with no profile, and `is_staff()` says no.
--
-- Gate 2 is what makes gate 1 non-fatal if it is ever flipped by accident.

-- ---------------------------------------------------------------- allowlist
create table if not exists public.staff_allowlist (
  email      text primary key,
  note       text,
  invited_at timestamptz not null default now()
);

alter table public.staff_allowlist enable row level security;

-- Deliberately no policies: this table is the gate, so it is reachable only by the
-- service role (which bypasses RLS). Nobody edits their own way onto it.

comment on table public.staff_allowlist is
  'Addresses allowed to become staff. Add a row BEFORE inviting the user in the Supabase dashboard — the profile trigger checks this table and silently skips anyone not on it.';

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null unique,
  full_name  text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- security definer so the function can read `profiles` without tripping the RLS
-- policy that is itself defined in terms of this function. `set search_path = ''`
-- keeps it immune to search_path hijacking.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()))
$$;

-- Anon never evaluates a staff policy (they are all `to authenticated`), so anon
-- has no reason to hold EXECUTE — and without the grant it cannot be probed as an
-- RPC either.
revoke execute on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated;

drop policy if exists "staff can read the team" on public.profiles;
create policy "staff can read the team"
  on public.profiles for select
  to authenticated
  using (public.is_staff());

drop policy if exists "you can edit your own profile" on public.profiles;
create policy "you can edit your own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------- invite trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.staff_allowlist a
    where lower(a.email) = lower(new.email)
  ) then
    insert into public.profiles (id, email, full_name)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- staff write access
-- Reads for the public stay exactly as they were: 0002's policy still limits anon
-- to `status = 'published'`. These add a second, wider door that only opens for a
-- signed-in staff member — which is how the admin sees drafts.

drop policy if exists "staff manage articles" on public.articles;
create policy "staff manage articles"
  on public.articles for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "staff manage article translations" on public.article_translations;
create policy "staff manage article translations"
  on public.article_translations for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "staff manage media_assets" on public.media_assets;
create policy "staff manage media_assets"
  on public.media_assets for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------- storage
-- 0001 left `storage.objects` policy-free on purpose: a public bucket serves files
-- by URL without a SELECT policy, and adding a broad one would also hand anon the
-- ability to list every file in the bucket. That reasoning is untouched here —
-- this policy is scoped `to authenticated` AND gated on is_staff(), so anon still
-- cannot enumerate the bucket. Staff can, because the media library needs to.
drop policy if exists "staff manage the media bucket" on storage.objects;
create policy "staff manage the media bucket"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());
