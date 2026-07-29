'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';

type Stage = 'checking' | 'ready' | 'expired' | 'done';

const MIN_LENGTH = 10;

export function ResetForm() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The recovery link lands here carrying a one-time code. supabase-js consumes
  // it on load, but that happens asynchronously — so ask for the session rather
  // than assuming it is already there, and treat "no session" as a dead link.
  useEffect(() => {
    const supabase = supabaseBrowser();
    let cancelled = false;

    (async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        // Harmless if supabase-js already redeemed it; the error is ignored and
        // the getSession() below is what actually decides.
        await supabase.auth.exchangeCodeForSession(code).catch(() => undefined);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!cancelled) setStage(session ? 'ready' : 'expired');
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_LENGTH) {
      setError(`รหัสผ่านต้องยาวอย่างน้อย ${MIN_LENGTH} ตัวอักษร`);
      return;
    }
    if (password !== confirm) {
      setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
      return;
    }

    setBusy(true);
    const { error } = await supabaseBrowser().auth.updateUser({ password });
    setBusy(false);

    if (error) {
      setError('ตั้งรหัสผ่านไม่สำเร็จ กรุณาขอลิงก์ใหม่อีกครั้ง');
      return;
    }

    setStage('done');
    router.refresh();
  }

  if (stage === 'checking') {
    return (
      <div className="a-login">
        <form>
          <h1>กำลังตรวจสอบลิงก์…</h1>
        </form>
      </div>
    );
  }

  if (stage === 'expired') {
    return (
      <div className="a-login">
        <form>
          <h1>ลิงก์หมดอายุแล้ว</h1>
          <p>ลิงก์ตั้งรหัสผ่านใช้ได้ครั้งเดียวและมีอายุจำกัด กรุณาขอลิงก์ใหม่จากหน้าเข้าสู่ระบบ</p>
          <a
            className="a-btn a-btn--primary"
            href="/admin/login"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            กลับไปหน้าเข้าสู่ระบบ
          </a>
        </form>
      </div>
    );
  }

  if (stage === 'done') {
    return (
      <div className="a-login">
        <form>
          <h1>ตั้งรหัสผ่านใหม่เรียบร้อย</h1>
          <p>คุณเข้าสู่ระบบอยู่แล้ว เข้าใช้งานหลังบ้านได้ทันที</p>
          <a
            className="a-btn a-btn--primary"
            href="/admin"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            เข้าหลังบ้าน
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="a-login">
      <form onSubmit={submit}>
        <h1>ตั้งรหัสผ่านใหม่</h1>
        <p>ใช้อย่างน้อย {MIN_LENGTH} ตัวอักษร และอย่าใช้ซ้ำกับรหัสผ่านที่อื่น</p>

        {error && <div className="a-note a-note--err">{error}</div>}

        <div className="a-field">
          <label htmlFor="pw">รหัสผ่านใหม่</label>
          <input
            id="pw"
            className="a-input"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="a-field">
          <label htmlFor="pw2">ยืนยันรหัสผ่านใหม่</label>
          <input
            id="pw2"
            className="a-input"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <button
          className="a-btn a-btn--primary"
          type="submit"
          disabled={busy}
          style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
        >
          {busy ? 'กำลังบันทึก…' : 'บันทึกรหัสผ่านใหม่'}
        </button>
      </form>
    </div>
  );
}
