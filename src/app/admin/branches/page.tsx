import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { listRows } from '@/lib/admin/rows';
import { mediaUrl } from '@/lib/media';
import { RowActions } from '@/components/admin/RowActions';
import { deleteBranch, moveBranch, toggleBranch } from './actions';

export const dynamic = 'force-dynamic';

const REGION_LABEL: Record<string, string> = { bkk: 'กรุงเทพฯ', pty: 'ชลบุรี–พัทยา' };

export default async function BranchesAdminPage() {
  await requireStaff();
  const rows = await listRows('branches', { order: ['sort_order', 'id'] });

  return (
    <>
      <div className="a-head">
        <div>
          <h1>สาขา</h1>
          <p>
            ข้อมูลสาขาถูกใช้ในหลายที่พร้อมกัน — การ์ดสาขาบนหน้าแรก หน้า /branches และรายชื่อในส่วนท้ายทุกหน้า
            แก้ที่นี่ที่เดียวเปลี่ยนครบทุกจุด
          </p>
        </div>
        <div className="a-actions">
          <Link className="a-btn a-btn--primary" href="/admin/branches/new">
            + เพิ่มสาขา
          </Link>
        </div>
      </div>

      <div className="a-panel">
        {rows.length === 0 ? (
          <p className="a-empty">ยังไม่มีสาขา</p>
        ) : (
          <div className="a-scroll">
            <table className="a-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>รูป</th>
                  <th>สาขา</th>
                  <th>ภูมิภาค</th>
                  <th>ติดต่อ</th>
                  <th>สถานะ</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((b, i) => (
                  <tr key={b.id}>
                    <td>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="a-thumb" src={mediaUrl(b.photo)} alt="" loading="lazy" />
                    </td>
                    <td>
                      <Link href={`/admin/branches/${b.id}`}>{b.name_th}</Link>
                      <div className="a-num" style={{ fontSize: 12 }}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: b.accent,
                            marginInlineEnd: 5,
                          }}
                        />
                        {b.brand} · /{b.key}
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{REGION_LABEL[b.region] ?? b.region}</td>
                    <td style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>
                      {b.phone || '—'}
                      <div className="a-num" style={{ fontSize: 12 }}>
                        {b.line || '—'}
                      </div>
                    </td>
                    <td>
                      <span className={b.is_active ? 'a-badge a-badge--ok' : 'a-badge a-badge--off'}>
                        {b.is_active ? 'เปิดอยู่' : 'ซ่อนอยู่'}
                      </span>
                    </td>
                    <td>
                      <RowActions
                        id={b.id}
                        isActive={b.is_active}
                        label={b.name_th}
                        first={i === 0}
                        last={i === rows.length - 1}
                        onMove={moveBranch}
                        onToggle={toggleBranch}
                        onDelete={deleteBranch}
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
