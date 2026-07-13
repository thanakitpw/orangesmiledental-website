import type { Localized } from '@/lib/lang';

export interface Doctor {
  name: string;
  photo: string;
  role: Localized;
  tags: Localized[];
  bio: Localized;
}

/** The three bios cycle across the roster, exactly as in Doctors.dc.html. */
const BIOS: Localized[] = [
  {
    th: 'ดูแลคนไข้ด้วยความใส่ใจในทุกขั้นตอน มุ่งเน้นการรักษาที่ปลอดภัยและสบายใจ',
    en: 'Caring for every patient at each step, focused on safe and comfortable treatment.',
  },
  {
    th: 'ให้บริการทันตกรรมด้วยมาตรฐานและความเป็นมืออาชีพ พร้อมรับฟังทุกความกังวลของคนไข้',
    en: 'Delivering dental care with professional standards and a genuine ear for every concern.',
  },
  {
    th: 'ทันตแพทย์ประจำคลินิก พร้อมดูแลสุขภาพช่องปากของคุณและครอบครัวอย่างเต็มใจ',
    en: 'A resident dentist, ready to care for your and your family’s oral health.',
  },
];

const ROLE: Localized = { th: 'ทันตแพทย์', en: 'Dentist' };
const TAG_GENERAL: Localized = { th: 'ทันตกรรมทั่วไป', en: 'General dentistry' };

const ROSTER: { name: string; photo: string }[] = [
  { name: 'ทพญ. เอมอร ฤทธี', photo: 'assets/team/doc14.webp' },
  { name: 'ทพ. ธนกร หวังดำรงวงศ์', photo: 'assets/team/doc1.webp' },
  { name: 'ทพญ. ชาลินี อภิวันท์', photo: 'assets/team/doc7.webp' },
  { name: 'ทพ. ปองวิชญ์ กลัดเข็มทอง', photo: 'assets/team/doc2.webp' },
  { name: 'ทพญ. ณัฐชยา วงศ์ตั้งตน', photo: 'assets/team/doc8.webp' },
  { name: 'ทพ. วิรัช จิตต์รุ่งเรืองชัย', photo: 'assets/team/doc3.webp' },
  { name: 'ทพญ. ณิชา โฆษิตกิตติวณิชย์', photo: 'assets/team/doc9.webp' },
  { name: 'ทพ. ศุภมิตร ขนาดไต์', photo: 'assets/team/doc4.webp' },
  { name: 'ทพญ. พัชราภรณ์ ต้นเรือง', photo: 'assets/team/doc10.webp' },
  { name: 'ทพ. ศุภวัฒน์ สุวัฒนา', photo: 'assets/team/doc5.webp' },
  { name: 'ทพญ. มาริสา บำเพ็ญทาน', photo: 'assets/team/doc11.webp' },
  { name: 'ทพ. สิทธิกร เทพเอื้อตระกูล', photo: 'assets/team/doc6.webp' },
  { name: 'ทพญ. รติรัตน์ จิวเดช', photo: 'assets/team/doc12.webp' },
  { name: 'ทพญ. สาณิศา ตระกูลมุทุตา', photo: 'assets/team/doc13.webp' },
];

export const DOCTORS: Doctor[] = ROSTER.map((d, i) => ({
  ...d,
  role: ROLE,
  tags: [TAG_GENERAL],
  bio: BIOS[i % 3],
}));

/** Faces stacked inside the hero pill. */
export const HERO_FACES = [
  'assets/team/doc14.webp',
  'assets/team/doc1.webp',
  'assets/team/doc7.webp',
  'assets/team/doc2.webp',
];
