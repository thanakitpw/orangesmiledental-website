'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      // Supabase returns the same message whether the address is unknown or the
      // password is wrong, which is the correct behaviour — telling them apart
      // would confirm to a stranger which staff addresses exist.
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      return;
    }

    // refresh() so the server re-reads the session cookie the client just set;
    // without it the layout would still render as signed-out.
    router.replace(next && next.startsWith('/admin') ? next : '/admin');
    router.refresh();
  }

  async function reset() {
    if (!email) {
      setError('กรอกอีเมลก่อน แล้วกดลืมรหัสผ่านอีกครั้ง');
      return;
    }
    setBusy(true);
    setError(null);

    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset`,
    });
    setBusy(false);

    if (error) setError('ส่งอีเมลไม่สำเร็จ กรุณาติดต่อผู้ดูแลระบบ');
    else setSent(true);
  }

  return (
    <div className="a-login">
      <form onSubmit={submit}>
        <h1>หลังบ้าน Orange Smile</h1>
        <p>เข้าสู่ระบบด้วยอีเมลทีมงาน</p>

        {error && <div className="a-note a-note--err">{error}</div>}
        {sent && (
          <div className="a-note a-note--ok">
            ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่ {email} แล้ว กรุณาตรวจกล่องอีเมล
          </div>
        )}

        <div className="a-field">
          <label htmlFor="email">อีเมล</label>
          <input
            id="email"
            className="a-input"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="a-field">
          <label htmlFor="password">รหัสผ่าน</label>
          <input
            id="password"
            className="a-input"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="a-btn a-btn--primary"
          type="submit"
          disabled={busy}
          style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
        >
          {busy ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
        </button>

        <button
          className="a-btn a-btn--sm"
          type="button"
          onClick={reset}
          disabled={busy}
          style={{ width: '100%', justifyContent: 'center', marginTop: 8, border: 0, background: 'none' }}
        >
          ลืมรหัสผ่าน?
        </button>
      </form>
    </div>
  );
}
