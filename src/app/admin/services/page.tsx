import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { listRows } from '@/lib/admin/rows';
import { mediaUrl } from '@/lib/media';
import { RowActions } from '@/components/admin/RowActions';
import { deleteService, moveService, toggleService } from './actions';

export const dynamic = 'force-dynamic';

export default async function ServicesAdminPage() {
  await requireStaff();
  const rows = await listRows('services', { order: ['sort_order', 'id'] });

  return (
    <>
      <div className="a-head">
        <div>
          <h1>บริการ</h1>
          <p>
            บริการหนึ่งอย่างมีการ์ดสองใบที่เขียนคนละแบบ — ใบสั้นบนหน้าแรก และใบยาวบนหน้า /services
            ที่มีราคาและหัวข้อย่อย ทั้งสองใบแก้ได้ในหน้าเดียวกัน
          </p>
        </div>
        <div className="a-actions">
          <Link className="a-btn" href="/admin/services/extras">
            ขั้นตอนและจุดเด่น
          </Link>
          <Link className="a-btn a-btn--primary" href="/admin/services/new">
            + เพิ่มบริการ
          </Link>
        </div>
      </div>

      <div className="a-panel">
        {rows.length === 0 ? (
          <p className="a-empty">ยังไม่มีบริการ</p>
        ) : (
          <div className="a-scroll">
            <table className="a-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>รูป</th>
                  <th>บริการ</th>
                  <th>ราคาเริ่มต้น</th>
                  <th>แสดงที่</th>
                  <th>สถานะ</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((s, i) => (
                  <tr key={s.id}>
                    <td>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="a-thumb" src={mediaUrl(s.photo)} alt="" loading="lazy" />
                    </td>
                    <td>
                      <Link href={`/admin/services/${s.id}`}>{s.name_th}</Link>
                      <div className="a-num" style={{ fontSize: 12 }}>
                        {s.name_en}
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{s.price_th || '—'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {s.show_on_home && <span className="a-badge a-badge--warn">หน้าแรก</span>}{' '}
                      {s.show_on_services && <span className="a-badge">หน้าบริการ</span>}
                      {!s.show_on_home && !s.show_on_services && (
                        <span className="a-badge a-badge--off">ไม่แสดงที่ไหนเลย</span>
                      )}
                    </td>
                    <td>
                      <span className={s.is_active ? 'a-badge a-badge--ok' : 'a-badge a-badge--off'}>
                        {s.is_active ? 'แสดงอยู่' : 'ซ่อนอยู่'}
                      </span>
                    </td>
                    <td>
                      <RowActions
                        id={s.id}
                        isActive={s.is_active}
                        label={s.name_th}
                        first={i === 0}
                        last={i === rows.length - 1}
                        onMove={moveService}
                        onToggle={toggleService}
                        onDelete={deleteService}
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
