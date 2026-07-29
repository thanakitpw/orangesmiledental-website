import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { getRow } from '@/lib/admin/rows';
import { EntityForm } from '@/components/admin/EntityForm';
import { PairField } from '@/components/admin/PairField';
import { MediaField } from '@/components/admin/MediaField';
import { ColorField } from '@/components/admin/ColorField';
import { saveBranch, deleteBranch } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditBranchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const { saved } = await searchParams;

  const row = await getRow('branches', id);
  if (id !== 'new' && !row) notFound();

  return (
    <EntityForm
      id={row?.id ?? null}
      title={row ? `แก้ไข${row.name_th}` : 'เพิ่มสาขาใหม่'}
      subtitle="ข้อมูลนี้ใช้ทั้งบนหน้าแรก หน้าสาขา และส่วนท้ายของทุกหน้า"
      backHref="/admin/branches"
      saveAction={saveBranch}
      deleteAction={deleteBranch}
      deleteLabel={row?.name_th}
      justCreated={Boolean(saved)}
      createLabel="เพิ่มสาขา"
    >
      <div className="a-panel">
        <h2>ชื่อและที่ตั้ง</h2>

        <PairField name="name" label="ชื่อสาขา" th={row?.name_th} en={row?.name_en} required />
        <PairField
          name="area"
          label="ย่าน (บรรทัดสั้น)"
          hint="ใช้บนการ์ดหน้าแรก เช่น การเคหะร่มเกล้า • ลาดกระบัง"
          th={row?.area_th}
          en={row?.area_en}
        />
        <PairField
          name="address"
          label="ที่อยู่เต็ม"
          hint="ใช้บนหน้าสาขา"
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
          placeholderTh="เปิดทุกวัน 10:30–19:00 น."
          placeholderEn="Open daily 10:30–19:00"
        />

        <MediaField
          name="photo"
          label="รูปหน้าร้าน"
          category="branches"
          defaultValue={row?.photo ?? ''}
        />
      </div>

      <div className="a-panel">
        <h2>ติดต่อ</h2>
        <p>ปุ่มโทรและปุ่มไลน์บนการ์ดสาขาใช้ค่าจากตรงนี้</p>

        <div className="a-row">
          <div className="a-field">
            <label htmlFor="phone">เบอร์โทร</label>
            <input
              id="phone"
              name="phone"
              className="a-input"
              defaultValue={row?.phone ?? ''}
              placeholder="094-420-9555"
            />
            <small>ใส่ขีดได้ตามสบาย ระบบจะตัดออกให้เองตอนสร้างลิงก์โทร</small>
          </div>

          <div className="a-field">
            <label htmlFor="line">LINE ID</label>
            <input
              id="line"
              name="line"
              className="a-input"
              defaultValue={row?.line ?? ''}
              placeholder="@orangerk"
            />
          </div>

          <div className="a-field">
            <label htmlFor="line_url">ลิงก์ LINE</label>
            <input
              id="line_url"
              name="line_url"
              className="a-input"
              type="url"
              defaultValue={row?.line_url ?? ''}
              placeholder="https://lin.ee/…"
            />
          </div>

          <div className="a-field">
            <label htmlFor="fb_url">ลิงก์ Facebook</label>
            <input
              id="fb_url"
              name="fb_url"
              className="a-input"
              type="url"
              defaultValue={row?.fb_url ?? ''}
              placeholder="https://www.facebook.com/…"
            />
          </div>
        </div>
      </div>

      <div className="a-panel">
        <h2>แผนที่</h2>
        <p>
          แผนที่ฝังในหน้าสาขาใช้ “พิกัด” ไม่ใช่ชื่อสถานที่ เพราะการค้นด้วยชื่อย่านจะปักหมุดกลางเขต
          ไม่ใช่หน้าคลินิก — เปิด Google Maps คลิกขวาตรงคลินิก แล้วคัดลอกตัวเลขคู่ที่ขึ้นมาวางได้เลย
        </p>

        <div className="a-row">
          <div className="a-field">
            <label htmlFor="coords">พิกัด (ละติจูด,ลองจิจูด)</label>
            <input
              id="coords"
              name="coords"
              className="a-input"
              defaultValue={row?.coords ?? ''}
              placeholder="13.7624012,100.7291678"
            />
          </div>

          <div className="a-field">
            <label htmlFor="map_url">ลิงก์ Google Maps</label>
            <input
              id="map_url"
              name="map_url"
              className="a-input"
              type="url"
              defaultValue={row?.map_url ?? ''}
              placeholder="https://maps.app.goo.gl/…"
            />
            <small>ใช้กับปุ่ม “นำทาง”</small>
          </div>
        </div>
      </div>

      <div className="a-panel">
        <h2>แบรนด์และการแสดงผล</h2>
        <p>กลุ่มนี้มี 3 แบรนด์ในเครือ สีที่เลือกคือสีที่ใช้กับการ์ดสาขานั้นทั้งเว็บ</p>

        <div className="a-row">
          <div className="a-field">
            <label htmlFor="brand">แบรนด์</label>
            <input
              id="brand"
              name="brand"
              className="a-input"
              defaultValue={row?.brand ?? 'Orange Smile'}
              placeholder="Orange Smile"
            />
          </div>

          <div className="a-field">
            <label htmlFor="region">ภูมิภาค</label>
            <select id="region" name="region" className="a-select" defaultValue={row?.region ?? 'bkk'}>
              <option value="bkk">กรุงเทพฯ</option>
              <option value="pty">ชลบุรี–พัทยา</option>
            </select>
            <small>ใช้แยกกลุ่มสาขาบนหน้าแรกและหน้าสาขา</small>
          </div>

          <div className="a-field">
            <label htmlFor="key">รหัสสาขา</label>
            <input
              id="key"
              name="key"
              className="a-input"
              defaultValue={row?.key ?? ''}
              placeholder="romklao"
            />
            <small>เว้นว่างได้ ระบบจะสร้างจากชื่อภาษาอังกฤษ</small>
          </div>
        </div>

        <div className="a-row">
          <ColorField name="accent" label="สีประจำสาขา" defaultValue={row?.accent ?? '#FF7A00'} />
          <ColorField name="tint" label="สีพื้นอ่อน" defaultValue={row?.tint ?? '#FFF3E8'} />
        </div>

        <label className="a-check">
          <input type="checkbox" name="is_active" defaultChecked={row ? row.is_active : true} />
          <span>
            แสดงบนหน้าเว็บ
            <small>สาขาที่ปิดปรับปรุงชั่วคราว ให้ซ่อนแทนการลบ</small>
          </span>
        </label>
      </div>
    </EntityForm>
  );
}
