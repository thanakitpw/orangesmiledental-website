import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/auth';
import { getRow } from '@/lib/admin/rows';
import { EntityForm } from '@/components/admin/EntityForm';
import { PairField } from '@/components/admin/PairField';
import { saveReview, deleteReview } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const { saved } = await searchParams;

  const row = await getRow('reviews', id);
  if (id !== 'new' && !row) notFound();

  return (
    <EntityForm
      id={row?.id ?? null}
      title={row ? 'แก้ไขรีวิว' : 'เพิ่มรีวิวใหม่'}
      subtitle="รีวิวจะวิ่งเป็นแถบบนหน้าแรก ข้อความควรสั้นกระชับประมาณ 1–2 บรรทัด"
      backHref="/admin/reviews"
      saveAction={saveReview}
      deleteAction={deleteReview}
      deleteLabel={row?.name_th}
      justCreated={Boolean(saved)}
      createLabel="เพิ่มรีวิว"
    >
      <div className="a-panel">
        <PairField name="name" label="ชื่อผู้รีวิว" th={row?.name_th} en={row?.name_en} required />

        <div className="a-field" style={{ maxWidth: 200 }}>
          <label htmlFor="initial">ตัวอักษรในวงกลม</label>
          <input
            id="initial"
            name="initial"
            className="a-input"
            maxLength={2}
            defaultValue={row?.initial ?? ''}
            placeholder="พ"
          />
          <small>เว้นว่างได้ ระบบจะใช้อักษรตัวแรกของชื่อภาษาไทย (ตัด “คุณ” ออกให้)</small>
        </div>

        <PairField
          name="text"
          label="ข้อความรีวิว"
          th={row?.text_th}
          en={row?.text_en}
          textarea
          rows={3}
          required
        />
        <PairField
          name="service"
          label="บริการที่ใช้"
          hint="เช่น จัดฟัน / Braces"
          th={row?.service_th}
          en={row?.service_en}
        />
        <PairField
          name="branch"
          label="สาขา"
          hint="เช่น สาขาบางกะปิ / Bang Kapi"
          th={row?.branch_th}
          en={row?.branch_en}
        />

        <label className="a-check">
          <input type="checkbox" name="is_active" defaultChecked={row ? row.is_active : true} />
          <span>
            แสดงบนหน้าเว็บ
            <small>เอาเครื่องหมายออกเพื่อซ่อนชั่วคราวโดยไม่ต้องลบ</small>
          </span>
        </label>
      </div>
    </EntityForm>
  );
}
