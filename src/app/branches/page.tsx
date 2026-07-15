'use client';

import { PageStyles } from '@/components/PageStyles';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { useLang } from '@/lib/lang';
import { useReveal } from '@/lib/reveal';
import { mediaUrl } from '@/lib/media';
import { BRANCHES_BKK, BRANCHES_PTY, mapEmbed, type Branch } from '@/content/branches';
import { SITE } from '@/content/site';

const CSS = `
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{margin:0;background:#fff;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
  ::selection{background:#FFD9B8;color:#1A1410}
  [data-reveal]{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
  [data-reveal][data-in]{opacity:1;transform:none}
  .br-row:hover{box-shadow:0 26px 56px -26px rgba(255,122,0,.32)!important}
  .pcta{transition:transform .2s}
  .pcta:hover{transform:translateY(-2px)}
  .pcta:active{transform:scale(.98)}
  @media (prefers-reduced-motion:reduce){[data-reveal]{opacity:1;transform:none}}
`;

/** The "Open map" arrow-pin glyph — used by the overview button and every branch row. */
const MAP_ARROW = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4285F4"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

/** Address pin — Bangkok hardcodes the orange stroke, Pattaya takes the branch accent. */
const pinIcon = (stroke: string) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flex: 'none', marginTop: 2 }}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CLOCK = (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8FB09A"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flex: 'none', marginTop: 2 }}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const LINE_ICON = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
  </svg>
);

const PHONE_ICON = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const FACEBOOK = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
  </svg>
);

/** The four action buttons on every branch row share this base. */
const ctaBtnBase: React.CSSProperties = {
  height: 42,
  padding: '0 16px',
  borderRadius: 12,
  fontSize: 13.5,
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  textDecoration: 'none',
};

const sectionWrap: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  maxWidth: 1240,
  margin: '0 auto',
};

const infoRow: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  fontSize: 14,
  color: 'rgba(61,53,46,.72)',
};

export default function BranchesPage() {
  const { t, tl, track } = useLang();
  useReveal(0.94, 1600);

  const openMap = t('เปิดแผนที่', 'Open map');
  const regBkk = t('กรุงเทพมหานคร', 'Bangkok');
  const regPty = t('ชลบุรี – พัทยา', 'Chonburi – Pattaya');
  const bkkCount = t('4 สาขา', '4 branches');
  const ptyCount = t('3 สาขา', '3 branches');

  /**
   * The Bangkok and Pattaya rows are the same markup; only the map-pin stroke and
   * the phone button's colours differ (Bangkok hardcodes orange, Pattaya tints per brand).
   */
  const branchRow = (b: Branch, tinted: boolean) => (
    <div
      key={b.key}
      className="br-row"
      data-reveal=""
      style={{
        background: '#fff',
        border: '1px solid rgba(0,0,0,.05)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 18px 44px -26px rgba(0,0,0,.2)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))',
        transition: 'box-shadow .3s',
      }}
    >
      <div style={{ padding: 0 }}>
        <div
          style={{
            position: 'relative',
            aspectRatio: '1122/1402',
            overflow: 'hidden',
            background: '#F3EFEA',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(b.photo)}
            alt={tl(b.name)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: b.accent,
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              background: 'rgba(255,255,255,.92)',
              backdropFilter: 'blur(8px)',
              color: b.accent,
              fontSize: 11.5,
              fontWeight: 700,
              padding: '5px 12px',
              borderRadius: 999,
            }}
          >
            {b.brand}
          </span>
        </div>
        <div style={{ padding: '22px 24px 24px' }}>
          <h3
            style={{
              fontFamily: "'Outfit','Anuphan',sans-serif",
              fontSize: 21,
              fontWeight: 700,
              color: '#1A1410',
              margin: 0,
            }}
          >
            {tl(b.name)}
          </h3>
          <div style={{ ...infoRow, marginTop: 14 }}>
            {pinIcon(tinted ? b.accent : '#FF7A00')}
            <span>{tl(b.address)}</span>
          </div>
          <div style={{ ...infoRow, marginTop: 12 }}>
            {CLOCK}
            <span>{tl(b.hours)}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 18 }}>
            <a
              className="pcta"
              href={b.lineUrl}
              target="_blank"
              rel="noopener"
              style={{ ...ctaBtnBase, background: '#06C755', color: '#fff' }}
            >
              {LINE_ICON}
              {b.line}
            </a>
            <a
              className="pcta"
              href={b.telUrl}
              style={{
                ...ctaBtnBase,
                background: tinted ? b.tint : '#FFF3E8',
                color: tinted ? b.accent : '#F26C00',
              }}
            >
              {PHONE_ICON}
              {b.phone}
            </a>
            <a
              className="pcta"
              href={b.mapUrl}
              target="_blank"
              rel="noopener"
              style={{
                ...ctaBtnBase,
                background: '#fff',
                border: '1px solid rgba(0,0,0,.1)',
                color: '#1A1410',
              }}
            >
              {MAP_ARROW}
              {openMap}
            </a>
            <a
              className="pcta"
              href={b.fbUrl}
              target="_blank"
              rel="noopener"
              style={{ ...ctaBtnBase, background: '#1877F2', color: '#fff' }}
            >
              {FACEBOOK}
              Facebook
            </a>
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          minHeight: 300,
          borderLeft: '1px solid rgba(0,0,0,.05)',
        }}
      >
        <iframe
          src={mapEmbed(b)}
          title={tl(b.name)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 0,
            filter: 'saturate(1.05)',
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      <PageStyles css={CSS} />
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          background: '#fff',
          color: '#3D352E',
          fontFamily: "'Inter','IBM Plex Sans Thai',sans-serif",
          overflowX: 'hidden',
          fontSize: 16,
          lineHeight: 1.6,
        }}
      >
        <SiteNav active="branches" />

        {/* ===== HEADER ===== */}
        <div style={{ ...sectionWrap, padding: '140px 20px 0' }}>
          <div data-reveal="" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#FF7A00',
              }}
            >
              {t('สาขาของเรา', 'Our locations')}
            </div>
            <h1
              style={{
                fontFamily: "'Outfit','Anuphan',sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(34px,4.6vw,56px)',
                color: '#1A1410',
                margin: '12px 0 0',
                lineHeight: 1.1,
                letterSpacing: track,
              }}
            >
              {t('8 สาขา ใกล้บ้านคุณ', '8 branches near you')}
            </h1>
            <p style={{ fontSize: 17.5, color: 'rgba(61,53,46,.64)', margin: '18px 0 0' }}>
              {t(
                'เลือกสาขาที่สะดวก ดูแผนที่ Google Maps เส้นทาง และทักไลน์นัดหมายได้ทันที',
                'Pick a convenient branch — view it on Google Maps, get directions, and book via LINE.',
              )}
            </p>
          </div>
        </div>

        {/* ===== OVERVIEW MAP ===== */}
        <div style={{ ...sectionWrap, padding: '34px 20px 0' }}>
          <div
            data-reveal=""
            style={{
              position: 'relative',
              height: 380,
              borderRadius: 24,
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,.07)',
              boxShadow: '0 18px 48px -28px rgba(0,0,0,.28)',
            }}
          >
            <iframe
              src="https://www.google.com/maps?q=Bang+Kapi,+Bangkok&z=11&output=embed"
              title="Orange Smile branches overview"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 18,
                left: 18,
                background: 'rgba(255,255,255,.94)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0,0,0,.06)',
                borderRadius: 16,
                padding: '16px 18px',
                boxShadow: '0 12px 30px -16px rgba(0,0,0,.32)',
                maxWidth: 250,
              }}
            >
              <div
                style={{
                  fontFamily: "'Outfit','Anuphan',sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  color: '#1A1410',
                }}
              >
                {t('แผนที่สาขาของเรา', 'Our branch map')}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  marginTop: 12,
                  fontSize: 13,
                  color: 'rgba(61,53,46,.72)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: '#FF7A00',
                    }}
                  />
                  {regBkk} · {bkkCount}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: '#1FA39B',
                    }}
                  />
                  {regPty} · {ptyCount}
                </div>
              </div>
            </div>
            <a
              className="pcta"
              href="https://www.google.com/maps/search/?api=1&query=Orange+Smile+Dental"
              target="_blank"
              rel="noopener"
              style={{
                position: 'absolute',
                bottom: 18,
                right: 18,
                background: '#fff',
                border: '1px solid rgba(0,0,0,.1)',
                borderRadius: 12,
                padding: '11px 16px',
                fontSize: 13.5,
                fontWeight: 700,
                color: '#1A1410',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
                boxShadow: '0 12px 28px -14px rgba(0,0,0,.32)',
              }}
            >
              {MAP_ARROW}
              {openMap}
            </a>
          </div>
        </div>

        {/* ===== BANGKOK ===== */}
        <div style={{ ...sectionWrap, padding: '44px 20px 0' }}>
          <div
            data-reveal=""
            style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 22px' }}
          >
            <span
              style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF7A00' }}
            />
            <h2
              style={{
                fontFamily: "'Outfit','Anuphan',sans-serif",
                fontWeight: 700,
                fontSize: 23,
                color: '#1A1410',
                margin: 0,
              }}
            >
              {regBkk}
            </h2>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#F26C00',
                background: '#FFF3E8',
                padding: '4px 12px',
                borderRadius: 999,
              }}
            >
              {bkkCount}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {BRANCHES_BKK.map((b) => branchRow(b, false))}
          </div>
        </div>

        {/* ===== PATTAYA ===== */}
        <div style={{ ...sectionWrap, padding: '50px 20px 0' }}>
          <div
            data-reveal=""
            style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 22px' }}
          >
            <span
              style={{ width: 11, height: 11, borderRadius: '50%', background: '#1FA39B' }}
            />
            <h2
              style={{
                fontFamily: "'Outfit','Anuphan',sans-serif",
                fontWeight: 700,
                fontSize: 23,
                color: '#1A1410',
                margin: 0,
              }}
            >
              {regPty}
            </h2>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#1FA39B',
                background: '#E7F5F3',
                padding: '4px 12px',
                borderRadius: 999,
              }}
            >
              {ptyCount}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {BRANCHES_PTY.map((b) => branchRow(b, true))}
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div style={{ ...sectionWrap, padding: '56px 20px 50px' }}>
          <div
            data-reveal=""
            style={{
              position: 'relative',
              borderRadius: 30,
              overflow: 'hidden',
              background: 'linear-gradient(135deg,#FF8A1A,#F26C00 55%,#E05F00)',
              padding: '50px 40px',
              boxShadow: '0 30px 70px -24px rgba(255,122,0,.55)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -60,
                right: -30,
                width: 320,
                height: 320,
                borderRadius: '50%',
                background: 'radial-gradient(circle,rgba(255,255,255,.22),transparent 65%)',
              }}
            />
            <div style={{ position: 'relative', maxWidth: 680 }}>
              <h2
                style={{
                  fontFamily: "'Outfit','Anuphan',sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(26px,3.6vw,40px)',
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.15,
                  letterSpacing: track,
                }}
              >
                {t('หาสาขาที่ใช่แล้วใช่ไหม?', 'Found your branch?')}
              </h2>
              <p
                style={{
                  fontSize: 17,
                  color: 'rgba(255,255,255,.9)',
                  margin: '14px 0 26px',
                  maxWidth: 540,
                }}
              >
                {t(
                  'ทักไลน์หรือโทรหาสาขาที่สะดวก นัดหมายล่วงหน้าเพื่อไม่ต้องรอคิวนาน',
                  'Message or call your branch — book ahead to skip the wait.',
                )}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                <a
                  className="pcta"
                  href={SITE.lineUrl}
                  target="_blank"
                  rel="noopener"
                  style={{
                    height: 54,
                    padding: '0 26px',
                    borderRadius: 15,
                    background: '#fff',
                    color: '#F26C00',
                    fontSize: 15,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    textDecoration: 'none',
                    boxShadow: '0 14px 30px -10px rgba(0,0,0,.3)',
                  }}
                >
                  {t('ทักไลน์ปรึกษาฟรี', 'Free LINE consult')}
                </a>
                <a
                  className="pcta"
                  href={SITE.telUrl}
                  style={{
                    height: 54,
                    padding: '0 26px',
                    borderRadius: 15,
                    background: 'rgba(255,255,255,.16)',
                    border: '1px solid rgba(255,255,255,.4)',
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    textDecoration: 'none',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {t('โทรเลย', 'Call now')} · {SITE.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </>
  );
}
