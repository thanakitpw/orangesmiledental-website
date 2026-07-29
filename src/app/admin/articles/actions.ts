'use server';

import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase/server';
import { revalidateSite } from '@/lib/admin/revalidate';
import {
  bool,
  csv,
  dateField,
  dbMessage,
  int,
  jsonField,
  nullable,
  slugify,
  str,
  type FormState,
} from '@/lib/admin/form';
import type { FaqItem } from '@/lib/articles';

/** Bust every page an article can appear on, under both its old and new slug. */
function revalidateArticle(...slugs: (string | null | undefined)[]) {
  const paths = ['/articles'];
  for (const slug of slugs) if (slug) paths.push(`/articles/${slug}`);
  revalidateSite(...paths);
}

/**
 * Field names are `<column>_<locale>` throughout the admin — `title_th`,
 * `body_md_en` — so the bilingual form components can generate both halves of a
 * pair from one `name` prop without a per-form naming convention to remember.
 */
function translationRow(fd: FormData, locale: 'th' | 'en', articleId: string) {
  return {
    article_id: articleId,
    locale,
    title: str(fd, `title_${locale}`),
    excerpt: str(fd, `excerpt_${locale}`),
    body_md: str(fd, `body_md_${locale}`),
    meta_title: nullable(fd, `meta_title_${locale}`),
    meta_description: nullable(fd, `meta_description_${locale}`),
    keywords: csv(fd, `keywords_${locale}`),
    faq: jsonField<FaqItem[]>(fd, `faq_${locale}`, []).filter((f) => f.q?.trim() && f.a?.trim()),
    reading_minutes: Math.max(1, int(fd, `reading_minutes_${locale}`, 3)),
  };
}

export async function saveArticle(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireStaff();
  const supabase = await supabaseServer();

  const id = str(fd, 'id');
  const isNew = !id;

  const slug = slugify(str(fd, 'slug') || str(fd, 'title_en') || str(fd, 'title_th'));
  if (!slug) return { error: 'ต้องระบุ slug (ที่อยู่ของบทความ)' };

  // Both translations or nothing: `shape()` in lib/articles.ts drops an article
  // that is missing one, so a half-translated piece would vanish from the site
  // with no error anywhere. Better to refuse the save and say which half is short.
  for (const [locale, label] of [
    ['th', 'ภาษาไทย'],
    ['en', 'ภาษาอังกฤษ'],
  ] as const) {
    if (!str(fd, `title_${locale}`)) return { error: `ต้องกรอกหัวข้อ${label}` };
    if (!str(fd, `excerpt_${locale}`)) return { error: `ต้องกรอกคำโปรย${label}` };
    if (!str(fd, `body_md_${locale}`)) return { error: `ต้องกรอกเนื้อหา${label}` };
  }

  if (!str(fd, 'cover_key')) return { error: 'ต้องเลือกรูปหน้าปก' };

  const status = str(fd, 'status') || 'draft';

  // Normalise the reviewer block before it reaches Postgres. The constraints in
  // 0002–0004 would catch these combinations anyway, but a stray licence number
  // left behind after clearing the reviewer's name is an editing accident, not a
  // decision — silently dropping it beats bouncing the whole save back.
  const reviewerName = nullable(fd, 'reviewer_name');
  const reviewerType = str(fd, 'reviewer_type') === 'organization' ? 'organization' : 'person';
  const reviewedAt = reviewerName ? dateField(fd, 'reviewed_at') : null;
  const reviewerLicense = reviewerName && reviewerType === 'person' ? nullable(fd, 'reviewer_license') : null;

  if (reviewerName && !reviewedAt) return { error: 'ระบุชื่อผู้ตรวจทานแล้ว ต้องระบุวันที่ตรวจทานด้วย' };

  const article = {
    slug,
    category: str(fd, 'category'),
    cover_key: str(fd, 'cover_key'),
    status,
    // Publishing without a date is almost always "publish it now" rather than an
    // intentional omission, and the DB rejects the row either way.
    published_at:
      status === 'published'
        ? (dateField(fd, 'published_at') ?? new Date().toISOString())
        : dateField(fd, 'published_at'),
    author_name: nullable(fd, 'author_name'),
    author_credentials: nullable(fd, 'author_credentials'),
    reviewer_name: reviewerName,
    reviewer_type: reviewerType,
    reviewer_license: reviewerLicense,
    reviewed_at: reviewedAt,
    medically_reviewed: Boolean(reviewerName) && bool(fd, 'medically_reviewed'),
    featured: bool(fd, 'featured'),
    sort_order: int(fd, 'sort_order', 0),
  };

  const previousSlug = str(fd, 'previous_slug');

  const { data, error } = isNew
    ? await supabase.from('articles').insert(article).select('id, slug').single()
    : await supabase.from('articles').update(article).eq('id', id).select('id, slug').single();

  if (error) return { error: dbMessage(error) };

  const { error: trError } = await supabase
    .from('article_translations')
    .upsert([translationRow(fd, 'th', data.id), translationRow(fd, 'en', data.id)], {
      onConflict: 'article_id,locale',
    });

  if (trError) return { error: dbMessage(trError, 'บันทึกเนื้อหาไม่สำเร็จ') };

  revalidateArticle(data.slug, previousSlug);

  if (isNew) redirect(`/admin/articles/${data.id}?saved=1`);
  return { ok: 'บันทึกเรียบร้อยแล้ว' };
}

export async function deleteArticle(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireStaff();
  const supabase = await supabaseServer();

  const id = str(fd, 'id');
  if (!id) return { error: 'ไม่พบบทความที่ต้องการลบ' };

  // Translations go with it: article_translations.article_id is ON DELETE CASCADE.
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) return { error: dbMessage(error, 'ลบไม่สำเร็จ') };

  revalidateArticle(str(fd, 'slug'));
  redirect('/admin/articles?deleted=1');
}

/** The one-click publish/unpublish on the list page. */
export async function toggleArticleStatus(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireStaff();
  const supabase = await supabaseServer();

  const id = str(fd, 'id');
  const publish = str(fd, 'to') === 'published';

  const patch = publish
    ? { status: 'published', published_at: str(fd, 'published_at') || new Date().toISOString() }
    : { status: 'draft' };

  const { error } = await supabase.from('articles').update(patch).eq('id', id);
  if (error) return { error: dbMessage(error, 'เปลี่ยนสถานะไม่สำเร็จ') };

  revalidateArticle(str(fd, 'slug'));
  return { ok: publish ? 'เผยแพร่แล้ว' : 'ย้ายกลับเป็นฉบับร่างแล้ว' };
}
