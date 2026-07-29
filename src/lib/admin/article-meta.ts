import type { ArticleCat } from '@/content/articles';
import type { FaqItem } from '@/lib/articles';

/**
 * The article vocabulary — statuses, categories, and the row shapes the editor
 * form renders.
 *
 * Kept apart from `lib/admin/articles.ts` because that module imports the Supabase
 * *server* client, which reaches for `next/headers`. A client component that only
 * wants the list of categories would drag all of that across the boundary and fail
 * the build. Types and constants live here; anything that touches the database
 * lives there.
 */
export const ARTICLE_STATUSES = ['draft', 'in_review', 'published'] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export const ARTICLE_CATEGORIES: { value: ArticleCat; label: string }[] = [
  { value: 'ortho', label: 'จัดฟัน' },
  { value: 'implants', label: 'รากฟันเทียม' },
  { value: 'aesthetic', label: 'ความงาม' },
  { value: 'pediatric', label: 'ทันตกรรมเด็ก' },
  { value: 'general', label: 'ทั่วไป' },
];

export const STATUS_LABEL: Record<ArticleStatus, string> = {
  draft: 'ฉบับร่าง',
  in_review: 'รอตรวจ',
  published: 'เผยแพร่แล้ว',
};

export interface AdminArticleListRow {
  id: string;
  slug: string;
  category: ArticleCat;
  status: ArticleStatus;
  featured: boolean;
  publishedAt: string | null;
  medicallyReviewed: boolean;
  updatedAt: string;
  titleTh: string;
  titleEn: string;
  /** False when either translation is missing — such an article never renders. */
  complete: boolean;
}

export interface AdminTranslation {
  locale: 'th' | 'en';
  title: string;
  excerpt: string;
  body_md: string;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[];
  faq: FaqItem[];
  reading_minutes: number;
}

export interface AdminArticle {
  id: string;
  slug: string;
  category: ArticleCat;
  cover_key: string;
  status: ArticleStatus;
  published_at: string | null;
  author_name: string | null;
  author_credentials: string | null;
  reviewer_name: string | null;
  reviewer_type: 'person' | 'organization';
  reviewer_license: string | null;
  reviewed_at: string | null;
  medically_reviewed: boolean;
  featured: boolean;
  sort_order: number;
  th: AdminTranslation | null;
  en: AdminTranslation | null;
}
