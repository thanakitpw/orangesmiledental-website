-- Who changed what, and when.
--
-- Recorded by database triggers rather than by the Server Actions, for one
-- reason: an audit trail that only sees the happy path is not an audit trail. A
-- trigger fires for every INSERT, UPDATE and DELETE no matter how the write
-- arrived — the admin UI, a psql session, the SQL editor in the Supabase
-- dashboard, a migration, a script somebody runs at 2am. Application-level
-- logging catches only the calls someone remembered to add, and the writes worth
-- investigating are exactly the ones that did not come through the front door.
--
-- The table lives in `private`, which is deliberate on two counts:
--
--   * PostgREST serves only `public` and `graphql_public`, so this has no HTTP
--     endpoint at all. It is not visible in the back office, as asked.
--   * `authenticated` holds no privileges on it. Staff cannot read the log, and
--     more importantly cannot edit or delete their own entries. A log the audited
--     party can rewrite is decoration.
--
-- The trigger function is SECURITY DEFINER, so it can write to a table the
-- calling role cannot touch.
--
-- Read it from the Supabase SQL editor (service role):
--
--   select at, actor_email, table_name, action, row_id, changed
--   from private.audit_log
--   order by at desc
--   limit 50;

create table if not exists private.audit_log (
  id          bigint generated always as identity primary key,
  at          timestamptz not null default now(),

  -- Null when the write did not come from a signed-in person: a migration, the
  -- seed script, or anything else using the service role. That distinction is
  -- itself worth recording — "nobody was logged in" is an answer.
  actor_id    uuid,
  -- Denormalised on purpose. A foreign key to profiles would either block the
  -- deletion of a departed staff member or blank out their history, and the
  -- history of someone who has left is precisely what an audit log is for.
  actor_email text,

  table_name  text not null,
  action      text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  -- Text rather than uuid: most tables key on a uuid `id`, gallery_categories on
  -- a text `key`, site_settings on the integer 1.
  row_id      text,

  -- UPDATE only: { "column": { "from": …, "to": … } } for the columns that
  -- actually changed.
  changed     jsonb,
  -- INSERT and DELETE: the whole row. For a DELETE this is the only surviving
  -- copy of what was removed, which is the single most useful thing in here.
  snapshot    jsonb
);

create index if not exists audit_log_at_idx    on private.audit_log (at desc);
create index if not exists audit_log_actor_idx on private.audit_log (actor_id, at desc);
create index if not exists audit_log_table_idx on private.audit_log (table_name, at desc);

revoke all on private.audit_log from public, anon, authenticated;

-- ------------------------------------------------------------------ helpers
--
-- Article bodies are long Markdown. An unabridged before/after on every save
-- would store the whole article twice per keystroke-session, and the answer an
-- audit log needs to give is "who touched the body of this piece, and when" —
-- not "here is a second copy of the CMS". Long values are therefore clipped.
create or replace function private.clip_json(payload jsonb)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    jsonb_object_agg(
      e.k,
      case
        when jsonb_typeof(e.v) = 'string' and length(e.v #>> '{}') > 2000
          then to_jsonb(left(e.v #>> '{}', 2000) || '… [ตัดทอน]')
        else e.v
      end
    ),
    '{}'::jsonb
  )
  from jsonb_each(payload) as e(k, v)
$$;

create or replace function private.record_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid       uuid := (select auth.uid());
  who       text;
  old_json  jsonb;
  new_json  jsonb;
  diff      jsonb;
  pk        text;
begin
  select p.email into who from public.profiles p where p.id = uid;

  if tg_op = 'DELETE' then
    old_json := private.clip_json(to_jsonb(old));
    pk := coalesce(old_json ->> 'id', old_json ->> 'key');

    insert into private.audit_log (actor_id, actor_email, table_name, action, row_id, snapshot)
    values (uid, who, tg_table_name, 'DELETE', pk, old_json);
    return old;
  end if;

  new_json := private.clip_json(to_jsonb(new));
  pk := coalesce(new_json ->> 'id', new_json ->> 'key');

  if tg_op = 'INSERT' then
    insert into private.audit_log (actor_id, actor_email, table_name, action, row_id, snapshot)
    values (uid, who, tg_table_name, 'INSERT', pk, new_json);
    return new;
  end if;

  old_json := private.clip_json(to_jsonb(old));

  -- `updated_at` is excluded because the touch trigger changes it on every single
  -- update; logging it would add a line of noise to every entry and information
  -- to none of them.
  select coalesce(
    jsonb_object_agg(e.k, jsonb_build_object('from', old_json -> e.k, 'to', e.v)),
    '{}'::jsonb
  )
  into diff
  from jsonb_each(new_json) as e(k, v)
  where e.v is distinct from old_json -> e.k
    and e.k <> 'updated_at';

  -- An UPDATE that changed nothing but the timestamp is not an event.
  if diff <> '{}'::jsonb then
    insert into private.audit_log (actor_id, actor_email, table_name, action, row_id, changed)
    values (uid, who, tg_table_name, 'UPDATE', pk, diff);
  end if;

  return new;
end;
$$;

revoke execute on function private.record_audit() from public, anon, authenticated;
revoke execute on function private.clip_json(jsonb) from public, anon, authenticated;

-- ----------------------------------------------------------------- triggers
--
-- Everything a person can change, plus the two tables that decide who that
-- person is. Changes to `staff_allowlist` and `profiles` are the most
-- security-relevant writes in the whole database — somebody granting themselves
-- access is exactly the event this table exists to catch.
do $$
declare
  t text;
begin
  foreach t in array array[
    'articles', 'article_translations', 'media_assets',
    'site_settings', 'branches', 'doctors', 'reviews', 'cases',
    'gallery_categories', 'gallery_items', 'services', 'service_perks', 'service_steps',
    'profiles', 'staff_allowlist'
  ]
  loop
    execute format('drop trigger if exists %I on public.%I', t || '_audit', t);
    execute format(
      'create trigger %I after insert or update or delete on public.%I
         for each row execute function private.record_audit()',
      t || '_audit', t);
  end loop;
end $$;

comment on table private.audit_log is
  'Who changed what. Written by triggers so it cannot be bypassed, and kept in `private` so PostgREST cannot serve it and staff cannot edit their own history. Query it from the SQL editor with the service role.';
