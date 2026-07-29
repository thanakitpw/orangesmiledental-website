import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { getRow } from '@/lib/admin/rows';
import { EntityForm } from '@/components/admin/EntityForm';
import { PairField } from '@/components/admin/PairField';
import { MediaField } from '@/components/admin/MediaField';
import { JsonListEditor } from '@/components/admin/JsonListEditor';
import { saveDoctor, deleteDoctor } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditDoctorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const { saved } = await searchParams;

  const row = await getRow('doctors', id);
  if (id !== 'new' && !row) notFound();

  return (
    <EntityForm
      id={row?.id ?? null}
      title={row ? 'แก้ไขข้อมูลทันตแพทย์' : 'เพิ่มทันตแพทย์'}
      subtitle="ชื่อควรใส่คำนำหน้าให้ครบ เช่น ทพญ. หรือ ทพ. เพราะหน้าเว็บแสดงตามที่พิมพ์ตรงนี้"
      backHref="/admin/doctors"
      saveAction={saveDoctor}
      deleteAction={deleteDoctor}
      deleteLabel={row?.name}
      justCreated={Boolean(saved)}
      createLabel="เพิ่มทันตแพทย์"
    >
      <div className="a-panel">
        <div className="a-field">
          <label htmlFor="name">ชื่อ-นามสกุล</label>
          <input
            id="name"
            name="name"
            className="a-input"
            required
            defaultValue={row?.name ?? ''}
            placeholder="ทพญ. เอมอร ฤทธี"
          />
          <small>ใช้ชื่อเดียวกันทั้งหน้าไทยและอังกฤษ ตามที่ดีไซน์ต้นฉบับทำไว้</small>
        </div>

        <MediaField
          name="photo"
          label="รูปทันตแพทย์"
          category="team"
          required
          defaultValue={row?.photo ?? ''}
          hint="รูปสี่เหลี่ยมจัตุรัสจะดูดีที่สุด ระบบครอปเป็นวงกลม/สี่เหลี่ยมมนให้เอง"
        />

        <PairField
          name="role"
          label="ตำแหน่ง"
          th={row?.role_th ?? 'ทันตแพทย์'}
          en={row?.role_en ?? 'Dentist'}
        />

        <PairField name="bio" label="ประวัติสั้น" th={row?.bio_th} en={row?.bio_en} textarea rows={3} />

        <JsonListEditor
          name="tags"
          label="ความเชี่ยวชาญ"
          hint="แสดงเป็นป้ายเล็ก ๆ ใต้ชื่อ ใส่ได้หลายอัน"
          initial={(row?.tags ?? []) as Record<string, string>[]}
          fields={[
            { key: 'th', label: 'ไทย', placeholder: 'ทันตกรรมทั่วไป' },
            { key: 'en', label: 'อังกฤษ', placeholder: 'General dentistry' },
          ]}
          addLabel="เพิ่มความเชี่ยวชาญ"
        />

        <label className="a-check">
          <input type="checkbox" name="hero_face" defaultChecked={row?.hero_face ?? false} />
          <span>
            โชว์รูปบนหน้าแรก
            <small>ดีไซน์ออกแบบให้มี 4 ท่านซ้อนกันในหัวหน้าแรก ถ้าไม่ติ๊กใครเลย ระบบจะใช้ 4 ท่านแรกในรายการ</small>
          </span>
        </label>

        <label className="a-check">
          <input type="checkbox" name="is_active" defaultChecked={row ? row.is_active : true} />
          <span>
            แสดงบนหน้าเว็บ
            <small>หมอที่ลาออกหรือย้ายสาขาชั่วคราว ให้ซ่อนแทนการลบ ข้อมูลจะได้ไม่หาย</small>
          </span>
        </label>
      </div>
    </EntityForm>
  );
}
