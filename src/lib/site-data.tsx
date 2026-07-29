'use client';

import { createContext, useContext } from 'react';
import type { Branch } from '@/content/branches';
import type { SiteSettings } from '@/lib/site-content';

interface SiteData {
  settings: SiteSettings;
  branches: Branch[];
}

const Ctx = createContext<SiteData | null>(null);

/**
 * Contact details and the branch list, available to every client component.
 *
 * These two are the exception to threading data down from each page: the nav and
 * the footer need them, and the nav and the footer are on every page. Passing them
 * through six page components and their views to reach two leaves would be a lot
 * of prop-drilling for data that is genuinely global to the site.
 *
 * Populated once in the root layout from `getSiteSettings()` / `getBranches()`,
 * which fall back to `src/content/` when Supabase is unreachable — so the context
 * is never empty and consumers never need a null check.
 */
export function SiteDataProvider({ value, children }: { value: SiteData; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function useSiteData(): SiteData {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSiteData must be used inside <SiteDataProvider>');
  return ctx;
}

export const useSiteSettings = () => useSiteData().settings;
export const useBranches = () => useSiteData().branches;
