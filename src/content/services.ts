import type { Localized } from '@/lib/lang';
import { p, type IconShape } from '@/components/Icon';

const O = '#FF7A00';
const T = '#1FA39B';
const P = '#FF5FA2';
const G = '#8FB09A';
const A = '#FFB04D';

/** The eight cards in the home-page services grid. */
export interface HomeService {
  color: string;
  tint: string;
  photo: string;
  name: Localized;
  desc: Localized;
  icon: IconShape[];
}

export const HOME_SERVICES: HomeService[] = [
  {
    color: O,
    tint: '#FFF3E8',
    photo: 'assets/services/general.webp',
    name: { th: 'ทันตกรรมทั่วไป', en: 'General Dentistry' },
    desc: { th: 'ตรวจ ขูดหินปูน อุดฟัน ดูแลช่องปาก', en: 'Check-ups, scaling & fillings' },
    icon: [
      p('M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z'),
      p('M3.5 12H8l1-2 2 5 2-7 1.4 4H21'),
    ],
  },
  {
    color: O,
    tint: '#FFF3E8',
    photo: 'assets/services/ortho-exam.webp',
    name: { th: 'ทันตกรรมจัดฟัน', en: 'Orthodontics' },
    desc: { th: 'เหล็ก / ใส Invisalign โดยทีมเฉพาะทาง', en: 'Metal & Invisalign aligners' },
    icon: [
      { el: 'circle', attrs: { cx: 12, cy: 12, r: 10 } },
      p('M8 14s1.5 2 4 2 4-2 4-2'),
      { el: 'line', attrs: { x1: 9, y1: 9, x2: 9.01, y2: 9 } },
      { el: 'line', attrs: { x1: 15, y1: 9, x2: 15.01, y2: 9 } },
    ],
  },
  {
    color: T,
    tint: '#E7F5F3',
    photo: 'assets/services/implant.webp',
    name: { th: 'รากฟันเทียม', en: 'Dental Implants' },
    desc: { th: 'ทดแทนฟันที่หายไป มั่นคงเหมือนฟันจริง', en: 'Replace missing teeth naturally' },
    icon: [
      { el: 'circle', attrs: { cx: 12, cy: 5, r: 3 } },
      { el: 'line', attrs: { x1: 12, y1: 22, x2: 12, y2: 8 } },
      p('M5 12H2a10 10 0 0 0 20 0h-3'),
    ],
  },
  {
    color: G,
    tint: '#EEF3EE',
    photo: 'assets/services/rootcanal.webp',
    name: { th: 'รักษาคลองรากฟัน', en: 'Root Canal' },
    desc: { th: 'รักษาฟันที่ติดเชื้อให้กลับมาใช้งานได้', en: 'Save infected teeth' },
    icon: [
      p('M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'),
      p('m9 12 2 2 4-4'),
    ],
  },
  {
    color: O,
    tint: '#FFF3E8',
    photo: 'assets/services/prostho-implant.webp',
    name: { th: 'ทันตกรรมประดิษฐ์', en: 'Prosthodontics' },
    desc: { th: 'ครอบ สะพานฟัน และฟันปลอม', en: 'Crowns, bridges & dentures' },
    icon: [p('m2 4 3.5 13h13L22 4l-5.5 6L12 3 7.5 10z'), p('M5.5 21h13')],
  },
  {
    color: P,
    tint: '#FFEAF3',
    photo: 'assets/services/veneer-smile.webp',
    name: { th: 'วีเนียร์ & ความงาม', en: 'Veneers & Aesthetic' },
    desc: { th: 'ออกแบบรอยยิ้มให้เป็นธรรมชาติ', en: 'Designed natural smiles' },
    icon: [
      p('M9.9 15.5 8.5 14 2.4 12.4a.5.5 0 0 1 0-1L8.5 9.9 9.9 3.8a.5.5 0 0 1 1 0l1.5 6.1 6.1 1.5a.5.5 0 0 1 0 1l-6.1 1.5-1.5 6.1a.5.5 0 0 1-1 0z'),
      p('M20 3v4M22 5h-4'),
    ],
  },
  {
    color: A,
    tint: '#FFF3E8',
    photo: 'assets/services/whitening-light.webp',
    name: { th: 'ฟอกสีฟัน', en: 'Teeth Whitening' },
    desc: { th: 'ฟันขาวสดใสอย่างปลอดภัย', en: 'Brighter teeth, safely' },
    icon: [
      { el: 'circle', attrs: { cx: 12, cy: 12, r: 4 } },
      p('M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4'),
    ],
  },
  {
    color: T,
    tint: '#E7F5F3',
    photo: 'assets/services/pediatric.webp',
    name: { th: 'ทันตกรรมเด็ก', en: 'Pediatric' },
    desc: { th: 'ดูแลฟันน้อง ๆ อย่างอ่อนโยน', en: 'Gentle care for kids' },
    icon: [p('M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5z'), p('M9 12h6M12 9v6')],
  },
];

/** The richer cards on the Services page: price, bullet list, longer copy. */
export interface Service {
  accent: string;
  photo: string;
  name: Localized;
  price: Localized;
  desc: Localized;
  items: Localized[];
  icon: IconShape[];
}

export const SERVICES: Service[] = [
  {
    accent: O,
    photo: 'assets/services/general.webp',
    name: { th: 'ทันตกรรมทั่วไป', en: 'General Dentistry' },
    price: { th: 'เริ่ม 300฿', en: 'from ฿300' },
    icon: [p('M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z')],
    desc: {
      th: 'ตรวจสุขภาพช่องปาก ขูดหินปูน อุดฟัน และถอนฟัน ดูแลพื้นฐานครบในที่เดียว',
      en: 'Check-ups, scaling, fillings and extractions — all your basics in one place.',
    },
    items: [
      { th: 'ตรวจและให้คำปรึกษา', en: 'Exam & consultation' },
      { th: 'ขูดหินปูน + ขัดฟัน', en: 'Scaling & polishing' },
      { th: 'อุดฟันสีเหมือนฟัน', en: 'Tooth-coloured fillings' },
    ],
  },
  {
    accent: O,
    photo: 'assets/services/ortho-exam.webp',
    name: { th: 'ทันตกรรมจัดฟัน', en: 'Orthodontics' },
    price: { th: 'ผ่อน 0%', en: '0% plan' },
    icon: [p('M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5z'), p('M9 12h6M12 9v6')],
    desc: {
      th: 'จัดฟันเหล็ก ดามอน และจัดฟันใส Invisalign วางแผนด้วยระบบดิจิทัล 3 มิติ',
      en: 'Metal, Damon and Invisalign clear aligners, planned with 3D digital systems.',
    },
    items: [
      { th: 'จัดฟันเหล็ก / ดามอน', en: 'Metal & Damon braces' },
      { th: 'Invisalign จัดฟันใส', en: 'Invisalign clear aligners' },
      { th: 'ผ่อนชำระ 0% ได้', en: '0% installment available' },
    ],
  },
  {
    accent: O,
    photo: 'assets/services/implant.webp',
    name: { th: 'รากฟันเทียม', en: 'Dental Implants' },
    price: { th: 'เริ่ม 25,000฿', en: 'from ฿25,000' },
    icon: [p('M12 5v14'), p('M5 12H2a10 10 0 0 0 20 0h-3'), p('M12 5a3 3 0 1 0 0-3 3 3 0 0 0 0 3')],
    desc: {
      th: 'ทดแทนฟันที่หายไปอย่างมั่นคง ด้วยรากเทียมคุณภาพและระบบนำทางดิจิทัล',
      en: 'Securely replace missing teeth with quality implants and digital-guided surgery.',
    },
    items: [
      { th: 'รากเทียมนำเข้าได้มาตรฐาน', en: 'Certified implant systems' },
      { th: 'ผ่าตัดแบบนำทางดิจิทัล', en: 'Digital-guided placement' },
      { th: 'รับประกันงานรากเทียม', en: 'Implant warranty' },
    ],
  },
  {
    accent: T,
    photo: 'assets/services/rootcanal.webp',
    name: { th: 'รักษาคลองรากฟัน', en: 'Root Canal' },
    price: { th: 'เริ่ม 4,000฿', en: 'from ฿4,000' },
    icon: [p('M12 22s-8-6-8-12a8 8 0 0 1 16 0c0 6-8 12-8 12Z'), p('M12 8v6')],
    desc: {
      th: 'รักษาฟันที่ติดเชื้อด้วยกล้องไมโครสโคป ช่วยเก็บฟันธรรมชาติไว้ใช้งานได้นาน',
      en: 'Microscope-assisted therapy to save infected teeth and keep them for years.',
    },
    items: [
      { th: 'รักษาด้วยกล้องไมโครสโคป', en: 'Microscope-assisted' },
      { th: 'ลดอาการปวดและการอักเสบ', en: 'Relieves pain & infection' },
      { th: 'ครอบฟันต่อเนื่องได้', en: 'Crown follow-up available' },
    ],
  },
  {
    accent: O,
    photo: 'assets/services/prostho-implant.webp',
    name: { th: 'ทันตกรรมประดิษฐ์', en: 'Prosthodontics' },
    price: { th: 'เริ่ม 8,000฿', en: 'from ฿8,000' },
    icon: [p('M3 7h18M3 7l1 12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2l1-12'), p('M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2')],
    desc: {
      th: 'ครอบฟัน สะพานฟัน และฟันปลอม ออกแบบให้พอดี สวยงาม และใช้งานได้จริง',
      en: 'Crowns, bridges and dentures designed to fit, look natural and work well.',
    },
    items: [
      { th: 'ครอบฟันเซรามิก', en: 'Ceramic crowns' },
      { th: 'สะพานฟัน', en: 'Dental bridges' },
      { th: 'ฟันปลอมถอดได้', en: 'Removable dentures' },
    ],
  },
  {
    accent: P,
    photo: 'assets/services/veneer-smile.webp',
    name: { th: 'วีเนียร์ & ออกแบบรอยยิ้ม', en: 'Veneers & Smile Design' },
    price: { th: 'เริ่ม 9,000฿', en: 'from ฿9,000' },
    icon: [p('M9.9 15.5 8.5 14l-6.1-1.6a.5.5 0 0 1 0-1L8.5 9.9 9.9 3.8a.5.5 0 0 1 1 0l1.5 6.1 6.1 1.5a.5.5 0 0 1 0 1l-6.1 1.5-1.5 6.1a.5.5 0 0 1-1 0z')],
    desc: {
      th: 'ออกแบบรอยยิ้มให้เข้ากับโครงหน้า ด้วยวีเนียร์ที่ดูเป็นธรรมชาติ',
      en: 'Smile makeovers tailored to your face with natural-looking veneers.',
    },
    items: [
      { th: 'ออกแบบรอยยิ้มดิจิทัล', en: 'Digital smile design' },
      { th: 'วีเนียร์เซรามิก', en: 'Ceramic veneers' },
      { th: 'ปรึกษาก่อนทำจริง', en: 'Preview before treatment' },
    ],
  },
  {
    accent: O,
    photo: 'assets/services/whitening-light.webp',
    name: { th: 'ฟอกสีฟัน', en: 'Teeth Whitening' },
    price: { th: 'เริ่ม 2,500฿', en: 'from ฿2,500' },
    icon: [
      p('M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4'),
      p('M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8'),
    ],
    desc: {
      th: 'ฟันขาวสดใสอย่างปลอดภัย ทั้งแบบฟอกที่คลินิกและชุดฟอกกลับบ้าน',
      en: 'Brighter teeth, safely — both in-clinic and take-home whitening kits.',
    },
    items: [
      { th: 'ฟอกสีฟันด้วยแสง', en: 'Light-activated whitening' },
      { th: 'ชุดฟอกกลับบ้าน', en: 'Take-home kits' },
      { th: 'ปลอดภัยต่อเคลือบฟัน', en: 'Enamel-safe' },
    ],
  },
  {
    accent: T,
    photo: 'assets/services/pediatric.webp',
    name: { th: 'ทันตกรรมเด็ก', en: 'Pediatric Dentistry' },
    price: { th: 'เริ่ม 300฿', en: 'from ฿300' },
    icon: [
      p('M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'),
      p('M15 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'),
      p('M12 14c-3 0-6 2-6 5h12c0-3-3-5-6-5Z'),
    ],
    desc: {
      th: 'ดูแลฟันน้อง ๆ อย่างอ่อนโยน เคลือบฟลูออไรด์ เคลือบหลุมร่องฟัน ในบรรยากาศเป็นมิตร',
      en: 'Gentle kids’ care — fluoride, sealants and a friendly, fear-free atmosphere.',
    },
    items: [
      { th: 'เคลือบฟลูออไรด์', en: 'Fluoride treatment' },
      { th: 'เคลือบหลุมร่องฟัน', en: 'Pit & fissure sealants' },
      { th: 'สร้างทัศนคติที่ดีต่อการทำฟัน', en: 'Builds positive habits' },
    ],
  },
];

/** The three benefit cards under the Services process section. */
export const SERVICE_PERKS = [
  {
    tint: '#FFF3E8',
    accent: O,
    h: { th: 'ผ่อน 0% นานสูงสุด 10 เดือน', en: '0% for up to 10 months' },
    d: {
      th: 'สำหรับงานจัดฟันและรากฟันเทียม ผ่านบัตรเครดิตที่ร่วมรายการ',
      en: 'For braces & implants via participating credit cards.',
    },
    icon: [p('M3 7h18v10H3z'), p('M3 11h18')],
  },
  {
    tint: '#E7F5F3',
    accent: T,
    h: { th: 'ฆ่าเชื้อมาตรฐานสากล', en: 'Hospital-grade sterilization' },
    d: {
      th: 'เครื่องมือทุกชิ้นผ่านการฆ่าเชื้อและบรรจุแยกทุกครั้ง',
      en: 'Every instrument sterilized and individually packed.',
    },
    icon: [p('M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5z'), p('m9 12 2 2 4-4')],
  },
  {
    tint: '#FFEAF3',
    accent: P,
    h: { th: 'นัดหมายง่ายผ่านไลน์', en: 'Easy LINE booking' },
    d: {
      th: 'ทักไลน์เลือกวันเวลาที่สะดวก ลดเวลารอคิวหน้าร้าน',
      en: 'Pick your slot on LINE and cut waiting time.',
    },
    icon: [p('M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z')],
  },
];

export interface Step {
  n: string;
  h: Localized;
  d: Localized;
}

/**
 * The four-step process appears on both the home and Services pages, but the
 * copy for steps 03 and 04 is worded slightly differently on each. Keeping the
 * two lists separate preserves that.
 */
export const HOME_STEPS: Step[] = [
  {
    n: '01',
    h: { th: 'ปรึกษา', en: 'Consult' },
    d: {
      th: 'ทักไลน์หรือเดินเข้ามา เล่าอาการและความต้องการให้เราฟัง',
      en: 'Message or walk in — tell us your concern and goals.',
    },
  },
  {
    n: '02',
    h: { th: 'ตรวจ & วางแผน', en: 'Exam & plan' },
    d: {
      th: 'ตรวจช่องปาก เอกซเรย์ และวางแผนการรักษาพร้อมประเมินราคา',
      en: 'Oral exam, X-ray and a treatment plan with a clear quote.',
    },
  },
  {
    n: '03',
    h: { th: 'รักษา', en: 'Treatment' },
    d: {
      th: 'ดำเนินการโดยทันตแพทย์เฉพาะทาง ด้วยเครื่องมือมาตรฐาน',
      en: 'Carried out by specialist dentists with standardized equipment.',
    },
  },
  {
    n: '04',
    h: { th: 'ติดตามผล', en: 'Follow-up' },
    d: {
      th: 'นัดติดตามผลและแนะนำการดูแลต่อเนื่องที่บ้าน',
      en: 'Follow-up visits and guidance for ongoing home care.',
    },
  },
];

export const SERVICE_STEPS: Step[] = [
  HOME_STEPS[0],
  HOME_STEPS[1],
  {
    n: '03',
    h: { th: 'รักษา', en: 'Treatment' },
    d: {
      th: 'ดำเนินการรักษาโดยทันตแพทย์เฉพาะทาง ด้วยเครื่องมือมาตรฐาน',
      en: 'Treatment by specialist dentists using standardized equipment.',
    },
  },
  {
    n: '04',
    h: { th: 'ติดตามผล', en: 'Follow-up' },
    d: {
      th: 'นัดติดตามผลและให้คำแนะนำการดูแลต่อเนื่องที่บ้าน',
      en: 'Follow-up visits and guidance for ongoing home care.',
    },
  },
];
