import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { getRow } from '@/lib/admin/rows';
import { EntityForm } from '@/components/admin/EntityForm';
import { PairField } from '@/components/admin/PairField';
import { MediaField } from '@/components/admin/MediaField';
import { ColorField } from '@/components/admin/ColorField';
import { saveCase, deleteCase } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditCasePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const { saved } = await searchParams;

  const row = await getRow('cases', id);
  if (id !== 'new' && !row) notFound();

  return (
    <EntityForm
      id={row?.id ?? null}
      title={row ? 'แก้ไขเคส' : 'เพิ่มเคสใหม่'}
      subtitle="รูปก่อนและหลังควรถ่ายมุมเดียวกันและครอปให้ขนาดเท่ากัน ไม่งั้นตอนเลื่อนเปรียบเทียบจะดูเหลื่อม"
      backHref="/admin/cases"
      saveAction={saveCase}
      deleteAction={deleteCase}
      deleteLabel={row?.title_th}
      justCreated={Boolean(saved)}
      createLabel="เพิ่มเคส"
    >
      <div className="a-panel">
        <h2>รูปเปรียบเทียบ</h2>
        <p>อัตราส่วน 4:3 ตรงกับที่ดีไซน์วางไว้</p>

        <div className="a-pair">
          <MediaField
            name="before_key"
            label="รูปก่อนรักษา"
            category="reviews"
            required
            defaultValue={row?.before_key ?? ''}
          />
          <MediaField
            name="after_key"
            label="รูปหลังรักษา"
            category="reviews"
            required
            defaultValue={row?.after_key ?? ''}
          />
        </div>
      </div>

      <div className="a-panel">
        <h2>ประเภทและสี</h2>
        <p>
          ชื่อประเภทคือข้อความบนปุ่มกรองในหน้ารีวิว ถ้าพิมพ์ชื่อประเภทใหม่ที่ยังไม่เคยมี
          ระบบจะสร้างปุ่มกรองให้เองอัตโนมัติ
        </p>

        <PairField
          name="cat_label"
          label="ชื่อประเภทการรักษา"
          th={row?.cat_label_th}
          en={row?.cat_label_en}
          placeholderTh="จัดฟัน"
          placeholderEn="Braces"
          required
        />

        <div className="a-row">
          <div className="a-field">
            <label htmlFor="category">รหัสประเภท</label>
            <input
              id="category"
              name="category"
              className="a-input"
              defaultValue={row?.category ?? ''}
              placeholder="ortho"
            />
            <small>เว้นว่างได้ ระบบจะสร้างจากชื่อประเภทภาษาอังกฤษ เคสที่รหัสตรงกันจะรวมอยู่ในปุ่มกรองเดียวกัน</small>
          </div>

          <div className="a-field">
            <label htmlFor="code">รหัสเคส</label>
            <input
              id="code"
              name="code"
              className="a-input"
              defaultValue={row?.code ?? ''}
              placeholder="OS-1042"
            />
            <small>ไม่บังคับ แสดงเป็นตัวเลขอ้างอิงเล็ก ๆ บนการ์ด</small>
          </div>
        </div>

        <div className="a-row">
          <ColorField name="accent" label="สีหลัก" defaultValue={row?.accent ?? '#FF7A00'} />
          <ColorField
            name="tint"
            label="สีพื้นอ่อน"
            defaultValue={row?.tint ?? '#FFF3E8'}
            hint="ใช้เป็นพื้นหลังของป้ายประเภท ควรเป็นเฉดอ่อนของสีหลัก"
          />
        </div>
      </div>

      <div className="a-panel">
        <h2>ข้อความ</h2>

        <PairField name="title" label="หัวข้อ (สั้น)" hint="ใช้บนหน้าแรก" th={row?.title_th} en={row?.title_en} required />
        <PairField
          name="title_long"
          label="หัวข้อ (ยาว)"
          hint="ใช้บนหน้ารีวิวที่มีพื้นที่มากกว่า — เว้นว่างได้ ระบบจะใช้หัวข้อสั้นแทน"
          th={row?.title_long_th}
          en={row?.title_long_en}
        />
        <PairField
          name="quote"
          label="คำบอกเล่าจากคนไข้"
          th={row?.quote_th}
          en={row?.quote_en}
          textarea
          rows={3}
        />

        <div className="a-pair">
          <PairField name="doctor" label="ทันตแพทย์ผู้รักษา" th={row?.doctor_th} en={row?.doctor_en} />
          <PairField name="branch" label="สาขาที่ทำ" th={row?.branch_th} en={row?.branch_en} />
        </div>

        <label className="a-check">
          <input type="checkbox" name="is_active" defaultChecked={row ? row.is_active : true} />
          <span>แสดงบนหน้าเว็บ</span>
        </label>
      </div>
    </EntityForm>
  );
}
