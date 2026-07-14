import type { Localized } from '@/lib/lang';

/**
 * Head-office contact details, behind every generic call-to-action on the site.
 * Branch-specific buttons use the per-branch links in `branches.ts` instead.
 */
export const SITE = {
  /** Official LINE OA for the group. The source HTML shipped a `https://line.me` stub. */
  lineUrl: 'https://lin.ee/79112s3',
  fbUrl: 'https://www.facebook.com/Orangesmiledentalclinic/',
  /** Head office is the Romklao branch, so the two share a number. */
  phone: '094-420-9555',
  telUrl: 'tel:0944209555',
  email: 'orangesmiledental@gmail.com',
  address: {
    th: '320/46 แขวงคลองสองต้นนุ่น เขตลาดกระบัง กรุงเทพมหานคร 10520',
    en: '320/46 Khlong Song Ton Nun, Lat Krabang, Bangkok 10520',
  } satisfies Localized,
  hours: {
    th: 'เปิดบริการทุกวัน 10:30–19:00 น.',
    en: 'Open daily 10:30–19:00',
  } satisfies Localized,
} as const;
