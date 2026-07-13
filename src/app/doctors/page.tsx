'use client';

import Link from 'next/link';
import { PageStyles } from '@/components/PageStyles';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { useLang } from '@/lib/lang';
import { useReveal } from '@/lib/reveal';
import { mediaUrl } from '@/lib/media';
import { DOCTORS } from '@/content/doctors';

const CSS = `
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{margin:0;background:#fff;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
  ::selection{background:#FFD9B8;color:#1A1410}
  [data-reveal]{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
  [data-reveal][data-in]{opacity:1;transform:none}
  .doc-card{transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s}
  .doc-card:hover{transform:translateY(-5px);box-shadow:0 26px 54px -22px rgba(255,122,0,.34)!important}
  .doc-card:hover .doc-img{transform:scale(1.05)}
  .chip{cursor:pointer;transition:.2s;user-select:none}
  .pcta{transition:transform .2s}
  .pcta:hover{transform:translateY(-2px)}
  .pcta:active{transform:scale(.98)}
  @media (prefers-reduced-motion:reduce){[data-reveal]{opacity:1;transform:none}}
`;

/** The source's `A.orange` — every doctor card uses it. */
const ACCENT = '#FF7A00';

export default function DoctorsPage() {
  const { t, tl, track } = useLang();
  useReveal(0.92, 1500);

  const stats = [
    { n: '20+', l: t('ทันตแพทย์', 'Dentists') },
    { n: '7', l: t('สาขา', 'Branches') },
    { n: '7', l: t('สาขาเฉพาะทาง', 'Specialties') },
    { n: '4.9★', l: t('คะแนนรีวิว', 'Rating') },
  ];

  const trust = [
    {
      n: '01',
      h: t('วุฒิบัตรเฉพาะทาง', 'Board-certified'),
      d: t(
        'ทันตแพทย์ผ่านการอบรมเฉพาะทางจากสถาบันที่ได้รับการรับรอง',
        'Specialists trained and certified by accredited institutions.',
      ),
    },
    {
      n: '02',
      h: t('เทคโนโลยีดิจิทัล', 'Digital technology'),
      d: t(
        'สแกนช่องปาก 3 มิติ และวางแผนการรักษาด้วยระบบดิจิทัล',
        '3D intraoral scanning and digital treatment planning.',
      ),
    },
    {
      n: '03',
      h: t('มาตรฐานความสะอาด', 'Strict hygiene'),
      d: t(
        'ฆ่าเชื้อเครื่องมือทุกชิ้นตามมาตรฐานสากลทุกครั้ง',
        'Every instrument sterilized to international standards.',
      ),
    },
    {
      n: '04',
      h: t('ดูแลต่อเนื่อง', 'Continuous care'),
      d: t(
        'ติดตามผลและให้คำแนะนำหลังการรักษาอย่างใกล้ชิด',
        'Close follow-up and aftercare guidance for every patient.',
      ),
    },
  ];

  const bookLabel = t('ปรึกษาหมอท่านนี้', 'Consult this dentist');

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
        <SiteNav active="doctors" />

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
              {t('ทีมทันตแพทย์', 'Our dentists')}
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
              {t('ทันตแพทย์เฉพาะทางที่คุณวางใจ', 'Specialists you can trust')}
            </h1>
            <p style={{ fontSize: 17.5, color: 'rgba(61,53,46,.64)', margin: '18px 0 0' }}>
              {t(
                'ทีมทันตแพทย์กว่า 20 ท่าน จากสถาบันชั้นนำ พร้อมดูแลทุกความต้องการด้านสุขภาพช่องปากของคุณ',
                '20+ dentists from leading universities, ready to care for every dental need.',
              )}
            </p>
          </div>
          <div
            data-reveal=""
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
              maxWidth: 760,
              margin: '34px auto 0',
              background: 'linear-gradient(160deg,rgba(255,255,255,.82),rgba(255,255,255,.55))',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,.7)',
              borderRadius: 22,
              boxShadow: '0 12px 32px -8px rgba(255,122,0,.14)',
              padding: '22px 14px',
            }}
          >
            {stats.map((s) => (
              <div
                key={s.l}
                style={{
                  textAlign: 'center',
                  padding: '6px 10px',
                  borderRight: '1px solid rgba(0,0,0,.06)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontWeight: 800,
                    fontSize: 32,
                    color: '#FF7A00',
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'rgba(61,53,46,.65)',
                    marginTop: 6,
                    fontWeight: 500,
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== DOCTOR GRID ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '34px 20px 20px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))',
              gap: 24,
            }}
          >
            {DOCTORS.map((d) => (
              <div
                key={d.name}
                className="doc-card"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.05)',
                  borderRadius: 24,
                  overflow: 'hidden',
                  boxShadow: '0 18px 44px -24px rgba(0,0,0,.22)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '1/1',
                    overflow: 'hidden',
                    background: '#F3EFEA',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="doc-img"
                    src={mediaUrl(d.photo)}
                    alt={d.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      transition: 'transform .45s',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      background: ACCENT,
                      color: '#fff',
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: 999,
                      boxShadow: '0 6px 16px -6px rgba(0,0,0,.4)',
                    }}
                  >
                    {tl(d.role)}
                  </span>
                </div>
                <div
                  style={{
                    padding: '20px 22px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Outfit','Anuphan',sans-serif",
                      fontSize: 19,
                      fontWeight: 700,
                      color: '#1A1410',
                      margin: 0,
                      lineHeight: 1.25,
                    }}
                  >
                    {d.name}
                  </h3>
                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}
                  >
                    {d.tags.map((tg) => (
                      <span
                        key={tg.en}
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: '#F26C00',
                          background: '#FFF3E8',
                          padding: '4px 10px',
                          borderRadius: 999,
                        }}
                      >
                        {tl(tg)}
                      </span>
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: 'rgba(61,53,46,.62)',
                      margin: '14px 0 0',
                      lineHeight: 1.6,
                      flex: 1,
                    }}
                  >
                    {tl(d.bio)}
                  </p>
                  <a
                    className="pcta"
                    href="https://line.me"
                    target="_blank"
                    rel="noopener"
                    style={{
                      marginTop: 16,
                      height: 44,
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
                    {bookLabel}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== TRUST STRIP ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '30px auto 0',
            padding: '0 20px',
          }}
        >
          <div
            data-reveal=""
            style={{
              background: 'linear-gradient(160deg,#FFF8F1,#FFFDFB)',
              border: '1px solid rgba(255,122,0,.12)',
              borderRadius: 26,
              padding: '38px 30px',
            }}
          >
            <h2
              style={{
                fontFamily: "'Outfit','Anuphan',sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(22px,2.8vw,30px)',
                color: '#1A1410',
                margin: '0 0 26px',
                textAlign: 'center',
                letterSpacing: track,
              }}
            >
              {t('ทำไมต้องเลือกทีมทันตแพทย์ของเรา', 'Why choose our team')}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
                gap: 22,
              }}
            >
              {trust.map((x) => (
                <div
                  key={x.n}
                  style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}
                >
                  <span
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: '#FFF3E8',
                      color: '#FF7A00',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Outfit',sans-serif",
                        fontWeight: 800,
                        fontSize: 18,
                      }}
                    >
                      {x.n}
                    </span>
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15.5, color: '#1A1410' }}>
                      {x.h}
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        color: 'rgba(61,53,46,.62)',
                        marginTop: 4,
                      }}
                    >
                      {x.d}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '56px 20px 50px',
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
                {t('ไม่แน่ใจว่าควรพบหมอท่านไหน?', 'Not sure which dentist to see?')}
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
                  'ทักไลน์เล่าอาการให้เราฟัง ทีมงานจะแนะนำทันตแพทย์ที่เหมาะกับคุณที่สุด',
                  'Tell us your concern on LINE and we’ll match you with the right specialist.',
                )}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                <a
                  className="pcta"
                  href="https://line.me"
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
