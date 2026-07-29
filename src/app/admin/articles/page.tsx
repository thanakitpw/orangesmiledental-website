import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { listAdminArticles } from '@/lib/admin/articles';
import { ARTICLE_CATEGORIES, STATUS_LABEL } from '@/lib/admin/article-meta';
import { StatusToggle } from './StatusToggle';

export const dynamic = 'force-dynamic';

const CATEGORY_LABEL = Object.fromEntries(ARTICLE_CATEGORIES.map((c) => [c.value, c.label]));

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function ArticlesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  await requireStaff();
  const { deleted } = await searchParams;
  const articles = await listAdminArticles();

  return (
    <>
      <div className="a-head">
        <div>
          <h1>บทความ</h1>
          <p>
            บทความที่เผยแพร่จะขึ้นหน้าเว็บทันทีหลังกดบันทึก และปรากฏใน sitemap ให้ Google เก็บข้อมูล
            ส่วนฉบับร่างจะไม่มีทางหลุดออกไปหน้าเว็บ
          </p>
        </div>
        <div className="a-actions">
          <Link className="a-btn a-btn--primary" href="/admin/articles/new">
            + เขียนบทความใหม่
          </Link>
        </div>
      </div>

      {deleted && <div className="a-note a-note--ok">ลบบทความเรียบร้อยแล้ว</div>}

      <div className="a-panel">
        {articles.length === 0 ? (
          <p className="a-empty">ยังไม่มีบทความ กด “เขียนบทความใหม่” เพื่อเริ่ม</p>
        ) : (
          <div className="a-scroll">
            <table className="a-table">
              <thead>
                <tr>
                  <th>หัวข้อ</th>
                  <th>หมวด</th>
                  <th>สถานะ</th>
                  <th>วันที่เผยแพร่</th>
                  <th>ตรวจทาน</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link href={`/admin/articles/${a.id}`}>{a.titleTh}</Link>
                      <div className="a-num" style={{ fontSize: 12 }}>
                        /{a.slug}
                        {a.featured && (
                          <span className="a-badge a-badge--warn" style={{ marginInlineStart: 6 }}>
                            ปักหมุด
                          </span>
                        )}
                        {!a.complete && (
                          <span className="a-badge" style={{ marginInlineStart: 6, background: '#fdecec', color: '#8c1c1c' }}>
                            ขาดคำแปล
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{CATEGORY_LABEL[a.category] ?? a.category}</td>
                    <td>
                      <span
                        className={
                          a.status === 'published'
                            ? 'a-badge a-badge--ok'
                            : a.status === 'in_review'
                              ? 'a-badge a-badge--warn'
                              : 'a-badge a-badge--off'
                        }
                      >
                        {STATUS_LABEL[a.status]}
                      </span>
                    </td>
                    <td className="a-num">{formatDate(a.publishedAt)}</td>
                    <td>
                      {a.medicallyReviewed ? (
                        <span className="a-badge a-badge--ok">ตรวจแล้ว</span>
                      ) : (
                        <span className="a-badge a-badge--off">ยังไม่ตรวจ</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'end', whiteSpace: 'nowrap' }}>
                      <StatusToggle
                        id={a.id}
                        slug={a.slug}
                        status={a.status}
                        publishedAt={a.publishedAt}
                      />
                      {a.status === 'published' && (
                        <a
                          className="a-btn a-btn--sm"
                          href={`/articles/${a.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ marginInlineStart: 6 }}
                        >
                          ดู ↗
                        </a>
                      )}
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
