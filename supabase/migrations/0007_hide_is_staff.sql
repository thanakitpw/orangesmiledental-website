-- Moves `is_staff()` out of the API's reach.
--
-- 0005 put it in `public` and granted EXECUTE to `authenticated`, because a policy
-- expression is evaluated with the privileges of the role running the query — no
-- grant, no working policy. The cost of that grant is that PostgREST exposes every
-- function in `public`, so the helper also became a callable endpoint at
-- `/rest/v1/rpc/is_staff`, which Supabase's linter flags
-- (authenticated_security_definer_function_executable).
--
-- In this particular case the endpoint leaks nothing — it takes no arguments and
-- answers "are *you* staff", which the caller already knows. But "harmless today"
-- is a bad reason to leave a SECURITY DEFINER function on the public API surface,
-- because the next person to add an argument to it inherits the exposure without
-- noticing.
--
-- So the function moves to a `private` schema. PostgREST only serves the schemas
-- it is configured with (`public`, `graphql_public`), so nothing in `private` has
-- an HTTP endpoint at all — while policies, which run inside the database, can
-- still call it.

create schema if not exists private;

-- USAGE without CREATE: signed-in users can reach the function, and cannot add
-- anything of their own next to it.
grant usage on schema private to authenticated;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()))
$$;

revoke execute on function private.is_staff() from public, anon;
grant execute on function private.is_staff() to authenticated;

-- Repoint every policy, then drop the public copy. Order matters: a policy still
-- referencing `public.is_staff()` would block the DROP.
do $$
declare
  t text;
  content_tables text[] := array[
    'site_settings', 'branches', 'doctors', 'reviews', 'cases',
    'gallery_categories', 'gallery_items', 'services', 'service_perks', 'service_steps'
  ];
begin
  foreach t in array content_tables loop
    execute format('drop policy if exists "staff manage %s" on public.%I', t, t);
    execute format(
      'create policy "staff manage %s" on public.%I for all to authenticated using (private.is_staff()) with check (private.is_staff())',
      t, t);
  end loop;

  -- 0005 named this one with spaces ("staff manage article translations"), so it
  -- does not match the `staff manage <table>` pattern the loop below builds. Left
  -- unhandled it survives, still bound to public.is_staff(), and blocks the DROP.
  drop policy if exists "staff manage article translations" on public.article_translations;

  foreach t in array array['articles', 'article_translations', 'media_assets'] loop
    execute format('drop policy if exists "staff manage %s" on public.%I', t, t);
    execute format(
      'create policy "staff manage %s" on public.%I for all to authenticated using (private.is_staff()) with check (private.is_staff())',
      t, t);
  end loop;
end $$;

drop policy if exists "staff can read the team" on public.profiles;
create policy "staff can read the team"
  on public.profiles for select
  to authenticated
  using (private.is_staff());

drop policy if exists "staff manage the media bucket" on storage.objects;
create policy "staff manage the media bucket"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'media' and private.is_staff())
  with check (bucket_id = 'media' and private.is_staff());

drop function if exists public.is_staff();

comment on function private.is_staff() is
  'Is the caller a member of public.profiles? Lives in `private` so PostgREST cannot expose it as an RPC; referenced by the staff RLS policies on every content table.';
