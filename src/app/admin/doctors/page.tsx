import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { listRows } from '@/lib/admin/rows';
import { mediaUrl } from '@/lib/media';
import { RowActions } from '@/components/admin/RowActions';
import { deleteDoctor, moveDoctor, toggleDoctor } from './actions';

export const dynamic = 'force-dynamic';

export default async function DoctorsAdminPage() {
  await requireStaff();
  const rows = await listRows('doctors', { order: ['sort_order', 'id'] });
  const heroCount = rows.filter((d) => d.hero_face && d.is_active).length;

  return (
    <>
      <div className="a-head">
        <div>
          <h1>ทีมทันตแพทย์</h1>
          <p>รายชื่อบนหน้า /doctors เรียงตามลำดับด้านล่าง และหมอที่ติ๊ก “โชว์บนหน้าแรก” จะขึ้นเป็นรูปวงกลมซ้อนกันในหัวหน้าแรก</p>
        </div>
        <div className="a-actions">
          <Link className="a-btn a-btn--primary" href="/admin/doctors/new">
            + เพิ่มทันตแพทย์
          </Link>
        </div>
      </div>

      {heroCount !== 4 && (
        <div className="a-note a-note--info">
          ตอนนี้มีหมอ {heroCount} ท่านที่ติ๊ก “โชว์บนหน้าแรก” — ดีไซน์ออกแบบไว้สำหรับ 4 ท่านพอดี
          {heroCount === 0 && ' ถ้าไม่ติ๊กเลย ระบบจะใช้ 4 ท่านแรกในรายการให้อัตโนมัติ'}
        </div>
      )}

      <div className="a-panel">
        {rows.length === 0 ? (
          <p className="a-empty">ยังไม่มีรายชื่อทันตแพทย์</p>
        ) : (
          <div className="a-scroll">
            <table className="a-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>รูป</th>
                  <th>ชื่อ</th>
                  <th>ตำแหน่ง</th>
                  <th>ความเชี่ยวชาญ</th>
                  <th>สถานะ</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((d, i) => (
                  <tr key={d.id}>
                    <td>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="a-thumb" src={mediaUrl(d.photo)} alt="" loading="lazy" />
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <Link href={`/admin/doctors/${d.id}`}>{d.name}</Link>
                      {d.hero_face && (
                        <span className="a-badge a-badge--warn" style={{ marginInlineStart: 6 }}>
                          หน้าแรก
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: 12.5 }}>{d.role_th}</td>
                    <td style={{ fontSize: 12.5 }}>
                      {(d.tags ?? []).map((t: { th: string }) => t.th).join(', ') || '—'}
                    </td>
                    <td>
                      <span className={d.is_active ? 'a-badge a-badge--ok' : 'a-badge a-badge--off'}>
                        {d.is_active ? 'แสดงอยู่' : 'ซ่อนอยู่'}
                      </span>
                    </td>
                    <td>
                      <RowActions
                        id={d.id}
                        isActive={d.is_active}
                        label={d.name}
                        first={i === 0}
                        last={i === rows.length - 1}
                        onMove={moveDoctor}
                        onToggle={toggleDoctor}
                        onDelete={deleteDoctor}
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
