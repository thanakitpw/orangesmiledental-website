import { listPosts, formatDate, type Post } from '@/lib/articles';
import { CAT_LABEL, HOME_POSTS, type HomePost } from '@/content/articles';
import { HomeView } from './HomeView';

/**
 * Server component on purpose: the home page's three blog cards have to be in the HTML
 * Google receives, and they have to be whatever is actually published right now — not a
 * hardcoded list that silently drifts from the database. Everything else on the page is
 * static and lives in the client `HomeView`; only the cards need the round-trip.
 *
 * Revalidates hourly, so publishing or renaming an article shows up on the home page
 * without a redeploy.
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
  // listPosts() already orders featured-first, then newest-first, so the top three are
  // the same pieces the design highlighted. Fall back to the static teasers only if the
  // query comes back empty, so the section is never blank.
  const posts = await listPosts();
  const cards = posts.length > 0 ? posts.slice(0, 3).map(toCard) : HOME_POSTS;
  return <HomeView posts={cards} />;
}
