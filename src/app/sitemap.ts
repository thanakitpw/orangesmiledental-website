import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';
import { listPosts } from '@/lib/articles';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['', '/services', '/doctors', '/branches', '/reviews', '/articles'].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  // Only published articles come back from listPosts — row-level security sees to
  // that — so a draft can never be advertised to Google from here.
  const posts = (await listPosts()).map((p) => ({
    url: `${SITE.url}/articles/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
