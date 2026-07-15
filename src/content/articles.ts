import type { Localized } from '@/lib/lang';

export type ArticleCat = 'ortho' | 'implants' | 'aesthetic' | 'pediatric' | 'general';

export interface Article {
  cat: ArticleCat;
  catLabel: Localized;
  date: Localized;
  read: Localized;
  cover: string;
  title: Localized;
  excerpt: Localized;
}

export const FEATURED = {
  cat: { th: 'จัดฟัน', en: 'Orthodontics' },
  date: { th: '12 มิ.ย. 2026', en: 'Jun 12, 2026' },
  read: { th: 'อ่าน 5 นาที', en: '5 min read' },
  cover: 'assets/media/blog/cover-ortho.webp',
  title: {
    th: '5 สัญญาณที่บอกว่าถึงเวลาจัดฟัน และควรเริ่มเมื่อไหร่',
    en: '5 signs it’s time for braces — and when to start',
  },
  excerpt: {
    th: 'ฟันเก ฟันซ้อน เคี้ยวลำบาก หรือยิ้มไม่มั่นใจ? มาดู 5 สัญญาณสำคัญที่บอกว่าคุณควรปรึกษาทันตแพทย์จัดฟัน พร้อมคำแนะนำว่าวัยไหนเริ่มได้บ้าง',
    en: 'Crowded teeth, trouble chewing, or an unconfident smile? Here are 5 key signs you should see an orthodontist — plus the right age to start.',
  },
  author: { th: 'ทพญ. เอมอร ฤทธี', en: 'Dr. Aimon Rithee' },
  authorRole: { th: 'ผู้อำนวยการ · จัดฟัน', en: 'Director · Orthodontics' },
  authorImg: 'assets/media/image7.webp',
};

export const ARTICLES: Article[] = [
  {
    cat: 'implants',
    catLabel: { th: 'รากฟันเทียม', en: 'Implants' },
    date: { th: '5 มิ.ย. 2026', en: 'Jun 5, 2026' },
    read: { th: 'อ่าน 4 นาที', en: '4 min read' },
    cover: 'assets/media/blog/cover-implant-care.webp',
    title: {
      th: 'ดูแลตัวเองอย่างไรหลังฝังรากฟันเทียม',
      en: 'How to care for yourself after a dental implant',
    },
    excerpt: {
      th: '7 วันแรกหลังผ่าตัดสำคัญที่สุด รวมวิธีดูแลแผล อาหารที่ควรเลี่ยง และสัญญาณที่ต้องรีบพบหมอ',
      en: 'The first 7 days matter most — wound care, foods to avoid, and warning signs to watch for.',
    },
  },
  {
    cat: 'aesthetic',
    catLabel: { th: 'ความงาม', en: 'Aesthetic' },
    date: { th: '28 พ.ค. 2026', en: 'May 28, 2026' },
    read: { th: 'อ่าน 3 นาที', en: '3 min read' },
    cover: 'assets/media/blog/cover-whitening.webp',
    title: {
      th: 'ฟอกสีฟันให้ขาวอย่างปลอดภัย ไม่ทำร้ายฟัน',
      en: 'Whiten your teeth safely without harming enamel',
    },
    excerpt: {
      th: 'ฟอกสีฟันที่คลินิกต่างจากชุดฟอกเองอย่างไร และใครบ้างที่ไม่ควรฟอก มาหาคำตอบกัน',
      en: 'In-clinic vs DIY whitening — the real differences and who should not whiten.',
    },
  },
  {
    cat: 'ortho',
    catLabel: { th: 'จัดฟัน', en: 'Orthodontics' },
    date: { th: '20 พ.ค. 2026', en: 'May 20, 2026' },
    read: { th: 'อ่าน 6 นาที', en: '6 min read' },
    cover: 'assets/media/blog/cover-clear-metal.webp',
    title: {
      th: 'จัดฟันใส vs จัดฟันเหล็ก เลือกแบบไหนดี',
      en: 'Clear aligners vs metal braces — which is right for you?',
    },
    excerpt: {
      th: 'เปรียบเทียบข้อดี-ข้อจำกัด ราคา ระยะเวลา และการดูแล เพื่อช่วยให้คุณตัดสินใจได้ง่ายขึ้น',
      en: 'Pros, cons, cost, duration and care compared — to make your choice easier.',
    },
  },
  {
    cat: 'aesthetic',
    catLabel: { th: 'ความงาม', en: 'Aesthetic' },
    date: { th: '14 พ.ค. 2026', en: 'May 14, 2026' },
    read: { th: 'อ่าน 4 นาที', en: '4 min read' },
    cover: 'assets/media/blog/cover-veneer.webp',
    title: {
      th: 'วีเนียร์คืออะไร เหมาะกับใคร และอยู่ได้นานแค่ไหน',
      en: 'What are veneers, who are they for, and how long do they last?',
    },
    excerpt: {
      th: 'รู้จักวีเนียร์ตั้งแต่ขั้นตอน การเตรียมฟัน ไปจนถึงการดูแลให้สวยทนนานหลายปี',
      en: 'From procedure and tooth prep to long-term care for years of beautiful results.',
    },
  },
  {
    cat: 'pediatric',
    catLabel: { th: 'เด็ก', en: 'Pediatric' },
    date: { th: '8 พ.ค. 2026', en: 'May 8, 2026' },
    read: { th: 'อ่าน 3 นาที', en: '3 min read' },
    cover: 'assets/media/blog/cover-pediatric.webp',
    title: {
      th: 'พาลูกไปหาหมอฟันครั้งแรก เตรียมตัวอย่างไร',
      en: 'Your child’s first dental visit — how to prepare',
    },
    excerpt: {
      th: 'เคล็ดลับช่วยให้น้องไม่กลัวหมอฟัน ควรเริ่มพาไปตอนกี่ขวบ และต้องเตรียมอะไรบ้าง',
      en: 'Tips to ease your child’s fear, the right age to start, and what to bring.',
    },
  },
  {
    cat: 'general',
    catLabel: { th: 'ทั่วไป', en: 'General' },
    date: { th: '2 พ.ค. 2026', en: 'May 2, 2026' },
    read: { th: 'อ่าน 3 นาที', en: '3 min read' },
    cover: 'assets/media/blog/cover-night-pain.webp',
    title: {
      th: 'ปวดฟันตอนกลางคืน รับมือเบื้องต้นอย่างไร',
      en: 'Toothache at night — how to cope before your appointment',
    },
    excerpt: {
      th: 'วิธีบรรเทาปวดฟันเฉพาะหน้าอย่างปลอดภัย และสัญญาณที่บอกว่าต้องรีบพบทันตแพทย์',
      en: 'Safe ways to relieve sudden tooth pain, and signs you must see a dentist fast.',
    },
  },
  {
    cat: 'general',
    catLabel: { th: 'ทั่วไป', en: 'General' },
    date: { th: '25 เม.ย. 2026', en: 'Apr 25, 2026' },
    read: { th: 'อ่าน 2 นาที', en: '2 min read' },
    cover: 'assets/media/blog/cover-scaling.webp',
    title: {
      th: 'ขูดหินปูนบ่อยแค่ไหนถึงพอดี',
      en: 'How often should you really get a dental scaling?',
    },
    excerpt: {
      th: 'ทำไมหินปูนถึงทำให้เหงือกอักเสบ และความถี่ที่เหมาะสมในการขูดหินปูนสำหรับแต่ละคน',
      en: 'Why tartar inflames your gums, and the right scaling frequency for you.',
    },
  },
  {
    cat: 'implants',
    catLabel: { th: 'รากฟันเทียม', en: 'Implants' },
    date: { th: '18 เม.ย. 2026', en: 'Apr 18, 2026' },
    read: { th: 'อ่าน 5 นาที', en: '5 min read' },
    cover: 'assets/media/blog/cover-bridge.webp',
    title: {
      th: 'รากฟันเทียม vs สะพานฟัน ต่างกันอย่างไร',
      en: 'Implant vs bridge — what’s the difference?',
    },
    excerpt: {
      th: 'สองทางเลือกทดแทนฟันที่หายไป เปรียบเทียบความทนทาน การดูแล และความคุ้มค่าในระยะยาว',
      en: 'Two ways to replace missing teeth — durability, care and long-term value compared.',
    },
  },
  {
    cat: 'ortho',
    catLabel: { th: 'จัดฟัน', en: 'Orthodontics' },
    date: { th: '10 เม.ย. 2026', en: 'Apr 10, 2026' },
    read: { th: 'อ่าน 4 นาที', en: '4 min read' },
    cover: 'assets/media/blog/cover-braces-clean.webp',
    title: {
      th: 'ดูแลเครื่องมือจัดฟันอย่างไรให้ฟันสะอาด',
      en: 'Keeping teeth clean while wearing braces',
    },
    excerpt: {
      th: 'แปรงฟันและใช้ไหมขัดฟันอย่างถูกวิธีระหว่างจัดฟัน ลดความเสี่ยงฟันผุและเหงือกอักเสบ',
      en: 'Brush and floss correctly during treatment to avoid decay and gum problems.',
    },
  },
];

export const ARTICLE_CHIPS: { key: ArticleCat | 'all'; label: Localized }[] = [
  { key: 'all', label: { th: 'ทั้งหมด', en: 'All' } },
  { key: 'ortho', label: { th: 'จัดฟัน', en: 'Orthodontics' } },
  { key: 'implants', label: { th: 'รากฟันเทียม', en: 'Implants' } },
  { key: 'aesthetic', label: { th: 'ความงาม', en: 'Aesthetic' } },
  { key: 'pediatric', label: { th: 'เด็ก', en: 'Pediatric' } },
  { key: 'general', label: { th: 'ทั่วไป', en: 'General' } },
];

/**
 * The home-page blog teasers. `slug` points at the real article in Supabase, so the
 * card opens the piece itself rather than dropping the reader on the index — and the
 * covers are the same `cover_key` images the article pages use, so a card and the page
 * it opens show one picture, not two. Keep these in step with `articles.cover_key`.
 */
export const HOME_POSTS = [
  {
    slug: 'signs-you-need-braces',
    title: { th: '5 สัญญาณที่บอกว่าถึงเวลาจัดฟัน', en: '5 signs it is time for braces' },
    cat: { th: 'จัดฟัน', en: 'Orthodontics' },
    date: { th: '12 มิ.ย. 2026', en: 'Jun 12, 2026' },
    cover: 'assets/media/blog/cover-ortho.webp',
  },
  {
    slug: 'after-dental-implant-care',
    title: {
      th: 'ดูแลตัวเองอย่างไรหลังฝังรากฟันเทียม',
      en: 'Caring for yourself after an implant',
    },
    cat: { th: 'รากฟันเทียม', en: 'Implants' },
    date: { th: '5 มิ.ย. 2026', en: 'Jun 5, 2026' },
    cover: 'assets/media/blog/cover-implant-care.webp',
  },
  {
    slug: 'safe-teeth-whitening',
    title: { th: 'ฟอกสีฟันให้ขาวอย่างปลอดภัย', en: 'How to whiten your teeth safely' },
    cat: { th: 'ความงาม', en: 'Aesthetic' },
    date: { th: '28 พ.ค. 2026', en: 'May 28, 2026' },
    cover: 'assets/media/blog/cover-whitening.webp',
  },
];
