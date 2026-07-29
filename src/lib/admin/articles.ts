import { supabaseServer } from '@/lib/supabase/server';
import type { AdminArticle, AdminArticleListRow, AdminTranslation } from './article-meta';

const FULL_SELECT = `id, slug, category, cover_key, status, published_at,
  author_name, author_credentials, reviewer_name, reviewer_type, reviewer_license,
  reviewed_at, medically_reviewed, featured, sort_order,
  article_translations ( locale, title, excerpt, body_md, meta_title, meta_description,
    keywords, faq, reading_minutes )`;

/**
 * Every article, drafts included — which works because the staff SELECT policy
 * added in 0005 sits alongside the anon "published only" policy rather than
 * replacing it. The public reader in `lib/articles.ts` is untouched.
 */
export async function listAdminArticles(): Promise<AdminArticleListRow[]> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from('articles')
    .select(
      'id, slug, category, status, featured, published_at, medically_reviewed, updated_at, article_translations ( locale, title )',
    )
    .order('published_at', { ascending: false, nullsFirst: true })
    .order('slug');

  if (error) throw new Error(`โหลดรายการบทความไม่สำเร็จ: ${error.message}`);

  return (data ?? []).map((row) => {
    const tr = (row.article_translations ?? []) as { locale: 'th' | 'en'; title: string }[];
    const th = tr.find((t) => t.locale === 'th');
    const en = tr.find((t) => t.locale === 'en');
    return {
      id: row.id,
      slug: row.slug,
      category: row.category,
      status: row.status,
      featured: row.featured,
      publishedAt: row.published_at,
      medicallyReviewed: row.medically_reviewed,
      updatedAt: row.updated_at,
      titleTh: th?.title ?? '—',
      titleEn: en?.title ?? '—',
      complete: Boolean(th && en),
    };
  });
}

export async function getAdminArticle(id: string): Promise<AdminArticle | null> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.from('articles').select(FULL_SELECT).eq('id', id).maybeSingle();
  if (error || !data) return null;

  const tr = (data.article_translations ?? []) as AdminTranslation[];
  return {
    ...data,
    th: tr.find((t) => t.locale === 'th') ?? null,
    en: tr.find((t) => t.locale === 'en') ?? null,
  } as AdminArticle;
}
