import { revalidatePath } from 'next/cache';

/**
 * Every public page is ISR with `revalidate = 3600`, which is the right default
 * for a marketing site — but an hour is a long time to stare at a typo you just
 * fixed. So a save pushes the affected pages out of cache immediately, and the
 * hourly timer stays as the safety net for anything a call here forgets.
 *
 * `/` is always included: the home page pulls blog cards, service tiles, branch
 * cards, reviews and doctor faces, so almost nothing can change without it.
 */
export function revalidateSite(...paths: string[]) {
  for (const path of new Set(['/', '/sitemap.xml', ...paths])) {
    revalidatePath(path);
  }
}

/**
 * For content the root layout holds — contact details and the branch list, which
 * the nav and footer render on *every* page. A per-path call cannot reach those,
 * because the layout has its own cache entry; `'layout'` on the root purges the
 * whole tree. A blunt instrument, and the right size of instrument for a
 * six-page site where the alternative is a stale phone number on five of them.
 */
export function revalidateWholeSite() {
  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');
}
