'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang';
import { mediaUrl } from '@/lib/media';
import { BRANCHES } from '@/content/branches';
import { SITE } from '@/content/site';

export function SiteFooter() {
  const { t, tl } = useLang();

  const links = [
    { href: '/services', label: t('บริการ', 'Services') },
    { href: '/doctors', label: t('ทีมทันตแพทย์', 'Dentists') },
    { href: '/branches', label: t('สาขา', 'Branches') },
    { href: '/reviews', label: t('ผลลัพธ์ก่อน–หลัง', 'Results') },
    { href: '/articles', label: t('บทความ', 'Articles') },
  ];

  const social: { href: string; icon: React.ReactNode }[] = [
    {
      href: SITE.lineUrl,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
        </svg>
      ),
    },
    {
      href: SITE.fbUrl,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    // The source's third icon pointed at instagram.com with no account behind it.
    // Add an entry here if the clinic gives us a real profile.
  ];

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 1,
        background: '#1A1410',
        color: 'rgba(255,255,255,.7)',
        padding: '56px 20px 30px',
        fontFamily: "'Inter','IBM Plex Sans Thai',sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: 40,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl('assets/media/image4.webp')}
              alt="Orange Smile"
              style={{ width: 42, height: 42, objectFit: 'contain' }}
            />
            <span
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 800,
                fontSize: 20,
                color: '#fff',
              }}
            >
              Orange Smile
            </span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: '16px 0 0', maxWidth: 280 }}>
            {t(
              'กลุ่มคลินิกทันตกรรมครบวงจร ดูแลรอยยิ้มของคุณด้วยใจ',
              'A full-service dental group, caring for your smile with heart.',
            )}
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            {social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: 'rgba(255,255,255,.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 16 }}>
            {t('ลิงก์ด่วน', 'Quick links')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 14 }}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 16 }}>
            {t('สาขาของเรา', 'Our branches')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 13.5 }}>
            {BRANCHES.map((b) => (
              <div key={b.key} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: b.accent,
                    flex: 'none',
                  }}
                />
                <span style={{ flex: 1 }}>{tl(b.name)}</span>
                <span style={{ color: 'rgba(255,255,255,.45)', fontSize: 12 }}>{b.line}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 16 }}>
            {t('ติดต่อสำนักงานใหญ่', 'Head office')}
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>{tl(SITE.address)}</p>
          <a
            href={SITE.telUrl}
            style={{
              display: 'block',
              marginTop: 12,
              color: '#FFB04D',
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
            }}
          >
            {SITE.phone}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            style={{
              display: 'block',
              marginTop: 6,
              color: 'inherit',
              fontSize: 13.5,
              textDecoration: 'none',
            }}
          >
            {SITE.email}
          </a>
          <div
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,.55)',
              marginTop: 14,
              lineHeight: 1.6,
            }}
          >
            {tl(SITE.hours)}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1240,
          margin: '36px auto 0',
          paddingTop: 22,
          borderTop: '1px solid rgba(255,255,255,.1)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12.5,
          color: 'rgba(255,255,255,.45)',
        }}
      >
        <span>
          © 2026{' '}
          {t(
            'บริษัท ออเร้นจ์ สไมล์ เด็นทัล ไทย กรุ๊ป จำกัด',
            'Orange Smile Dental Thai Group Co., Ltd.',
          )}
        </span>
        <span>
          {t(
            'ผลลัพธ์การรักษาขึ้นกับสภาพช่องปากของแต่ละบุคคล',
            'Treatment results vary by individual.',
          )}
        </span>
      </div>
    </footer>
  );
}
