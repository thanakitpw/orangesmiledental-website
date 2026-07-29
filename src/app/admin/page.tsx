import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/** `head: true` returns the count and no rows, so these are four cheap queries. */
async function overview() {
  const supabase = await supabaseServer();
  const rows = (table: string) => supabase.from(table).select('*', { count: 'exact', head: true });

  const [published, drafts, media, missingAlt] = await Promise.all([
    rows('articles').eq('status', 'published'),
    rows('articles').neq('status', 'published'),
    rows('media_assets'),
    rows('media_assets').is('alt_th', null),
  ]);

  return {
    published: published.count ?? 0,
    drafts: drafts.count ?? 0,
    media: media.count ?? 0,
    missingAlt: missingAlt.count ?? 0,
  };
}

export default async function AdminHome() {
  const staff = await requireStaff();
  const { published, drafts, media, missingAlt } = await overview();

  return (
    <>
      <div className="a-head">
        <div>
          <h1>สวัสดี {staff.fullName || staff.email}</h1>
          <p>แก้ไขเนื้อหาที่นี่แล้วกดบันทึก หน้าเว็บจริงจะอัปเดตทันทีโดยไม่ต้องให้โปรแกรมเมอร์ deploy ใหม่</p>
        </div>
        <div className="a-actions">
          <Link className="a-btn a-btn--primary" href="/admin/articles/new">
            + เขียนบทความใหม่
          </Link>
        </div>
      </div>

      <div className="a-grid" style={{ marginBottom: 16 }}>
        <Link className="a-stat" href="/admin/articles">
          <u>บทความที่เผยแพร่</u>
          <b>{published}</b>
        </Link>
        <Link className="a-stat" href="/admin/articles">
          <u>ฉบับร่าง / รอตรวจ</u>
          <b>{drafts}</b>
        </Link>
        <Link className="a-stat" href="/admin/media">
          <u>รูปในคลัง</u>
          <b>{media}</b>
        </Link>
        <Link className="a-stat" href="/admin/media?missing_alt=1">
          <u>รูปที่ยังไม่มีคำอธิบาย</u>
          <b>{missingAlt}</b>
          <i>มีผลต่อ SEO</i>
        </Link>
      </div>

      {missingAlt > 0 && (
        <div className="a-note a-note--info">
          มีรูป {missingAlt} ใบที่ยังไม่มีคำอธิบายภาพ (alt text) — คำอธิบายภาพคือสิ่งที่ Google
          ใช้เข้าใจว่ารูปคืออะไร และเป็นสิ่งที่โปรแกรมอ่านหน้าจอใช้บอกผู้พิการทางสายตา
          ไม่ต้องทำทีเดียวจบ ค่อย ๆ เติมรูปที่ใช้บ่อยก่อนได้
        </div>
      )}

      <div className="a-panel">
        <h2>แก้อะไรได้บ้างที่นี่</h2>
        <p>ทุกอย่างในตารางนี้แก้จากหลังบ้านได้หมด ไม่ต้องแตะโค้ด</p>

        <div className="a-scroll">
          <table className="a-table">
            <thead>
              <tr>
                <th>เมนู</th>
                <th>ใช้แก้อะไร</th>
                <th>เห็นผลที่หน้าไหน</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Link href="/admin/articles">บทความ</Link>
                </td>
                <td>เขียน แก้ไข เผยแพร่ ตั้งผู้ตรวจทาน และ SEO</td>
                <td>/articles และการ์ด 3 ใบบนหน้าแรก</td>
              </tr>
              <tr>
                <td>
                  <Link href="/admin/media">คลังรูปภาพ</Link>
                </td>
                <td>อัปโหลดรูปใหม่ (ระบบบีบเป็น WebP ให้อัตโนมัติ) และใส่คำอธิบายภาพ</td>
                <td>ทุกหน้า</td>
              </tr>
              <tr>
                <td>
                  <Link href="/admin/reviews">รีวิวลูกค้า</Link>
                </td>
                <td>ข้อความรีวิวที่วิ่งเป็นแถบบนหน้าแรกและหน้ารีวิว</td>
                <td>หน้าแรก, /reviews</td>
              </tr>
              <tr>
                <td>
                  <Link href="/admin/cases">เคส Before/After</Link>
                </td>
                <td>รูปก่อน-หลัง คำบรรยาย ชื่อหมอและสาขาที่ทำเคส</td>
                <td>หน้าแรก, /reviews</td>
              </tr>
              <tr>
                <td>
                  <Link href="/admin/gallery">แกลเลอรีผลงาน</Link>
                </td>
                <td>รูปผลงานแยกตามประเภทการรักษา</td>
                <td>/reviews</td>
              </tr>
              <tr>
                <td>
                  <Link href="/admin/doctors">ทีมทันตแพทย์</Link>
                </td>
                <td>เพิ่ม-ลบหมอ รูป ประวัติ และความเชี่ยวชาญ</td>
                <td>/doctors และแถบรูปหมอบนหน้าแรก</td>
              </tr>
              <tr>
                <td>
                  <Link href="/admin/branches">สาขา</Link>
                </td>
                <td>ที่อยู่ เบอร์โทร LINE เวลาเปิด และพิกัดแผนที่</td>
                <td>/branches และหน้าแรก</td>
              </tr>
              <tr>
                <td>
                  <Link href="/admin/services">บริการ</Link>
                </td>
                <td>รายการบริการ ราคาเริ่มต้น และหัวข้อย่อย</td>
                <td>/services และหน้าแรก</td>
              </tr>
              <tr>
                <td>
                  <Link href="/admin/settings">ตั้งค่าเว็บไซต์</Link>
                </td>
                <td>เบอร์กลาง LINE Facebook อีเมล ที่อยู่สำนักงานใหญ่ เวลาทำการ</td>
                <td>ส่วนท้ายและปุ่มติดต่อทุกหน้า</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
