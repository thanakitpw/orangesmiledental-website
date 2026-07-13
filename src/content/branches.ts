import type { Localized } from '@/lib/lang';

export interface Branch {
  key: string;
  region: 'bkk' | 'pty';
  brand: string;
  accent: string;
  tint: string;
  photo: string;
  name: Localized;
  /** Short neighbourhood line, used on the home-page cards. */
  area: Localized;
  /** Full postal address, used on the Branches page. */
  address: Localized;
  hours: Localized;
  phone: string;
  telUrl: string;
  lineUrl: string;
  line: string;
  fbUrl: string;
  /** Free-text query behind the embedded map. */
  mapQuery: string;
  /** Canonical Google Maps short link. */
  mapUrl: string;
}

const HOURS: Localized = { th: 'เปิดทุกวัน 10:30–19:00 น.', en: 'Open daily 10:30–19:00' };

export const BRANCHES: Branch[] = [
  {
    key: 'romklao',
    region: 'bkk',
    brand: 'Orange Smile',
    accent: '#FF7A00',
    tint: '#FFF3E8',
    photo: 'assets/branches/romklao.webp',
    name: { th: 'สาขาร่มเกล้า (สนง.ใหญ่)', en: 'Romklao (HQ)' },
    area: { th: 'การเคหะร่มเกล้า • ลาดกระบัง', en: 'Romklao • Lat Krabang' },
    address: {
      th: '320/46 แขวงคลองสองต้นนุ่น เขตลาดกระบัง กรุงเทพมหานคร 10520',
      en: '320/46 Khlong Song Ton Nun, Lat Krabang, Bangkok 10520',
    },
    hours: HOURS,
    phone: '094-420-9555',
    telUrl: 'tel:0944209555',
    lineUrl: 'https://lin.ee/OOoqOa3',
    line: '@orangerk',
    fbUrl: 'https://www.facebook.com/orangesmileromklao/',
    mapQuery: 'การเคหะร่มเกล้า ลาดกระบัง กรุงเทพ',
    mapUrl: 'https://maps.app.goo.gl/Fywau2vbChoKU7wt7',
  },
  {
    key: 'minburi',
    region: 'bkk',
    brand: 'Orange Smile',
    accent: '#FF7A00',
    tint: '#FFF3E8',
    photo: 'assets/branches/minburi.webp',
    name: { th: 'สาขาตลาดมีนบุรี', en: 'Min Buri Market' },
    area: { th: 'ทางขึ้น BTS ตลาดมีนบุรี', en: 'By Min Buri BTS' },
    address: {
      th: '196,198 ถ.สีหบุรีนุกิจ แขวงมีนบุรี เขตมีนบุรี กรุงเทพมหานคร 10510',
      en: '196,198 Sihaburanukit Rd, Min Buri, Bangkok 10510',
    },
    hours: HOURS,
    phone: '098-895-8585',
    telUrl: 'tel:0988958585',
    lineUrl: 'https://lin.ee/YaWm8gP',
    line: '@orangeminburi',
    fbUrl: 'https://www.facebook.com/orangesmileminburi/',
    mapQuery: 'ตลาดมีนบุรี กรุงเทพ',
    mapUrl: 'https://maps.app.goo.gl/MPhxU6X1yQejbTVC9',
  },
  {
    key: 'bangkapi',
    region: 'bkk',
    brand: 'Orange Smile',
    accent: '#FF7A00',
    tint: '#FFF3E8',
    photo: 'assets/branches/bangkapi.webp',
    name: { th: 'สาขาบางกะปิ', en: 'Bang Kapi' },
    area: { th: 'ข้างศูนย์การค้า Happy Land', en: 'Beside Happy Land' },
    address: {
      th: '4 ซอยศูนย์การค้าแฮปปี้แลนด์ ถ.แฮปปี้แลนด์สาย 2 แขวงคลองจั่น เขตบางกะปิ กรุงเทพมหานคร 10240',
      en: '4 Happy Land Plaza Soi, Happy Land 2 Rd, Khlong Chan, Bang Kapi, Bangkok 10240',
    },
    hours: HOURS,
    phone: '099-228-8998',
    telUrl: 'tel:0992288998',
    lineUrl: 'https://lin.ee/pqURLgN',
    line: '@orangebkk',
    fbUrl: 'https://www.facebook.com/orangesmiledentalclinicthemallbangkapi/',
    mapQuery: 'Happy Land บางกะปิ กรุงเทพ',
    mapUrl: 'https://maps.app.goo.gl/NwZvmUwvEojrqqXm8',
  },
  {
    key: 'ramkhamhaeng',
    region: 'bkk',
    brand: 'Orange Smile',
    accent: '#FF7A00',
    tint: '#FFF3E8',
    photo: 'assets/branches/ramkhamhaeng.webp',
    name: { th: 'สาขารามคำแหง', en: 'Ramkhamhaeng' },
    area: { th: 'หน้าซอยรามคำแหง 53', en: 'Ramkhamhaeng Soi 53' },
    address: {
      th: '44/21 ถ.รามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพมหานคร 10240',
      en: '44/21 Ramkhamhaeng Rd, Hua Mak, Bang Kapi, Bangkok 10240',
    },
    hours: HOURS,
    phone: '087-685-5995',
    telUrl: 'tel:0876855995',
    lineUrl: 'https://lin.ee/QYV5ZLU',
    line: '@orangeram',
    fbUrl: 'https://www.facebook.com/orangesmiledentalclinicramkhamhaeng/',
    mapQuery: 'รามคำแหง 53 กรุงเทพ',
    mapUrl: 'https://maps.app.goo.gl/j9nmMvuNxNp7RkKw6',
  },
  {
    key: 'chaosua',
    region: 'pty',
    brand: 'Dr.Amon Dental',
    accent: '#1FA39B',
    tint: '#E7F5F3',
    photo: 'assets/branches/chaosua.webp',
    name: { th: 'สาขาตลาดเจ้าสัว', en: 'Chao Sua Market' },
    area: { th: 'ต.หนองปรือ บางละมุง ชลบุรี', en: 'Nong Prue, Bang Lamung' },
    address: {
      th: '20 ม.5 ต.หนองปรือ อ.บางละมุง จ.ชลบุรี 20150',
      en: '20 Moo 5, Nong Prue, Bang Lamung, Chonburi 20150',
    },
    hours: HOURS,
    phone: '095-589-9559',
    telUrl: 'tel:0955899559',
    lineUrl: 'https://lin.ee/neDONWo',
    line: '@dr.amonjs',
    fbUrl: 'https://www.facebook.com/Amonpattaya/',
    mapQuery: 'ตลาดเจ้าสัว หนองปรือ พัทยา',
    mapUrl: 'https://maps.app.goo.gl/BcoEbsFeZmFpHZzA9',
  },
  {
    key: 'noenplapwan',
    region: 'pty',
    brand: 'Dr.Amon Dental',
    accent: '#1FA39B',
    tint: '#E7F5F3',
    photo: 'assets/branches/noenplapwan.webp',
    name: { th: 'สาขาเนินพลับหวาน', en: 'Noen Plap Wan' },
    area: { th: 'เนินพลับหวาน หนองปรือ', en: 'Noen Plap Wan, Nong Prue' },
    address: {
      th: '67/54-55 ม.5 ต.หนองปรือ อ.บางละมุง จ.ชลบุรี 20150',
      en: '67/54-55 Moo 5, Nong Prue, Bang Lamung, Chonburi 20150',
    },
    hours: HOURS,
    phone: '082-468-0345',
    telUrl: 'tel:0824680345',
    lineUrl: 'https://lin.ee/9yXSXnq',
    line: '@dr.amonsmile',
    fbUrl: 'https://www.facebook.com/Dr.amondentalclinic/',
    mapQuery: 'เนินพลับหวาน หนองปรือ พัทยา',
    mapUrl: 'https://maps.app.goo.gl/oR44N9Kfm5YeaWF89',
  },
  {
    key: 'wanasin',
    region: 'pty',
    brand: 'Pink Smile Dental',
    accent: '#FF5FA2',
    tint: '#FFEAF3',
    photo: 'assets/branches/wanasin.webp',
    name: { th: 'สาขาไร่วนาสินธุ์ (Pink Smile)', en: 'Wanasin (Pink Smile)' },
    area: { th: 'สยามคันทรีคลับ หนองปรือ', en: 'Siam Country Club, Nong Prue' },
    address: {
      th: '19/116-117 หมู่ 6 สยามคันทรี่คลับ ต.หนองปรือ อ.บางละมุง จ.ชลบุรี 20150',
      en: '19/116-117 Moo 6, Siam Country Club, Nong Prue, Bang Lamung, Chonburi 20150',
    },
    hours: HOURS,
    phone: '080-569-5353',
    telUrl: 'tel:0805695353',
    lineUrl: 'https://lin.ee/OfDHxqC',
    line: '@pinksmiledental',
    fbUrl: 'https://www.facebook.com/pinksmiledental',
    mapQuery: 'สยามคันทรีคลับ พัทยา ชลบุรี',
    mapUrl: 'https://maps.app.goo.gl/NK74jSiTRTDzHRcB8',
  },
];

export const BRANCHES_BKK = BRANCHES.filter((b) => b.region === 'bkk');
export const BRANCHES_PTY = BRANCHES.filter((b) => b.region === 'pty');

/** Embedded-map src for a branch, matching `embed()` in Branches.dc.html. */
export const mapEmbed = (b: Branch) =>
  `https://www.google.com/maps?q=${encodeURIComponent(b.mapQuery)}&z=15&output=embed`;
