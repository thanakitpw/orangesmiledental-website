import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { getRow } from '@/lib/admin/rows';
import { EntityForm } from '@/components/admin/EntityForm';
import { PairField } from '@/components/admin/PairField';
import { MediaField } from '@/components/admin/MediaField';
import { ColorField } from '@/components/admin/ColorField';
import { IconField } from '@/components/admin/IconField';
import { JsonListEditor } from '@/components/admin/JsonListEditor';
import { saveService, deleteService } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const { saved } = await searchParams;

  // /admin/services/extras never lands here: the App Router matches its static
  // segment ahead of this dynamic one.
  const row = await getRow('services', id);
  if (id !== 'new' && !row) notFound();

  return (
    <EntityForm
      id={row?.id ?? null}
      title={row ? `แก้ไข${row.name_th}` : 'เพิ่มบริการใหม่'}
      subtitle="ชื่อ รูป และสถานะใช้ร่วมกันทั้งสองการ์ด ส่วนไอคอน สี และคำอธิบายแยกกัน"
      backHref="/admin/services"
      saveAction={saveService}
      deleteAction={deleteService}
      deleteLabel={row?.name_th}
      justCreated={Boolean(saved)}
      createLabel="เพิ่มบริการ"
    >
      <div className="a-panel">
        <h2>ข้อมูลร่วม</h2>

        <PairField name="name" label="ชื่อบริการ" th={row?.name_th} en={row?.name_en} required />

        <MediaField
          name="photo"
          label="รูปประกอบ"
          category="services"
          defaultValue={row?.photo ?? ''}
          hint="ใช้ทั้งการ์ดหน้าแรกและการ์ดหน้าบริการ"
        />

        <div className="a-field" style={{ maxWidth: 260 }}>
          <label htmlFor="key">รหัสบริการ</label>
          <input
            id="key"
            name="key"
            className="a-input"
            defaultValue={row?.key ?? ''}
            placeholder="ortho"
          />
          <small>เว้นว่างได้ ระบบจะสร้างจากชื่อภาษาอังกฤษ</small>
        </div>

        <label className="a-check">
          <input type="checkbox" name="is_active" defaultChecked={row ? row.is_active : true} />
          <span>
            เปิดใช้งานบริการนี้
            <small>ปิดแล้วจะหายไปจากทั้งสองหน้าพร้อมกัน</small>
          </span>
        </label>
      </div>

      <div className="a-panel">
        <h2>การ์ดบนหน้าแรก</h2>
        <p>ใบสั้น — ชื่อ ไอคอน และคำอธิบายบรรทัดเดียว</p>

        <label className="a-check">
          <input type="checkbox" name="show_on_home" defaultChecked={row ? row.show_on_home : true} />
          <span>แสดงบนหน้าแรก</span>
        </label>

        <PairField
          name="home_desc"
          label="คำอธิบายสั้น"
          th={row?.home_desc_th}
          en={row?.home_desc_en}
          placeholderTh="ตรวจ ขูดหินปูน อุดฟัน ดูแลช่องปาก"
          placeholderEn="Check-ups, scaling & fillings"
        />

        <div className="a-row">
          <IconField
            name="home_icon"
            label="ไอคอน (หน้าแรก)"
            defaultValue={row?.home_icon ?? 'heart'}
            accent={row?.home_accent ?? '#FF7A00'}
          />
          <ColorField name="home_accent" label="สีไอคอน (หน้าแรก)" defaultValue={row?.home_accent ?? '#FF7A00'} />
          <ColorField name="home_tint" label="สีพื้นไอคอน (หน้าแรก)" defaultValue={row?.home_tint ?? '#FFF3E8'} />
        </div>
      </div>

      <div className="a-panel">
        <h2>การ์ดบนหน้าบริการ</h2>
        <p>ใบยาว — มีราคาเริ่มต้น คำอธิบายเต็ม และหัวข้อย่อยเป็นข้อ ๆ</p>

        <label className="a-check">
          <input
            type="checkbox"
            name="show_on_services"
            defaultChecked={row ? row.show_on_services : true}
          />
          <span>แสดงบนหน้า /services</span>
        </label>

        <PairField
          name="price"
          label="ราคาเริ่มต้น"
          hint="เป็นข้อความอิสระ เขียนว่า “ผ่อน 0%” ก็ได้"
          th={row?.price_th}
          en={row?.price_en}
          placeholderTh="เริ่ม 300฿"
          placeholderEn="from ฿300"
        />
        <PairField name="desc" label="คำอธิบายเต็ม" th={row?.desc_th} en={row?.desc_en} textarea rows={3} />

        <JsonListEditor
          name="items"
          label="หัวข้อย่อย"
          hint="แสดงเป็นรายการมีเครื่องหมายถูกใต้คำอธิบาย"
          initial={(row?.items ?? []) as Record<string, string>[]}
          fields={[
            { key: 'th', label: 'ไทย', placeholder: 'ขูดหินปูน + ขัดฟัน' },
            { key: 'en', label: 'อังกฤษ', placeholder: 'Scaling & polishing' },
          ]}
          addLabel="เพิ่มหัวข้อย่อย"
        />

        <div className="a-row">
          <IconField
            name="icon"
            label="ไอคอน (หน้าบริการ)"
            defaultValue={row?.icon ?? 'heart'}
            accent={row?.accent ?? '#FF7A00'}
          />
          <ColorField name="accent" label="สีไอคอน (หน้าบริการ)" defaultValue={row?.accent ?? '#FF7A00'} />
        </div>
      </div>
    </EntityForm>
  );
}
