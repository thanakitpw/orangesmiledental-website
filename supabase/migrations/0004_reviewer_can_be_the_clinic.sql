-- A reviewer can be the clinic's dental team rather than one named dentist.
--
-- 0002 and 0003 assumed the reviewer was a person, because that is what carries the
-- most weight: a named dentist, checkable against the Dental Council register, who
-- read the piece. The clinic would rather sign these off as a team, which is a real
-- and defensible claim — dentists on staff read them — but it is a *different* claim,
-- and the site has to say which one it is making rather than blur the two.
--
-- So the reviewer now has a type, and the page renders the claim that matches:
--
--   person       → "ตรวจทานทางการแพทย์โดย ทพญ. …"     → JSON-LD reviewedBy: Person
--   organization → "ตรวจทานโดยทีมทันตแพทย์ …"          → JSON-LD reviewedBy: Organization
--
-- A licence number belongs to a person and cannot be attached to a company, so the
-- constraint below makes that impossible rather than merely discouraged.
--
-- Worth being clear-eyed about what this buys: when the reviewer is the same
-- organisation as the author, the review adds no independent signal — for search
-- engines or for a reader. A named dentist is strictly stronger. This is the honest
-- floor, not the ceiling.

alter table public.articles
  add column if not exists reviewer_type text not null default 'person'
    check (reviewer_type in ('person', 'organization'));

alter table public.articles
  add constraint license_belongs_to_a_person check (
    reviewer_license is null or reviewer_type = 'person'
  );

comment on column public.articles.reviewer_type is
  'Who signed the article off: a named dentist (person) or the clinic''s dental team (organization). Drives both the byline wording and the schema.org reviewedBy type.';
