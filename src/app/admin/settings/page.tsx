import { requireStaff } from '@/lib/auth';
import { getSingleton } from '@/lib/admin/rows';
import { EntityForm } from '@/components/admin/EntityForm';
import { PairField } from '@/components/admin/PairField';
import { saveSettings } from './actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  await requireStaff();
  const row = await getSingleton('site_settings');

  return (
    <EntityForm
      // Not null, so EntityForm renders "บันทึกการแก้ไข" rather than "สร้าง" —
      // there is exactly one settings row and it always exists.
      id="1"
      title="ตั้งค่าเว็บไซต์"
      subtitle="ข้อมูลติดต่อของสำนักงานใหญ่ ใช้ในส่วนท้ายและปุ่มติดต่อของทุกหน้า — ไม่ใช่ข้อมูลรายสาขา (แก้รายสาขาที่เมนู “สาขา”)"
      backHref="/admin"
      backLabel="← กลับหน้าภาพรวม"
      saveAction={saveSettings}
      updateLabel="บันทึกการตั้งค่า"
    >
      <div className="a-panel">
        <h2>ช่องทางติดต่อ</h2>
        <p>ปุ่ม “ทักไลน์” และ “โทรเลย” ที่อยู่บนเกือบทุกหน้าใช้ค่าจากตรงนี้</p>

        <div className="a-row">
          <div className="a-field">
            <label htmlFor="phone">เบอร์โทรหลัก</label>
            <input
              id="phone"
              name="phone"
              className="a-input"
              required
              defaultValue={row?.phone ?? ''}
              placeholder="094-420-9555"
            />
            <small>ใส่ขีดได้ ระบบสร้างลิงก์กดโทรให้อัตโนมัติ</small>
          </div>

          <div className="a-field">
            <label htmlFor="email">อีเมล</label>
            <input
              id="email"
              name="email"
              type="email"
              className="a-input"
              defaultValue={row?.email ?? ''}
              placeholder="orangesmiledental@gmail.com"
            />
          </div>
        </div>

        <div className="a-row">
          <div className="a-field">
            <label htmlFor="line_url">ลิงก์ LINE</label>
            <input
              id="line_url"
              name="line_url"
              type="url"
              className="a-input"
              required
              defaultValue={row?.line_url ?? ''}
              placeholder="https://lin.ee/…"
            />
          </div>

          <div className="a-field">
            <label htmlFor="fb_url">ลิงก์ Facebook</label>
            <input
              id="fb_url"
              name="fb_url"
              type="url"
              className="a-input"
              defaultValue={row?.fb_url ?? ''}
              placeholder="https://www.facebook.com/…"
            />
          </div>
        </div>
      </div>

      <div className="a-panel">
        <h2>ที่อยู่และเวลาทำการ</h2>

        <PairField
          name="address"
          label="ที่อยู่สำนักงานใหญ่"
          th={row?.address_th}
          en={row?.address_en}
          textarea
          rows={2}
        />
        <PairField
          name="hours"
          label="เวลาทำการ"
          th={row?.hours_th}
          en={row?.hours_en}
          placeholderTh="เปิดบริการทุกวัน 10:30–19:00 น."
          placeholderEn="Open daily 10:30–19:00"
        />
        <PairField
          name="legal_name"
          label="ชื่อนิติบุคคล"
          hint="ใช้ในส่วนลิขสิทธิ์ท้ายเว็บ และในข้อมูลที่ส่งให้ Google"
          th={row?.legal_name_th}
          en={row?.legal_name_en}
        />
      </div>
    </EntityForm>
  );
}
