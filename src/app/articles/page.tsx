import type { Metadata } from 'next';
import { listPosts } from '@/lib/articles';
import { ArticlesIndex } from './ArticlesIndex';

/**
 * Server component on purpose: the cards have to be in the HTML Google receives,
 * not painted in later by a client fetch. Revalidates hourly, so a newly published
 * article appears without a redeploy.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'บทความสุขภาพฟัน — Orange Smile Dental',
  description:
    'ความรู้เรื่องจัดฟัน รากฟันเทียม ฟอกสีฟัน วีเนียร์ และการดูแลช่องปาก เรียบเรียงโดยทีมงาน Orange Smile Dental',
  alternates: { canonical: '/articles' },
};

export default async function ArticlesPage() {
  const posts = await listPosts();
  return <ArticlesIndex posts={posts} />;
}
