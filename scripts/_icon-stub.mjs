/** Stands in for src/components/Icon.tsx, which cannot be loaded by plain node
 *  (type stripping is not JSX compilation). The seed script only needs `p()`. */
export const p = (d) => ({ el: 'path', attrs: { d } });
