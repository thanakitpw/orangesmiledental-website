import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { listRows } from '@/lib/admin/rows';
import { mediaUrl } from '@/lib/media';
import { RowActions } from '@/components/admin/RowActions';
import { deleteCase, moveCase, toggleCase } from './actions';

export const dynamic = 'force-dynamic';

export default async function CasesAdminPage() {
  await requireStaff();
  const rows = await listRows('cases', { order: ['sort_order', 'id'] });

  return (
    <>
      <div className="a-head">
        <div>
          <h1>เคส Before / After</h1>
          <p>
            การ์ดเลื่อนเปรียบเทียบก่อน–หลัง แสดงทั้งบนหน้าแรกและหน้า /reviews
            ปุ่มกรองด้านบนของหน้ารีวิวสร้างจากประเภทการรักษาของเคสที่มีอยู่จริง เพิ่มประเภทใหม่ได้เลย
          </p>
        </div>
        <div className="a-actions">
          <Link className="a-btn a-btn--primary" href="/admin/cases/new">
            + เพิ่มเคส
          </Link>
        </div>
      </div>

      <div className="a-panel">
        {rows.length === 0 ? (
          <p className="a-empty">ยังไม่มีเคส</p>
        ) : (
          <div className="a-scroll">
            <table className="a-table">
              <thead>
                <tr>
                  <th style={{ width: 104 }}>ก่อน / หลัง</th>
                  <th>หัวข้อ</th>
                  <th>ประเภท</th>
                  <th>หมอ / สาขา</th>
                  <th>สถานะ</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((c, i) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="a-thumb" src={mediaUrl(c.before_key)} alt="" loading="lazy" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="a-thumb" src={mediaUrl(c.after_key)} alt="" loading="lazy" />
                      </div>
                    </td>
                    <td style={{ maxWidth: 280 }}>
                      <Link href={`/admin/cases/${c.id}`}>{c.title_th}</Link>
                      {c.code && (
                        <div className="a-num" style={{ fontSize: 12 }}>
                          {c.code}
                        </div>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span className="a-badge" style={{ background: c.tint, color: c.accent }}>
                        {c.cat_label_th}
                      </span>
                    </td>
                    <td style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>
                      {c.doctor_th || '—'}
                      <div className="a-num" style={{ fontSize: 12 }}>
                        {c.branch_th || '—'}
                      </div>
                    </td>
                    <td>
                      <span className={c.is_active ? 'a-badge a-badge--ok' : 'a-badge a-badge--off'}>
                        {c.is_active ? 'แสดงอยู่' : 'ซ่อนอยู่'}
                      </span>
                    </td>
                    <td>
                      <RowActions
                        id={c.id}
                        isActive={c.is_active}
                        label={c.title_th}
                        first={i === 0}
                        last={i === rows.length - 1}
                        onMove={moveCase}
                        onToggle={toggleCase}
                        onDelete={deleteCase}
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
