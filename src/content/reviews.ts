import type { Localized } from '@/lib/lang';

export interface Review {
  init: string;
  name: Localized;
  txt: Localized;
  svc: Localized;
  br: Localized;
}

export const REVIEWS: Review[] = [
  {
    init: 'พ',
    name: { th: 'คุณพิมพ์ชนก', en: 'Khun Pimchanok' },
    txt: {
      th: 'คุณหมออธิบายละเอียดทุกขั้นตอน บรรยากาศคลีนิกสะอาดและอบอุ่นมากค่ะ',
      en: 'The dentist explained every step clearly. The clinic is spotless and welcoming.',
    },
    svc: { th: 'จัดฟัน', en: 'Braces' },
    br: { th: 'สาขาบางกะปิ', en: 'Bang Kapi' },
  },
  {
    init: 'ธ',
    name: { th: 'คุณธนวัฒน์', en: 'Khun Thanawat' },
    txt: {
      th: 'ทำรากฟันเทียมที่นี่ ทีมงานดูแลดีมาก นัดง่าย ไม่ต้องรอนาน',
      en: 'Got an implant here — great team, easy booking, short waits.',
    },
    svc: { th: 'รากฟันเทียม', en: 'Implant' },
    br: { th: 'สาขาร่มเกล้า', en: 'Romklao' },
  },
  {
    init: 'ศ',
    name: { th: 'คุณศิริพร', en: 'Khun Siriporn' },
    txt: {
      th: 'พาลูกมาทำฟัน น้องไม่กลัวเลย คุณหมอใจดีและใจเย็นมาก',
      en: 'Brought my kid in — she was not scared at all. So patient and kind.',
    },
    svc: { th: 'ทันตกรรมเด็ก', en: 'Pediatric' },
    br: { th: 'สาขามีนบุรี', en: 'Min Buri' },
  },
  {
    init: 'K',
    name: { th: 'คุณกานต์', en: 'Khun Kan' },
    txt: {
      th: 'ฟอกสีฟันแล้วยิ้มมั่นใจขึ้นเยอะ ราคาคุ้มค่า บริการประทับใจ',
      en: 'Whitening boosted my confidence. Good value, lovely service.',
    },
    svc: { th: 'ฟอกสีฟัน', en: 'Whitening' },
    br: { th: 'สาขาพัทยา', en: 'Pattaya' },
  },
  {
    init: 'ณ',
    name: { th: 'คุณณัฐ', en: 'Khun Nat' },
    txt: {
      th: 'ทำวีเนียร์ออกมาธรรมชาติมาก ดูเป็นฟันเราจริง ๆ ไม่เฟค',
      en: 'My veneers look completely natural — exactly what I wanted.',
    },
    svc: { th: 'วีเนียร์', en: 'Veneers' },
    br: { th: 'สาขารามคำแหง', en: 'Ramkhamhaeng' },
  },
  {
    init: 'อ',
    name: { th: 'คุณอรอุมา', en: 'Khun Onuma' },
    txt: {
      th: 'ประทับใจความสะอาดและการฆ่าเชื้อเครื่องมือ มั่นใจทุกครั้งที่มา',
      en: 'Impressed by the hygiene and sterilization — I trust them every visit.',
    },
    svc: { th: 'ทั่วไป', en: 'General' },
    br: { th: 'สาขาเนินพลับหวาน', en: 'Noen Plap Wan' },
  },
];

/** The marquee needs the list twice so the -50% translate loops seamlessly. */
export const REVIEWS_LOOP = [...REVIEWS, ...REVIEWS];
