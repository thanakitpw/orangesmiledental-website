/**
 * Injects a page's stylesheet verbatim.
 *
 * Each source page carried its own <helmet><style> block, and they are not
 * identical — the home page leaves [data-reveal] fully visible while the inner
 * pages fade it in, and the reveal distances/durations differ per page. Only one
 * page is mounted at a time, so emitting the block as-is reproduces the original
 * cascade exactly rather than approximating it with a merged stylesheet.
 */
export function PageStyles({ css }: { css: string }) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
