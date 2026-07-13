import type { Localized } from '@/lib/lang';

export type CaseCat = 'ortho' | 'implant' | 'veneer' | 'whitening';

export interface BeforeAfterCase {
  key: CaseCat;
  code: string;
  accent: string;
  tint: string;
  before: string;
  after: string;
  catLabel: Localized;
  /** Short headline used on the home page. */
  title: Localized;
  /** Longer headline used on the Reviews page. */
  titleLong: Localized;
  quote: Localized;
  doctor: Localized;
  branch: Localized;
}

export const CASES: BeforeAfterCase[] = [
  {
    key: 'ortho',
    code: 'OS-1042',
    accent: '#FF7A00',
    tint: '#FFF3E8',
    before: 'assets/reviews/case-ortho-before.webp',
    after: 'assets/reviews/case-ortho-after.webp',
    catLabel: { th: 'จัดฟัน', en: 'Braces' },
    title: { th: 'จัดฟันโลหะ · เริ่มจัดเรียงฟัน', en: 'Metal braces · aligning' },
    titleLong: { th: 'จัดฟันโลหะ · เริ่มจัดเรียงฟัน', en: 'Metal braces · aligning' },
    quote: {
      th: 'ฟันที่เคยซ้อนเกและมีช่องห่าง เรียงสวยเป็นแถวเดียวกัน ยิ้มได้มั่นใจขึ้นมากจริง ๆ',
      en: 'My crowded, gappy teeth are now in one neat row — I smile with so much more confidence.',
    },
    doctor: { th: 'ทพญ. สาณิศา', en: 'Dr. Sanisa' },
    branch: { th: 'รามคำแหง', en: 'Ramkhamhaeng' },
  },
  {
    key: 'implant',
    code: 'OS-0888',
    accent: '#FF7A00',
    tint: '#FFF3E8',
    before: 'assets/reviews/case-implant-before.webp',
    after: 'assets/reviews/case-implant-after.webp',
    catLabel: { th: 'รากฟันเทียม', en: 'Implant' },
    title: { th: 'รากฟันเทียม · ทดแทนฟันที่หายไป', en: 'Implant · replacing missing teeth' },
    titleLong: { th: 'รากฟันเทียม · ทดแทนฟันที่หายไป', en: 'Implant · replacing missing teeth' },
    quote: {
      th: 'ฟันที่หายไปได้รากเทียมมาทดแทน เคี้ยวได้มั่นคงเหมือนฟันจริง ยิ้มได้เต็มที่',
      en: 'My missing tooth was replaced with an implant — I can chew firmly like a real tooth and smile fully.',
    },
    doctor: { th: 'ทพ. ธนกร', en: 'Dr. Thanakorn' },
    branch: { th: 'บางกะปิ', en: 'Bang Kapi' },
  },
  {
    key: 'veneer',
    code: 'OS-0922',
    accent: '#FF5FA2',
    tint: '#FFEAF3',
    before: 'assets/reviews/veneer-before.webp',
    after: 'assets/reviews/veneer-after.webp',
    catLabel: { th: 'วีเนียร์', en: 'Veneers' },
    title: { th: 'วีเนียร์ · ปิดช่องฟันหน้า', en: 'Veneers · close front gap' },
    titleLong: {
      th: 'วีเนียร์ · ปิดช่องฟันหน้า + ออกแบบรอยยิ้ม',
      en: 'Veneers · close gap + smile design',
    },
    quote: {
      th: 'ปิดช่องฟันหน้าและปรับรูปฟันให้เรียบเสมอกัน ฟันขาวเป็นธรรมชาติ เหมือนได้รอยยิ้มใหม่',
      en: 'Closed my front gap and evened out the shape — naturally white, like a brand-new smile.',
    },
    doctor: { th: 'ทพญ. ชาลินี', en: 'Dr. Chalinee' },
    branch: { th: 'บางกะปิ', en: 'Bang Kapi' },
  },
  {
    key: 'whitening',
    code: 'OS-1201',
    accent: '#FFB04D',
    tint: '#FFF3E8',
    before: 'assets/reviews/case-whitening-before.webp',
    after: 'assets/reviews/case-whitening-after.webp',
    catLabel: { th: 'ฟอกสีฟัน', en: 'Whitening' },
    title: { th: 'ฟอกสีฟัน · C3 → D2', en: 'Whitening · C3 → D2' },
    titleLong: { th: 'ฟอกสีฟัน · ขาวขึ้นจาก C3 เป็น D2', en: 'Whitening · C3 to D2 shade' },
    quote: {
      th: 'เทียบเฉดสีแล้วฟันขาวขึ้นหลายระดับในครั้งเดียว ไม่เสียวฟัน เห็นผลชัดมาก',
      en: 'Several shades whiter in one session with no sensitivity — the difference is obvious.',
    },
    doctor: { th: 'ทพญ. ณัฐริกา', en: 'Dr. Nattarika' },
    branch: { th: 'ไร่วนาสินธุ์', en: 'Wanasin' },
  },
];

/** The home page shows the first three cases only. */
export const HOME_CASES = CASES;
