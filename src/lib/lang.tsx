'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Lang = 'th' | 'en';

/** Every string on the site is authored as a TH/EN pair. */
export interface Localized {
  th: string;
  en: string;
}

const STORAGE_KEY = 'osd_lang';

interface LangCtx {
  lang: Lang;
  isTH: boolean;
  /** Picks the TH or EN side of a pair — the `t(th, en)` helper from the source. */
  t: (th: string, en: string) => string;
  /** Same, for content authored as `{ th, en }` objects. */
  tl: (value: Localized) => string;
  /** Display-font tracking: TH glyphs need no negative tracking, Latin does. */
  track: string;
  setTH: () => void;
  setEN: () => void;
}

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Starts on 'th' and switches after mount, mirroring the source's
  // componentDidMount localStorage read (and keeping SSR output stable).
  const [lang, setLang] = useState<Lang>('th');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'th' || saved === 'en') setLang(saved);
    } catch {
      /* private mode / storage disabled */
    }
  }, []);

  const set = useCallback((next: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    setLang(next);
  }, []);

  const isTH = lang === 'th';
  const value: LangCtx = {
    lang,
    isTH,
    t: (th, en) => (isTH ? th : en),
    tl: (v) => (isTH ? v.th : v.en),
    track: isTH ? '0' : '-1px',
    setTH: () => set('th'),
    setEN: () => set('en'),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
