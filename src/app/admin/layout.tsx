import type { Metadata } from 'next';
import { getStaff } from '@/lib/auth';
import { AdminNav } from './AdminNav';
import { navCounts } from './counts';
import { signOut } from './actions';
import './admin.css';

// Every admin page reads cookies to resolve the session, so none of this can be
// prerendered. Saying so up front keeps `next build` from trying.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'หลังบ้าน · Orange Smile Dental',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await getStaff();

  // The login screen lives under /admin too, and it has no session to draw the
  // chrome from. Render it bare rather than inventing a signed-out sidebar.
  if (!staff) return <>{children}</>;

  const counts = await navCounts();

  return (
    <div className="a-shell">
      <aside className="a-side">
        <div className="a-brand">
          <span>OS</span>
          Orange Smile
        </div>

        <AdminNav counts={counts} />

        <div className="a-side-foot">
          <strong>{staff.fullName || staff.email}</strong>
          <a className="a-btn a-btn--sm" href="/" target="_blank" rel="noreferrer">
            ดูเว็บไซต์ ↗
          </a>
          <form action={signOut}>
            <button className="a-btn a-btn--sm" type="submit">
              ออกจากระบบ
            </button>
          </form>
        </div>
      </aside>

      <main className="a-main">{children}</main>
    </div>
  );
}
