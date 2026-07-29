import { listPosts, formatDate, type Post } from '@/lib/articles';
import { CAT_LABEL, HOME_POSTS, type HomePost } from '@/content/articles';
import { getDoctors, getServices, getReviews, getCases } from '@/lib/site-content';
import { HomeView } from './HomeView';

/**
 * Server component on purpose: everything the home page draws — blog cards,
 * service tiles, the dentist roster, the before/after cases — has to be in the
 * HTML Google receives, and it has to be whatever is actually saved right now
 * rather than a hardcoded list that silently drifts from the database.
 *
 * Revalidates hourly, and every admin save busts this path, so an edit appears
 * immediately without a redeploy.
 *
 * Branch cards and contact details are deliberately absent: the root layout
 * supplies those through `SiteDataProvider`, because the nav and footer need them
 * on every page anyway.
 */
export const revalidate = 3600;

/** A published article, reduced to just what a home-page card draws. */
function toCard(p: Post): HomePost {
  return {
    slug: p.slug,
    title: p.title,
    cat: CAT_LABEL[p.category],
    date: formatDate(p.publishedAt),
    cover: p.cover,
  };
}

export default async function HomePage() {
  const [posts, doctorData, services, reviews, cases] = await Promise.all([
    listPosts(),
    getDoctors(),
    getServices(),
    getReviews(),
    getCases(),
  ]);

  // listPosts() already orders featured-first, then newest-first, so the top three are
  // the same pieces the design highlighted. Fall back to the static teasers only if the
  // query comes back empty, so the section is never blank.
  const cards = posts.length > 0 ? posts.slice(0, 3).map(toCard) : HOME_POSTS;

  return (
    <HomeView
      posts={cards}
      doctors={doctorData.doctors}
      heroFaces={doctorData.heroFaces}
      services={services.home}
      steps={services.homeSteps}
      reviews={reviews}
      cases={cases}
    />
  );
}
