import { createClient } from '@supabase/supabase-js';
import { Marked } from 'marked';
import type { Localized } from '@/lib/lang';
import type { ArticleCat } from '@/content/articles';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Reads run through the anon key, so row-level security is what decides what is
 * visible: the policy only exposes rows with status = 'published'. A draft cannot
 * leak out of here even if a query forgets to filter.
 */
const db =
  SUPABASE_URL && ANON_KEY ? createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } }) : null;

export interface FaqItem {
  q: string;
  a: string;
}

/** One locale's worth of an article, already rendered to HTML. */
export interface ArticleBody {
  title: string;
  excerpt: string;
  html: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  faq: FaqItem[];
  readingMinutes: number;
}

export interface Post {
  slug: string;
  category: ArticleCat;
  cover: string;
  featured: boolean;
  publishedAt: string;
  authorName: string;
  authorCredentials: string | null;
  /**
   * Null until a dentist has actually read the piece and signed it off. The licence
   * is optional — what makes the claim honest is a real named dentist who read it,
   * not the number beside their name — but a name and a review date are not.
   */
  reviewer: { name: string; license: string | null; at: string } | null;
  medicallyReviewed: boolean;
  th: ArticleBody;
  en: ArticleBody;
  /** Convenience for the bilingual UI, which reads `{ th, en }` pairs. */
  title: Localized;
  excerpt: Localized;
}

/**
 * Markdown comes from our own editors via the service-role key, never from a
 * visitor — but rendering it to HTML is still the one place a stray `<script>`
 * could get a foothold, so raw HTML in the source is dropped rather than passed
 * through.
 */
const md = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    html: () => '',
  },
});

const toHtml = (src: string) => md.parse(src, { async: false }) as string;

type Row = {
  slug: string;
  category: ArticleCat;
  cover_key: string;
  featured: boolean;
  published_at: string;
  author_name: string;
  author_credentials: string | null;
  reviewer_name: string | null;
  reviewer_license: string | null;
  reviewed_at: string | null;
  medically_reviewed: boolean;
  article_translations: {
    locale: 'th' | 'en';
    title: string;
    excerpt: string;
    body_md: string;
    meta_title: string | null;
    meta_description: string | null;
    keywords: string[];
    faq: FaqItem[];
    reading_minutes: number;
  }[];
};

const SELECT = `slug, category, cover_key, featured, published_at,
  author_name, author_credentials, reviewer_name, reviewer_license, reviewed_at, medically_reviewed,
  article_translations ( locale, title, excerpt, body_md, meta_title, meta_description, keywords, faq, reading_minutes )`;

function shape(row: Row): Post | null {
  const pick = (locale: 'th' | 'en'): ArticleBody | null => {
    const t = row.article_translations.find((x) => x.locale === locale);
    if (!t) return null;
    return {
      title: t.title,
      excerpt: t.excerpt,
      html: toHtml(t.body_md),
      metaTitle: t.meta_title ?? t.title,
      metaDescription: t.meta_description ?? t.excerpt,
      keywords: t.keywords ?? [],
      faq: Array.isArray(t.faq) ? t.faq : [],
      readingMinutes: t.reading_minutes,
    };
  };

  const th = pick('th');
  const en = pick('en');
  // An article missing a translation would render half-empty. Skip it rather than
  // ship a broken page.
  if (!th || !en) return null;

  return {
    slug: row.slug,
    category: row.category,
    cover: row.cover_key,
    featured: row.featured,
    publishedAt: row.published_at,
    authorName: row.author_name,
    authorCredentials: row.author_credentials,
    reviewer:
      row.reviewer_name && row.reviewed_at
        ? { name: row.reviewer_name, license: row.reviewer_license, at: row.reviewed_at }
        : null,
    medicallyReviewed: row.medically_reviewed,
    th,
    en,
    title: { th: th.title, en: en.title },
    excerpt: { th: th.excerpt, en: en.excerpt },
  };
}

export async function listPosts(): Promise<Post[]> {
  if (!db) return [];
  const { data, error } = await db
    .from('articles')
    .select(SELECT)
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[articles] list failed:', error.message);
    return [];
  }
  return ((data ?? []) as Row[]).map(shape).filter((p): p is Post => p !== null);
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!db) return null;
  const { data, error } = await db.from('articles').select(SELECT).eq('slug', slug).maybeSingle();
  if (error || !data) return null;
  return shape(data as Row);
}

/** Same category first, then anything else, never the article you are reading. */
export function relatedTo(post: Post, all: Post[], limit = 3): Post[] {
  const others = all.filter((p) => p.slug !== post.slug);
  const sameCat = others.filter((p) => p.category === post.category);
  return [...sameCat, ...others.filter((p) => p.category !== post.category)].slice(0, limit);
}

/** "12 มิ.ย. 2026" / "Jun 12, 2026" — matches how dates already read on the site. */
const TH_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

export function formatDate(iso: string): Localized {
  const d = new Date(iso);
  return {
    th: `${d.getUTCDate()} ${TH_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`,
    en: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
  };
}
