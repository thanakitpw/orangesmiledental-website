import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { getAdminArticle } from '@/lib/admin/articles';
import { ArticleForm } from './ArticleForm';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const { saved } = await searchParams;

  // `new` is a route, not a row — branch before the query so an id that is not a
  // uuid never reaches Postgres.
  const article = id === 'new' ? null : await getAdminArticle(id);
  if (id !== 'new' && !article) notFound();

  return <ArticleForm article={article} justCreated={Boolean(saved)} />;
}
