import { redirect } from 'next/navigation';
import { getStaff } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase/server';
import { signOut } from '../actions';
import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  const staff = await getStaff();
  if (staff) redirect(next && next.startsWith('/admin') ? next : '/admin');

  // Signed in, but no profile — the address was never added to staff_allowlist.
  // Saying so plainly beats a login form that silently refuses to work, and the
  // sign-out button is the only useful thing they can do from here.
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <div className="a-login">
        <form action={signOut}>
          <h1>บัญชีนี้ยังไม่ได้รับสิทธิ์</h1>
          <p>
            เข้าสู่ระบบด้วย <strong>{user.email}</strong> สำเร็จ แต่อีเมลนี้ยังไม่อยู่ในรายชื่อทีมงาน
            กรุณาแจ้งผู้ดูแลระบบให้เพิ่มอีเมลนี้ลงในตาราง <code>staff_allowlist</code> ก่อน
          </p>
          <button className="a-btn a-btn--primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
            ออกจากระบบ
          </button>
        </form>
      </div>
    );
  }

  return <LoginForm next={next} />;
}
