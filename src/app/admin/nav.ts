/**
 * The back-office menu, in one place.
 *
 * Grouped the way the clinic thinks about the site rather than the way the
 * database is laid out: "things we publish" (articles, images) sit apart from
 * "facts about the clinic" (branches, opening hours) because the first changes
 * weekly and the second changes when something real happens.
 */
export interface NavItem {
  href: string;
  label: string;
  /** Key into the counts map the layout fetches; omit for pages with no list. */
  count?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    title: 'เนื้อหา',
    items: [
      { href: '/admin', label: 'ภาพรวม' },
      { href: '/admin/articles', label: 'บทความ', count: 'articles' },
      { href: '/admin/media', label: 'คลังรูปภาพ', count: 'media' },
    ],
  },
  {
    title: 'หน้าเว็บ',
    items: [
      { href: '/admin/reviews', label: 'รีวิวลูกค้า', count: 'reviews' },
      { href: '/admin/cases', label: 'เคส Before/After', count: 'cases' },
      { href: '/admin/gallery', label: 'แกลเลอรีผลงาน', count: 'gallery' },
      { href: '/admin/doctors', label: 'ทีมทันตแพทย์', count: 'doctors' },
    ],
  },
  {
    title: 'ข้อมูลคลินิก',
    items: [
      { href: '/admin/branches', label: 'สาขา', count: 'branches' },
      { href: '/admin/services', label: 'บริการ', count: 'services' },
      { href: '/admin/settings', label: 'ตั้งค่าเว็บไซต์' },
    ],
  },
];
