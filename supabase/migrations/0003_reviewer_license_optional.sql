-- The licence number is not what makes a review claim honest — a real, named dentist
-- who actually read the article is. 0002 demanded name + licence + date together,
-- which meant a clinic that gave us a name but no licence number could not record the
-- review at all, and the page would keep saying "not yet reviewed by a dentist" when
-- it had been. That is the wrong failure: it pushes people towards inventing a number.
--
-- So the licence becomes optional, and the two things that carry the actual claim stay
-- mandatory:
--
--   * a reviewer is a NAME and a DATE, together or not at all,
--   * a licence cannot exist without a reviewer to attach it to,
--   * `medically_reviewed` still cannot be set without a named reviewer (from 0002).
--
-- A licence, when present, must be one the clinic supplied. Thai dental licences are
-- publicly checkable against the Dental Council register, so a fabricated number is a
-- lie that anyone can look up.

alter table public.articles drop constraint if exists reviewer_is_complete;

alter table public.articles
  add constraint reviewer_needs_name_and_date check (
    (reviewer_name is null and reviewed_at is null)
    or (reviewer_name is not null and reviewed_at is not null)
  );

alter table public.articles
  add constraint license_needs_a_reviewer check (
    reviewer_license is null or reviewer_name is not null
  );

comment on column public.articles.reviewer_license is
  'Optional. Thai dental licence (ท.xxxxx). Never populate this with a value that was not supplied by the clinic — it is publicly checkable against the Dental Council register.';
