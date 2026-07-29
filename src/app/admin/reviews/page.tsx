import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { listRows } from '@/lib/admin/rows';
import { RowActions } from '@/components/admin/RowActions';
import { deleteReview, moveReview, toggleReview } from './actions';

export const dynamic = 'force-dynamic';

export default async function ReviewsAdminPage() {
  await requireStaff();
  const rows = await listRows('reviews', { order: ['sort_order', 'id'] });

  return (
    <>
      <div className="a-head">
        <div>
          <h1>รีวิวลูกค้า</h1>
          <p>
            ข้อความรีวิวที่วิ่งเป็นแถบบนหน้าแรก เรียงตามลำดับด้านล่าง — รีวิวที่ซ่อนไว้จะไม่แสดงบนเว็บ
            แต่ข้อมูลยังอยู่ครบ กดแสดงกลับได้ทุกเมื่อ
          </p>
        </div>
        <div className="a-actions">
          <Link className="a-btn a-btn--primary" href="/admin/reviews/new">
            + เพิ่มรีวิว
          </Link>
        </div>
      </div>

      <div className="a-panel">
        {rows.length === 0 ? (
          <p className="a-empty">ยังไม่มีรีวิว</p>
        ) : (
          <div className="a-scroll">
            <table className="a-table">
              <thead>
                <tr>
                  <th>ผู้รีวิว</th>
                  <th>ข้อความ</th>
                  <th>บริการ / สาขา</th>
                  <th>สถานะ</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <Link href={`/admin/reviews/${r.id}`}>{r.name_th}</Link>
                      <div className="a-num" style={{ fontSize: 12 }}>
                        {r.name_en}
                      </div>
                    </td>
                    <td style={{ maxWidth: 380, fontSize: 12.5 }}>{r.text_th}</td>
                    <td style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>
                      {r.service_th || '—'}
                      <div className="a-num" style={{ fontSize: 12 }}>
                        {r.branch_th || '—'}
                      </div>
                    </td>
                    <td>
                      <span className={r.is_active ? 'a-badge a-badge--ok' : 'a-badge a-badge--off'}>
                        {r.is_active ? 'แสดงอยู่' : 'ซ่อนอยู่'}
                      </span>
                    </td>
                    <td>
                      <RowActions
                        id={r.id}
                        isActive={r.is_active}
                        label={r.name_th}
                        first={i === 0}
                        last={i === rows.length - 1}
                        onMove={moveReview}
                        onToggle={toggleReview}
                        onDelete={deleteReview}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
