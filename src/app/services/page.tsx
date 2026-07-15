'use client';

import Link from 'next/link';
import { PageStyles } from '@/components/PageStyles';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { Icon } from '@/components/Icon';
import { useLang } from '@/lib/lang';
import { useReveal } from '@/lib/reveal';
import { mediaUrl } from '@/lib/media';
import { SERVICES, SERVICE_PERKS, SERVICE_STEPS } from '@/content/services';
import { SITE } from '@/content/site';

const CSS = `
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{margin:0;background:#fff;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
  ::selection{background:#FFD9B8;color:#1A1410}
  [data-reveal]{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
  [data-reveal][data-in]{opacity:1;transform:none}
  .svc-card{transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s}
  .svc-card:hover{transform:translateY(-5px);box-shadow:0 26px 54px -24px rgba(255,122,0,.3)!important}
  .svc-card:hover .svc-img{transform:scale(1.06)}
  .pcta{transition:transform .2s}
  .pcta:hover{transform:translateY(-2px)}
  @media (prefers-reduced-motion:reduce){[data-reveal]{opacity:1;transform:none}}
`;

export default function ServicesPage() {
  const { t, tl, track } = useLang();
  useReveal(0.94, 1600);

  const pills = [
    t('ทีมเฉพาะทาง', 'Specialist team'),
    t('เทคโนโลยีดิจิทัล', 'Digital tech'),
    t('ผ่อน 0%', '0% installment'),
    t('8 สาขา', '8 branches'),
  ];

  const consult = t('สอบถาม / นัดหมาย', 'Ask / book now');

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
        <SiteNav active="services" />

        {/* ===== HEADER ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '140px 20px 0',
          }}
        >
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
              {t('บริการของเรา', 'Our services')}
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
              {t('ทันตกรรมครบวงจร ในที่เดียว', 'Full-service dentistry, all in one place')}
            </h1>
            <p style={{ fontSize: 17.5, color: 'rgba(61,53,46,.64)', margin: '18px 0 0' }}>
              {t(
                'ตั้งแต่ดูแลสุขภาพฟันทั่วไป จนถึงงานเฉพาะทางขั้นสูง ด้วยทีมทันตแพทย์เฉพาะทางและเทคโนโลยีทันสมัย',
                'From routine care to advanced specialist work, with specialist dentists and modern technology.',
              )}
            </p>
          </div>
          <div
            data-reveal=""
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'center',
              marginTop: 24,
            }}
          >
            {pills.map((pill) => (
              <span
                key={pill}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: '#3D352E',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.08)',
                  padding: '8px 16px',
                  borderRadius: 999,
                  boxShadow: '0 8px 22px -14px rgba(0,0,0,.2)',
                }}
              >
                <span
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF7A00' }}
                />
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* ===== SERVICE CARDS ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '44px 20px 20px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(360px,1fr))',
              gap: 26,
            }}
          >
            {SERVICES.map((s) => (
              <div
                key={s.name.en}
                className="svc-card"
                data-reveal=""
                style={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.05)',
                  borderRadius: 24,
                  overflow: 'hidden',
                  boxShadow: '0 18px 44px -26px rgba(0,0,0,.2)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    height: 196,
                    overflow: 'hidden',
                    background: '#F3EFEA',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(s.photo)}
                    alt={tl(s.name)}
                    loading="lazy"
                    className="svc-img"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform .3s',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 5,
                      background: s.accent,
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 14,
                      left: 14,
                      width: 50,
                      height: 50,
                      borderRadius: 15,
                      background: 'rgba(255,255,255,.94)',
                      backdropFilter: 'blur(8px)',
                      color: s.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px -8px rgba(0,0,0,.3)',
                    }}
                  >
                    <Icon shapes={s.icon} stroke={s.accent} size={26} />
                  </span>
                </div>
                <div
                  style={{
                    padding: '24px 26px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Outfit','Anuphan',sans-serif",
                        fontSize: 20,
                        fontWeight: 700,
                        color: '#1A1410',
                        margin: 0,
                      }}
                    >
                      {tl(s.name)}
                    </h3>
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: '#F26C00',
                        background: '#FFF3E8',
                        padding: '5px 11px',
                        borderRadius: 999,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tl(s.price)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: 'rgba(61,53,46,.64)',
                      margin: '12px 0 0',
                      lineHeight: 1.6,
                    }}
                  >
                    {tl(s.desc)}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 9,
                      margin: '16px 0 0',
                    }}
                  >
                    {s.items.map((it) => (
                      <div
                        key={it.en}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 9,
                          fontSize: 13.5,
                          color: 'rgba(61,53,46,.74)',
                        }}
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={s.accent}
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ flex: 'none', marginTop: 1 }}
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <span>{tl(it)}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    className="pcta"
                    href={SITE.lineUrl}
                    target="_blank"
                    rel="noopener"
                    style={{
                      marginTop: 20,
                      height: 46,
                      borderRadius: 13,
                      background: 'linear-gradient(180deg,#FF8A1A,#F26C00)',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      textDecoration: 'none',
                      boxShadow:
                        'inset 0 2px 3px rgba(255,255,255,.3),0 10px 24px -10px rgba(255,122,0,.5)',
                    }}
                  >
                    {consult}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== PROCESS ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '24px auto 0',
            padding: '0 20px',
          }}
        >
          <div
            data-reveal=""
            style={{
              background: 'linear-gradient(160deg,#FFF8F1,#FFFDFB)',
              border: '1px solid rgba(255,122,0,.12)',
              borderRadius: 28,
              padding: '42px 34px',
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 30px' }}>
              <h2
                style={{
                  fontFamily: "'Outfit','Anuphan',sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(24px,2.9vw,32px)',
                  color: '#1A1410',
                  margin: 0,
                  letterSpacing: track,
                }}
              >
                {t('ขั้นตอนการรักษาของเรา', 'Our treatment process')}
              </h2>
              <p style={{ fontSize: 15.5, color: 'rgba(61,53,46,.62)', margin: '12px 0 0' }}>
                {t(
                  'โปร่งใส เข้าใจง่าย ทุกขั้นตอนอธิบายชัดเจนก่อนเริ่มเสมอ',
                  'Transparent and clear — every step explained before we begin.',
                )}
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
                gap: 22,
              }}
            >
              {SERVICE_STEPS.map((st) => (
                <div
                  key={st.n}
                  style={{
                    position: 'relative',
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,.05)',
                    borderRadius: 20,
                    padding: '24px 22px',
                    boxShadow: '0 12px 30px -22px rgba(0,0,0,.2)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontWeight: 800,
                      fontSize: 30,
                      color: '#FFCFA0',
                      lineHeight: 1,
                    }}
                  >
                    {st.n}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: '#1A1410',
                      marginTop: 8,
                    }}
                  >
                    {tl(st.h)}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      color: 'rgba(61,53,46,.62)',
                      marginTop: 6,
                      lineHeight: 1.55,
                    }}
                  >
                    {tl(st.d)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== INSTALLMENT BANNER ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '26px auto 0',
            padding: '0 20px',
          }}
        >
          <div
            data-reveal=""
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: 18,
            }}
          >
            {SERVICE_PERKS.map((perk) => (
              <div
                key={perk.h.en}
                style={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.05)',
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: '0 14px 36px -26px rgba(0,0,0,.2)',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: perk.tint,
                    color: perk.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 'none',
                  }}
                >
                  <Icon shapes={perk.icon} stroke={perk.accent} size={26} />
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#1A1410' }}>
                    {tl(perk.h)}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      color: 'rgba(61,53,46,.62)',
                      marginTop: 4,
                      lineHeight: 1.55,
                    }}
                  >
                    {tl(perk.d)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '48px 20px 50px',
          }}
        >
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
                {t(
                  'พร้อมเริ่มดูแลรอยยิ้มของคุณแล้วหรือยัง?',
                  'Ready to start caring for your smile?',
                )}
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
                  'ทักไลน์ปรึกษาฟรี ไม่มีค่าใช้จ่าย ทีมงานพร้อมแนะนำบริการที่เหมาะกับคุณ',
                  'Free LINE consultation — we’ll guide you to the right service for you.',
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
                <Link
                  className="pcta"
                  href="/branches"
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
                  {t('ดูสาขาใกล้คุณ', 'Find a branch')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </>
  );
}
