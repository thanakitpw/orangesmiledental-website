/**
 * Lets a plain `node` script import the site's TypeScript content modules.
 *
 * Node 24 strips types on its own, so `src/content/doctors.ts` and friends load
 * as-is — they import nothing at runtime, only types. Two things still need help:
 *
 *   * the `@/…` path alias, which is a tsconfig setting Node knows nothing about;
 *   * `@/components/Icon`, which is .tsx. Type stripping is not JSX compilation,
 *     so that file cannot be loaded at all. The seed script only needs its `p()`
 *     helper, so the alias points at a three-line stub instead.
 */
import { fileURLToPath, pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
const STUBS = {
  '@/components/Icon': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '_icon-stub.mjs'),
};

export async function resolve(specifier, context, next) {
  if (STUBS[specifier]) return next(pathToFileURL(STUBS[specifier]).href, context);

  if (specifier.startsWith('@/')) {
    const base = path.join(SRC, specifier.slice(2));
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]) {
      if (existsSync(candidate)) return next(pathToFileURL(candidate).href, context);
    }
  }

  return next(specifier, context);
}
