'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PageStyles } from '@/components/PageStyles';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { useLang } from '@/lib/lang';
import { useReveal, revealNewlyMounted } from '@/lib/reveal';
import { useBeforeAfter } from '@/lib/beforeAfter';
import { mediaUrl } from '@/lib/media';
import { CASES, type CaseCat } from '@/content/cases';
import { GALLERY, GALLERY_CATS } from '@/content/gallery.generated';
import { SITE } from '@/content/site';

const CSS = `
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{margin:0;background:#fff;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
  ::selection{background:#FFD9B8;color:#1A1410}
  [data-reveal]{opacity:0;transform:translateY(18px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
  [data-reveal][data-in]{opacity:1;transform:none}
  .case-card{transition:transform .25s,box-shadow .25s}
  .case-card:hover{transform:translateY(-3px);box-shadow:0 18px 40px -26px rgba(0,0,0,.3)!important}
  .chip{cursor:pointer;transition:.2s;user-select:none}
  .pcta{transition:transform .2s}
  .pcta:hover{transform:translateY(-2px)}
  .ba-slider{touch-action:none}
  .ba-slider img{-webkit-user-drag:none;user-select:none;pointer-events:none}
  @keyframes baNudge{0%,100%{transform:translateX(0)}50%{transform:translateX(-7px)}}
  @media (prefers-reduced-motion:reduce){[data-reveal]{opacity:1;transform:none}}
`;

type Filter = 'all' | CaseCat;

export default function ReviewsPage() {
  const { t, tl, track } = useLang();
  const [filter, setFilter] = useState<Filter>('all');
  const [hintDone, setHintDone] = useState(false);
  useReveal(0.94, 1600);
  const { posOf, handlers, interacted } = useBeforeAfter(50);

  // The source hides the drag hint after the first interaction or a few seconds.
  useEffect(() => {
    const timer = setTimeout(() => setHintDone(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const showHints = !hintDone && !interacted;

  const shown = filter === 'all' ? CASES : CASES.filter((c) => c.key === filter);

  const chipDefs: { key: Filter; label: string }[] = [
    { key: 'all', label: t('ทั้งหมด', 'All') },
    { key: 'ortho', label: t('จัดฟัน', 'Braces') },
    { key: 'implant', label: t('รากฟันเทียม', 'Implant') },
    { key: 'veneer', label: t('วีเนียร์', 'Veneers') },
    { key: 'whitening', label: t('ฟอกสีฟัน', 'Whitening') },
  ];

  const pickFilter = (f: Filter) => () => {
    setFilter(f);
    revealNewlyMounted();
  };

  const headStats = [
    { n: '5,000+', l: t('เคสที่ดูแล', 'cases treated') },
    { n: '4.9★', l: t('คะแนนความพึงพอใจ', 'satisfaction') },
    { n: '7', l: t('สาขา', 'branches') },
  ];

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
        <SiteNav active="reviews" />

        {/* ===== HEADER ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1180,
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
              {t('ผลลัพธ์ก่อน–หลัง', 'Before & after')}
            </div>
            <h1
              style={{
                fontFamily: "'Outfit','Anuphan',sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(34px,4.6vw,54px)',
                color: '#1A1410',
                margin: '12px 0 0',
                lineHeight: 1.1,
                letterSpacing: track,
              }}
            >
              {t('ผลลัพธ์จริง', 'Real results')}
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(61,53,46,.62)', margin: '18px 0 0' }}>
              {t(
                'ภาพเคสจริงของคนไข้ ลากแถบตรงกลางไปทางซ้าย–ขวาเพื่อเทียบก่อนและหลังการรักษาในแต่ละบริการ',
                'Real patient cases — drag the slider left and right to compare before and after for each treatment.',
              )}
            </p>
          </div>
          <div
            data-reveal=""
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '18px 30px',
              justifyContent: 'center',
              marginTop: 26,
            }}
          >
            {headStats.map((s) => (
              <div key={s.l} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontWeight: 800,
                    fontSize: 26,
                    color: '#FF7A00',
                  }}
                >
                  {s.n}
                </span>
                <span style={{ fontSize: 13.5, color: 'rgba(61,53,46,.6)' }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== FILTER ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1180,
            margin: '0 auto',
            padding: '36px 20px 0',
          }}
        >
          <div
            data-reveal=""
            style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}
          >
            {chipDefs.map((c) => {
              const on = c.key === filter;
              return (
                <button
                  key={c.key}
                  className="chip"
                  onClick={pickFilter(c.key)}
                  style={{
                    border: `1px solid ${on ? '#FF7A00' : 'rgba(0,0,0,.1)'}`,
                    background: on ? '#FF7A00' : '#fff',
                    color: on ? '#fff' : 'rgba(61,53,46,.72)',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    fontWeight: 600,
                    padding: '9px 18px',
                    borderRadius: 999,
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== CASES ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1180,
            margin: '0 auto',
            padding: '30px 20px 20px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(360px,1fr))',
              gap: 26,
            }}
          >
            {shown.map((c) => {
              const { posPct, clip } = posOf(c.key);
              return (
                <div
                  key={c.key}
                  className="case-card"
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,.07)',
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px -24px rgba(0,0,0,.25)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* BEFORE / AFTER SLIDER */}
                  <div
                    className="ba-slider"
                    data-key={c.key}
                    {...handlers}
                    style={{
                      position: 'relative',
                      aspectRatio: '4/3',
                      background: '#1A1410',
                      overflow: 'hidden',
                      cursor: 'ew-resize',
                      userSelect: 'none',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mediaUrl(c.after)}
                      alt="หลังรักษา"
                      loading="lazy"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mediaUrl(c.before)}
                      alt="ก่อนรักษา"
                      loading="lazy"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        clipPath: clip,
                      }}
                    />

                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: 'rgba(26,20,16,.6)',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: 999,
                        letterSpacing: '.3px',
                        pointerEvents: 'none',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {t('ก่อน', 'Before')}
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: '#FF7A00',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: 999,
                        letterSpacing: '.3px',
                        pointerEvents: 'none',
                      }}
                    >
                      {t('หลัง', 'After')}
                    </span>

                    {/* divider + handle */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: posPct,
                        width: 3,
                        marginLeft: -1.5,
                        background: '#fff',
                        boxShadow: '0 0 12px rgba(0,0,0,.45)',
                        pointerEvents: 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: posPct,
                        transform: 'translate(-50%,-50%)',
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: '#fff',
                        boxShadow: '0 4px 14px rgba(0,0,0,.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 3,
                        pointerEvents: 'none',
                      }}
                    >
                      <span
                        style={{
                          color: '#FF7A00',
                          fontSize: 14,
                          fontWeight: 900,
                          lineHeight: 1,
                        }}
                      >
                        ‹
                      </span>
                      <span
                        style={{
                          color: '#FF7A00',
                          fontSize: 14,
                          fontWeight: 900,
                          lineHeight: 1,
                        }}
                      >
                        ›
                      </span>
                    </div>

                    {/* drag hint */}
                    {showHints && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 12,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(26,20,16,.66)',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '6px 14px',
                          borderRadius: 999,
                          pointerEvents: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 7,
                          animation: 'baNudge 1.6s ease-in-out infinite',
                        }}
                      >
                        ⟷ {t('ลากเพื่อเทียบ', 'Drag to compare')}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      padding: '18px 20px 20px',
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
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: '#FF7A00',
                          background: '#FFF3E8',
                          padding: '4px 11px',
                          borderRadius: 999,
                        }}
                      >
                        {tl(c.catLabel)}
                      </span>
                      <span
                        style={{
                          fontSize: 11.5,
                          color: 'rgba(61,53,46,.45)',
                          fontFamily: "'Inter',monospace",
                        }}
                      >
                        {t('เคส #', 'Case #') + c.code}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Outfit','Anuphan',sans-serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#1A1410',
                        margin: '12px 0 0',
                        lineHeight: 1.3,
                      }}
                    >
                      {tl(c.titleLong)}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: 'rgba(61,53,46,.68)',
                        margin: '10px 0 0',
                        lineHeight: 1.65,
                        fontStyle: 'italic',
                        flex: 1,
                      }}
                    >
                      “{tl(c.quote)}”
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 16,
                        paddingTop: 14,
                        borderTop: '1px solid rgba(0,0,0,.06)',
                        fontSize: 12.5,
                        color: 'rgba(61,53,46,.6)',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#FF7A00',
                          }}
                        />
                        {tl(c.doctor)}
                      </span>
                      <span style={{ marginLeft: 'auto' }}>{tl(c.branch)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p
            data-reveal=""
            style={{
              textAlign: 'center',
              fontSize: 12.5,
              color: 'rgba(61,53,46,.5)',
              margin: '30px auto 0',
              maxWidth: 700,
              lineHeight: 1.6,
            }}
          >
            {t(
              '* ภาพเป็นเคสจริงที่ได้รับความยินยอมให้เผยแพร่ ผลลัพธ์ขึ้นอยู่กับสภาพช่องปากของแต่ละบุคคล เป็นไปตาม พ.ร.บ. สถานพยาบาล',
              '* Images are real, consented patient cases; results vary by individual, in line with Thai medical-advertising law.',
            )}
          </p>
        </div>

        {/* ===== MORE RESULTS GALLERY ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1180,
            margin: '0 auto',
            padding: '40px 20px 10px',
          }}
        >
          <div
            data-reveal=""
            style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto 28px' }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#FF7A00',
              }}
            >
              {t('แกลเลอรีผลลัพธ์', 'Results gallery')}
            </div>
            <h2
              style={{
                fontFamily: "'Outfit','Anuphan',sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(24px,3vw,36px)',
                color: '#1A1410',
                margin: '10px 0 0',
                lineHeight: 1.15,
                letterSpacing: track,
              }}
            >
              {t('รวมผลงานจริงทุกเคส', 'Every real case, all in one place')}
            </h2>
            <p style={{ fontSize: 15.5, color: 'rgba(61,53,46,.62)', margin: '12px 0 0' }}>
              {t(
                'คลังภาพเคสจริงจากคลินิก ครบทุกบริการ — จัดฟัน วีเนียร์ อุดฟัน ฟอกสีฟัน ฟันปลอม และรากฟันเทียม',
                'Our full archive of real clinic cases across every service — braces, veneers, bonding, whitening, dentures and implants.',
              )}
            </p>
          </div>
          <div style={{ columns: '4 250px', columnGap: 20 }}>
            {GALLERY.map((g) => {
              const catLabel = tl(GALLERY_CATS[g.cat]);
              return (
                <div
                  key={g.img}
                  className="case-card"
                  data-reveal=""
                  style={{
                    breakInside: 'avoid',
                    margin: '0 0 16px',
                    position: 'relative',
                    background: '#1A1410',
                    border: '1px solid rgba(0,0,0,.07)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px -24px rgba(0,0,0,.25)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(g.img)}
                    alt={catLabel}
                    loading="lazy"
                    style={{ display: 'block', width: '100%', height: 'auto' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'rgba(26,20,16,.62)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 11px',
                      borderRadius: 999,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {catLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1180,
            margin: '0 auto',
            padding: '44px 20px 56px',
          }}
        >
          <div
            data-reveal=""
            style={{
              border: '1px solid rgba(255,122,0,.18)',
              background: '#FFF8F1',
              borderRadius: 24,
              padding: '40px 34px',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontFamily: "'Outfit','Anuphan',sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(24px,3vw,34px)',
                color: '#1A1410',
                margin: 0,
                letterSpacing: track,
              }}
            >
              {t('อยากเห็นผลลัพธ์แบบนี้บ้างไหม?', 'Want results like these?')}
            </h2>
            <p
              style={{
                fontSize: 16,
                color: 'rgba(61,53,46,.64)',
                margin: '14px auto 26px',
                maxWidth: 520,
              }}
            >
              {t(
                'ทักไลน์ส่งรูปฟันของคุณมาให้ทีมทันตแพทย์ประเมินแนวทางและผลลัพธ์ที่เป็นไปได้ ฟรี',
                'Send a photo of your teeth on LINE and our dentists will assess your options — free.',
              )}
            </p>
            <div
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}
            >
              <a
                className="pcta"
                href={SITE.lineUrl}
                target="_blank"
                rel="noopener"
                style={{
                  height: 52,
                  padding: '0 26px',
                  borderRadius: 14,
                  background: 'linear-gradient(180deg,#FF8A1A,#F26C00)',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  textDecoration: 'none',
                  boxShadow: '0 12px 28px -12px rgba(255,122,0,.55)',
                }}
              >
                {t('ส่งรูปประเมินฟรีทางไลน์', 'Free LINE assessment')}
              </a>
              <Link
                className="pcta"
                href="/doctors"
                style={{
                  height: 52,
                  padding: '0 26px',
                  borderRadius: 14,
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.1)',
                  color: '#1A1410',
                  fontSize: 15,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  textDecoration: 'none',
                }}
              >
                {t('พบทีมทันตแพทย์', 'Meet the team')}
              </Link>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </>
  );
}
