import { getCases, getGallery } from '@/lib/site-content';
import { ReviewsView } from './ReviewsView';

export const revalidate = 3600;

export default async function ReviewsPage() {
  const [cases, gallery] = await Promise.all([getCases(), getGallery()]);
  return <ReviewsView cases={cases} gallery={gallery} />;
}
