'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PageStyles } from '@/components/PageStyles';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { Icon } from '@/components/Icon';
import { useLang } from '@/lib/lang';
import { useReveal } from '@/lib/reveal';
import { useBeforeAfter } from '@/lib/beforeAfter';
import { mediaUrl } from '@/lib/media';
import { BRANCHES_BKK, BRANCHES_PTY, type Branch } from '@/content/branches';
import { DOCTORS, HERO_FACES } from '@/content/doctors';
import { HOME_SERVICES, HOME_STEPS } from '@/content/services';
import { REVIEWS_LOOP } from '@/content/reviews';
import { HOME_CASES } from '@/content/cases';
import { HOME_POSTS } from '@/content/articles';
import { SITE } from '@/content/site';

const CSS = `
  .ba-card{transition:transform .25s,box-shadow .25s}
  .ba-card:hover{transform:translateY(-3px);box-shadow:0 18px 40px -26px rgba(0,0,0,.3)!important}
  .ba-slider{touch-action:none}
  .ba-slider img{-webkit-user-drag:none;user-select:none;pointer-events:none}
  @keyframes float1{0%,100%{transform:translateY(0) translateX(0)}50%{transform:translateY(-8px) translateX(2px)}}
  @keyframes float2{0%,100%{transform:translateY(0) translateX(0)}50%{transform:translateY(-9px) translateX(-2px)}}
  @keyframes float3{0%,100%{transform:translateY(0)}50%{transform:translateY(-11px)}}
  @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
  @keyframes ring{0%{transform:scale(.9);opacity:.55}100%{transform:scale(2.1);opacity:0}}
  @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  [data-reveal]{opacity:1;transform:none}
  .marq:hover .marqt{animation-play-state:paused}
  .osd-link{position:relative}
  .osd-link::after{content:"";position:absolute;left:0;bottom:-5px;height:2px;width:0;background:#FF7A00;border-radius:2px;transition:width .28s cubic-bezier(.16,1,.3,1)}
  .osd-link:hover::after{width:100%}
  .svc-card:hover{transform:translateY(-4px);box-shadow:0 22px 44px -16px rgba(255,122,0,.30),inset 0 2px 4px rgba(255,255,255,.85)!important}
  .svc-card:hover .svc-ic{transform:scale(1.1) rotate(-3deg)}
  .svc-card:hover .svc-img{transform:scale(1.07)}
  .den-card:hover{transform:translateY(-4px)}
  .den-card:hover img{transform:scale(1.05)}
  .br-card:hover{transform:translateY(-4px)}
  .post-card:hover img{transform:scale(1.06)}
  .pcta:hover{transform:translateY(-2px) scale(1.02)}
  .pcta:active{transform:scale(.98)}
  @media (prefers-reduced-motion:reduce){[data-reveal]{opacity:1;transform:none}*{animation:none!important}}
`;

const ARROW = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const ARROW_15 = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const PIN = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4285F4"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const FACEBOOK = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
  </svg>
);

const LINE_ICON = (size: number) => (
  <svg
    width={size}
    height={size}
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

const PHONE_ICON = (size: number) => (
  <svg
    width={size}
    height={size}
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

const sectionKicker: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: '#FF7A00',
};

export default function HomePage() {
  const { t, tl, track } = useLang();
  const [chat, setChat] = useState(false);
  useReveal(0.92, 1400);
  const { posOf, handlers } = useBeforeAfter(50);

  const h2Style: React.CSSProperties = {
    fontFamily: "'Outfit','Anuphan',sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(28px,3.6vw,40px)',
    color: '#1A1410',
    margin: '10px 0 0',
    lineHeight: 1.15,
    letterSpacing: track,
  };
  const subStyle: React.CSSProperties = {
    fontSize: 16.5,
    color: 'rgba(61,53,46,.62)',
    margin: '14px 0 0',
  };

  const stats = [
    { n: '7', l: t('สาขา', 'Branches') },
    { n: '20+', l: t('ทันตแพทย์', 'Dentists') },
    { n: '10+', l: t('ปีประสบการณ์', 'Years experience') },
    { n: '4.9★', l: t('รีวิวพึงพอใจ', 'Avg. rating') },
  ];

  const subBrands = [
    {
      name: 'Orange Smile Dental',
      area: t('กรุงเทพฯ • 4 สาขา', 'Bangkok • 4 branches'),
      accent: '#FF7A00',
      logo: 'assets/media/image4.webp',
      tint: '#FFF3E8',
    },
    {
      name: 'Dr.Amon Dental',
      area: t('ชลบุรี–พัทยา • 2 สาขา', 'Chonburi–Pattaya • 2 branches'),
      accent: '#1FA39B',
      logo: 'assets/media/image34.webp',
      tint: '#E7F5F3',
    },
    {
      name: 'Pink Smile Dental',
      area: t('ไร่วนาสินธุ์ • 1 สาขา', 'Wanasin • 1 branch'),
      accent: '#FF5FA2',
      logo: 'assets/media/image42.webp',
      tint: '#FFEAF3',
    },
  ];

  /** Branch cards are identical between the two regions apart from the phone-button colour. */
  const branchCard = (b: Branch, tinted: boolean) => (
    <div
      key={b.key}
      className="br-card"
      data-reveal=""
      style={{
        background: '#fff',
        border: '1px solid rgba(0,0,0,.05)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 16px 40px -24px rgba(0,0,0,.18)',
        transition: '.3s',
      }}
    >
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
            height: 4,
            background: b.accent,
          }}
        />
        <a
          className="pcta"
          href={b.mapUrl}
          target="_blank"
          rel="noopener"
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            background: 'rgba(255,255,255,.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0,0,0,.06)',
            borderRadius: 11,
            padding: '7px 12px',
            fontSize: 12.5,
            fontWeight: 700,
            color: '#1A1410',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            textDecoration: 'none',
            boxShadow: '0 8px 20px -10px rgba(0,0,0,.35)',
            transition: '.2s',
          }}
        >
          {PIN}
          {t('นำทาง', 'Directions')}
        </a>
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1A1410', margin: 0 }}>{tl(b.name)}</h4>
        <div style={{ fontSize: 12.5, color: 'rgba(61,53,46,.58)', marginTop: 5 }}>
          {tl(b.area)}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <a
            className="pcta"
            href={b.lineUrl}
            target="_blank"
            rel="noopener"
            style={{
              flex: 1,
              height: 38,
              borderRadius: 11,
              background: '#06C755',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              textDecoration: 'none',
              transition: '.2s',
            }}
          >
            LINE
          </a>
          <a
            className="pcta"
            href={b.fbUrl}
            target="_blank"
            rel="noopener"
            title="Facebook"
            style={{
              width: 38,
              height: 38,
              flex: 'none',
              borderRadius: 11,
              background: '#1877F2',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: '.2s',
            }}
          >
            {FACEBOOK}
          </a>
          <a
            className="pcta"
            href={b.telUrl}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 11,
              background: tinted ? b.tint : '#FFF3E8',
              color: tinted ? b.accent : '#F26C00',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              textDecoration: 'none',
              transition: '.2s',
            }}
          >
            {b.phone}
          </a>
        </div>
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
        <SiteNav active="home" />

        {/* ===== HERO ===== */}
        <div
          id="top"
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '140px 20px 40px',
          }}
        >
          <div
            data-reveal=""
            style={{
              position: 'relative',
              borderRadius: 28,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,.7)',
              boxShadow: '0 30px 70px -24px rgba(255,122,0,.35)',
              aspectRatio: '24/9',
              width: '100%',
              background: '#F3EFEA',
              marginBottom: 46,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl('assets/hero/home-hero-cover.webp')}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div data-reveal="" style={{ maxWidth: 680 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  background:
                    'linear-gradient(160deg,rgba(255,255,255,.85),rgba(255,255,255,.55))',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,.8)',
                  borderRadius: 999,
                  padding: '7px 16px 7px 8px',
                  boxShadow: '0 8px 22px -10px rgba(255,122,0,.25)',
                }}
              >
                <div style={{ display: 'flex' }}>
                  {HERO_FACES.map((f, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={f}
                      src={mediaUrl(f)}
                      alt=""
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        border: '2px solid #fff',
                        marginRight: i === HERO_FACES.length - 1 ? undefined : -9,
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#3D352E' }}>
                  {t(
                    'ดูแลรอยยิ้มกว่า 7 สาขา ทั่วกรุงเทพฯ–พัทยา',
                    'Smiles cared for across 7 branches',
                  )}
                </span>
              </div>

              {/* font-size lives in globals.css (.osd-hero-h1) so the phone
                  override can win the cascade against these inline styles. */}
              <h1
                className="osd-hero-h1"
                style={{
                  fontFamily: "'Outfit','Anuphan',sans-serif",
                  fontWeight: 800,
                  lineHeight: 1.08,
                  color: '#1A1410',
                  margin: '22px 0 0',
                  letterSpacing: track,
                }}
              >
                {t('รอยยิ้มที่คุณมั่นใจ', 'Confident smiles')}
                <br />
                <span
                  className="osd-hero-accent"
                  style={{ position: 'relative', display: 'inline-block' }}
                >
                  <span style={{ color: '#FF7A00' }}>
                    {t('เริ่มที่ Orange Smile', 'start right here')}
                  </span>
                  <svg
                    width="100%"
                    height="16"
                    viewBox="0 0 240 16"
                    preserveAspectRatio="none"
                    fill="none"
                    style={{ position: 'absolute', left: 0, bottom: -12 }}
                  >
                    <path
                      d="M4 6 Q120 22 236 6"
                      stroke="#FFB04D"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p
                style={{
                  fontSize: 18,
                  color: 'rgba(61,53,46,.66)',
                  maxWidth: 490,
                  margin: '30px 0 0',
                }}
              >
                {t(
                  'กลุ่มคลินิกทันตกรรมครบวงจร ดูแลโดยทีมทันตแพทย์เฉพาะทางกว่า 20 ท่าน ใกล้บ้านคุณทั้งกรุงเทพฯ และพัทยา',
                  'A full-service dental group with 20+ specialist dentists — close to you across Bangkok and Pattaya.',
                )}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 32 }}>
                <a
                  className="pcta"
                  href="#contact"
                  style={{
                    height: 54,
                    padding: '0 24px',
                    borderRadius: 15,
                    background: 'linear-gradient(180deg,#FF8A1A,#F26C00)',
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 11,
                    textDecoration: 'none',
                    boxShadow:
                      'inset 0 2px 3px rgba(255,255,255,.35),0 14px 30px -8px rgba(255,122,0,.55)',
                    transition: '.2s',
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                  {t('ทักไลน์ปรึกษาฟรี', 'Chat on LINE — free')}
                </a>

                <a
                  className="pcta"
                  href="#services"
                  style={{
                    height: 54,
                    padding: '0 22px',
                    borderRadius: 15,
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,.08)',
                    color: '#1A1410',
                    fontSize: 15,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 11,
                    textDecoration: 'none',
                    boxShadow: '0 8px 22px -12px rgba(0,0,0,.25)',
                    transition: '.2s',
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: '#FFF3E8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF7A00">
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                  </span>
                  {t('ดูบริการทั้งหมด', 'Explore services')}
                </a>
              </div>
            </div>
          </div>

          {/* trust stats */}
          <div
            data-reveal=""
            style={{
              marginTop: 56,
              background: 'linear-gradient(160deg,rgba(255,255,255,.82),rgba(255,255,255,.55))',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,.7)',
              borderRadius: 24,
              boxShadow:
                '0 12px 32px -8px rgba(255,122,0,.14),inset 0 2px 4px rgba(255,255,255,.8)',
              padding: '26px 18px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
              }}
            >
              {stats.map((s) => (
                <div
                  key={s.l}
                  style={{
                    textAlign: 'center',
                    padding: '8px 12px',
                    borderRight: '1px solid rgba(0,0,0,.06)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontWeight: 800,
                      fontSize: 38,
                      color: '#FF7A00',
                      lineHeight: 1,
                    }}
                  >
                    {s.n}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
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
        </div>

        {/* ===== SUB-BRANDS ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '60px 20px 20px',
          }}
        >
          <div
            data-reveal=""
            style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 36px' }}
          >
            <div style={sectionKicker}>{t('เครือคลินิกของเรา', 'Our group')}</div>
            <h2 style={h2Style}>
              {t('สามแบรนด์ หนึ่งมาตรฐานการดูแล', 'Three brands, one standard of care')}
            </h2>
            <p style={subStyle}>
              {t(
                'แต่ละสาขาปรับธีมตามพื้นที่ แต่ใช้ทีมทันตแพทย์ เครื่องมือ และมาตรฐานความสะอาดเดียวกัน',
                'Each branch is themed to its neighborhood — same team, equipment and hygiene standards.',
              )}
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: 22,
            }}
          >
            {subBrands.map((b) => (
              <div
                key={b.name}
                className="br-card"
                data-reveal=""
                style={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.05)',
                  borderRadius: 24,
                  padding: 28,
                  boxShadow: '0 16px 40px -22px rgba(0,0,0,.18)',
                  transition: '.3s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 5,
                    background: b.accent,
                  }}
                />
                <div
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: 20,
                    background: b.tint,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 18,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(b.logo)}
                    alt={b.name}
                    loading="lazy"
                    style={{ width: 54, height: 54, objectFit: 'contain' }}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontWeight: 700,
                    fontSize: 21,
                    color: '#1A1410',
                    margin: 0,
                  }}
                >
                  {b.name}
                </h3>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    marginTop: 10,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: b.accent,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: b.accent,
                    }}
                  />
                  {b.area}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SERVICES ===== */}
        <div
          id="services"
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '64px 20px 20px',
            scrollMarginTop: 100,
          }}
        >
          <div
            data-reveal=""
            style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}
          >
            <div style={sectionKicker}>{t('บริการ', 'Services')}</div>
            <h2 style={h2Style}>{t('บริการทันตกรรมครบวงจร', 'Full-service dentistry')}</h2>
            <p style={subStyle}>
              {t(
                'ตั้งแต่ดูแลสุขภาพฟันทั่วไป จนถึงงานเฉพาะทางขั้นสูง ในที่เดียว',
                'From routine check-ups to advanced specialist work — all in one place.',
              )}
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
              gap: 20,
            }}
          >
            {HOME_SERVICES.map((s) => (
              <div
                key={s.name.en}
                className="svc-card"
                data-reveal=""
                style={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.06)',
                  borderRadius: 22,
                  overflow: 'hidden',
                  boxShadow: '0 14px 34px -22px rgba(0,0,0,.2)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    height: 158,
                    overflow: 'hidden',
                    background: '#F3EFEA',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="svc-img"
                    src={mediaUrl(s.photo)}
                    loading="lazy"
                    alt={tl(s.name)}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform .5s cubic-bezier(.16,1,.3,1)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg,rgba(26,20,16,0) 40%,rgba(26,20,16,.34) 100%)',
                    }}
                  />
                  <span
                    className="svc-ic"
                    style={{
                      position: 'absolute',
                      bottom: -22,
                      left: 18,
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: s.tint,
                      color: s.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid #fff',
                      boxShadow: '0 8px 18px -8px rgba(0,0,0,.3)',
                      transition: '.3s',
                    }}
                  >
                    <Icon shapes={s.icon} stroke={s.color} />
                  </span>
                </div>
                <div style={{ padding: '30px 22px 24px' }}>
                  <h3
                    style={{
                      fontSize: 17.5,
                      fontWeight: 700,
                      color: '#1A1410',
                      margin: '0 0 6px',
                    }}
                  >
                    {tl(s.name)}
                  </h3>
                  <p style={{ fontSize: 14, color: 'rgba(61,53,46,.62)', margin: 0 }}>
                    {tl(s.desc)}
                  </p>
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
            margin: '0 auto',
            padding: '64px 20px 20px',
          }}
        >
          <div
            data-reveal=""
            style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 38px' }}
          >
            <div style={sectionKicker}>{t('ง่าย โปร่งใส', 'Simple & transparent')}</div>
            <h2 style={h2Style}>{t('ขั้นตอนการรักษาของเรา', 'Our treatment process')}</h2>
            <p style={subStyle}>
              {t(
                'ทุกขั้นตอนอธิบายชัดเจนก่อนเริ่มเสมอ เพื่อให้คุณสบายใจตลอดการรักษา',
                'Every step explained clearly before we begin, so you feel at ease throughout.',
              )}
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
              gap: 20,
            }}
          >
            {HOME_STEPS.map((st) => (
              <div
                key={st.n}
                data-reveal=""
                style={{
                  position: 'relative',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.06)',
                  borderRadius: 20,
                  padding: '26px 24px',
                  boxShadow: '0 12px 30px -24px rgba(0,0,0,.2)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontWeight: 800,
                    fontSize: 32,
                    color: '#FFCFA0',
                    lineHeight: 1,
                  }}
                >
                  {st.n}
                </div>
                <div
                  style={{ fontWeight: 700, fontSize: 16.5, color: '#1A1410', marginTop: 10 }}
                >
                  {tl(st.h)}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: 'rgba(61,53,46,.62)',
                    marginTop: 7,
                    lineHeight: 1.55,
                  }}
                >
                  {tl(st.d)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== DENTISTS ===== */}
        <div
          id="dentists"
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '64px 20px 20px',
            scrollMarginTop: 100,
          }}
        >
          <div
            data-reveal=""
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 32,
            }}
          >
            <div style={{ maxWidth: 560 }}>
              <div style={sectionKicker}>{t('ทีมทันตแพทย์', 'Dentists')}</div>
              <h2 style={h2Style}>{t('พบทีมทันตแพทย์ของเรา', 'Meet our dentists')}</h2>
              <p style={{ ...subStyle, margin: '12px 0 0' }}>
                {t(
                  'ทันตแพทย์เฉพาะทางกว่า 20 ท่าน จากสถาบันชั้นนำ',
                  '20+ specialists from leading universities',
                )}
              </p>
            </div>
            <Link
              className="pcta"
              href="/doctors"
              style={{
                height: 44,
                padding: '0 20px',
                borderRadius: 13,
                background: '#fff',
                border: '1px solid rgba(0,0,0,.08)',
                color: '#1A1410',
                fontWeight: 700,
                fontSize: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
                boxShadow: '0 8px 22px -12px rgba(0,0,0,.2)',
                transition: '.2s',
              }}
            >
              {t('ดูทั้งหมด', 'View all')} {ARROW}
            </Link>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 20,
              overflowX: 'auto',
              padding: '6px 2px 22px',
              scrollSnapType: 'x mandatory',
            }}
          >
            {DOCTORS.map((d) => (
              <div
                key={d.name}
                className="den-card"
                style={{
                  flex: 'none',
                  width: 248,
                  scrollSnapAlign: 'start',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.05)',
                  borderRadius: 22,
                  overflow: 'hidden',
                  boxShadow: '0 16px 40px -22px rgba(0,0,0,.2)',
                  transition: '.3s',
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
                    src={mediaUrl(d.photo)}
                    alt={d.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      transition: '.4s',
                    }}
                  />
                </div>
                <div style={{ padding: '16px 18px 20px' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1410', margin: 0 }}>
                    {d.name}
                  </h3>
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#FF7A00',
                      background: '#FFF3E8',
                      padding: '4px 10px',
                      borderRadius: 999,
                    }}
                  >
                    {tl(d.role)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== BEFORE / AFTER ===== */}
        <div
          id="results"
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '64px 20px 20px',
            scrollMarginTop: 100,
          }}
        >
          <div
            data-reveal=""
            style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 34px' }}
          >
            <div style={sectionKicker}>{t('ผลลัพธ์', 'Results')}</div>
            <h2 style={h2Style}>{t('ผลลัพธ์ก่อน–หลัง', 'Before & after')}</h2>
            <p style={subStyle}>
              {t(
                'เคสจริงจากหลายบริการ — ลากแถบกลางซ้าย–ขวาเพื่อเทียบก่อนและหลัง',
                'Real cases across services — drag the slider left & right to compare',
              )}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
              gap: 22,
            }}
          >
            {HOME_CASES.map((c) => {
              const { posPct, clip } = posOf(c.key);
              return (
                <div
                  key={c.key}
                  className="ba-card"
                  data-reveal=""
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,.07)',
                    borderRadius: 18,
                    overflow: 'hidden',
                    boxShadow: '0 12px 32px -24px rgba(0,0,0,.25)',
                  }}
                >
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
                      alt="after"
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
                      alt="before"
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
                        top: 10,
                        left: 10,
                        background: 'rgba(26,20,16,.6)',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '4px 11px',
                        borderRadius: 999,
                        pointerEvents: 'none',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {t('ก่อน', 'Before')}
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: '#FF7A00',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '4px 11px',
                        borderRadius: 999,
                        pointerEvents: 'none',
                      }}
                    >
                      {t('หลัง', 'After')}
                    </span>
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
                        width: 42,
                        height: 42,
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
                          fontSize: 13,
                          fontWeight: 900,
                          lineHeight: 1,
                        }}
                      >
                        ‹
                      </span>
                      <span
                        style={{
                          color: '#FF7A00',
                          fontSize: 13,
                          fontWeight: 900,
                          lineHeight: 1,
                        }}
                      >
                        ›
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '16px 18px 18px' }}>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: c.accent,
                        background: c.tint,
                        padding: '4px 11px',
                        borderRadius: 999,
                      }}
                    >
                      {tl(c.catLabel)}
                    </span>
                    <h3
                      style={{
                        fontFamily: "'Outfit','Anuphan',sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#1A1410',
                        margin: '12px 0 0',
                        lineHeight: 1.3,
                      }}
                    >
                      {tl(c.title)}
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 12,
                        paddingTop: 12,
                        borderTop: '1px solid rgba(0,0,0,.06)',
                        fontSize: 12,
                        color: 'rgba(61,53,46,.6)',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: c.accent,
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

          <div data-reveal="" style={{ textAlign: 'center', marginTop: 32 }}>
            <Link
              className="pcta"
              href="/reviews"
              style={{
                height: 50,
                padding: '0 26px',
                borderRadius: 14,
                background: '#fff',
                border: '1px solid rgba(0,0,0,.08)',
                color: '#1A1410',
                fontWeight: 700,
                fontSize: 15,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                boxShadow: '0 10px 26px -12px rgba(0,0,0,.22)',
                transition: '.2s',
              }}
            >
              {t('ดูเคสทั้งหมด', 'See all cases')}
              {ARROW_15}
            </Link>
          </div>

          <p
            data-reveal=""
            style={{
              fontSize: 12.5,
              color: 'rgba(61,53,46,.5)',
              margin: '24px auto 0',
              textAlign: 'center',
              maxWidth: 640,
              lineHeight: 1.6,
            }}
          >
            {t(
              '* ผลลัพธ์ขึ้นกับสภาพช่องปากของแต่ละบุคคล ภาพแสดงเฉพาะเคสที่ได้รับความยินยอม ตาม พ.ร.บ. สถานพยาบาล',
              '* Results vary by individual. Images shown only for consented cases, per Thai medical-advertising law.',
            )}
          </p>
        </div>

        {/* ===== REVIEWS ===== */}
        <div
          style={{ position: 'relative', zIndex: 1, padding: '64px 0 20px', overflow: 'hidden' }}
        >
          <div
            data-reveal=""
            style={{
              textAlign: 'center',
              maxWidth: 640,
              margin: '0 auto 34px',
              padding: '0 20px',
            }}
          >
            <div style={sectionKicker}>★ 4.9 / 5.0</div>
            <h2 style={h2Style}>{t('เสียงจากคนไข้ของเรา', 'What our patients say')}</h2>
            <p style={subStyle}>
              {t(
                'รีวิวจริงจากผู้เข้ารับบริการในแต่ละสาขา',
                'Real reviews from across our branches',
              )}
            </p>
          </div>

          <div
            className="marq"
            style={{
              position: 'relative',
              width: '100%',
              WebkitMaskImage:
                'linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)',
              maskImage: 'linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)',
            }}
          >
            <div
              className="marqt"
              style={{
                display: 'flex',
                gap: 20,
                width: 'max-content',
                padding: '8px 10px 20px',
                animation: 'marquee 46s linear infinite',
              }}
            >
              {REVIEWS_LOOP.map((r, i) => (
                <div
                  key={`${r.name.en}-${i}`}
                  style={{
                    flex: 'none',
                    width: 340,
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,.05)',
                    borderRadius: 20,
                    padding: 24,
                    boxShadow: '0 16px 40px -24px rgba(0,0,0,.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: '#FFF3E8',
                        color: '#FF7A00',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 17,
                      }}
                    >
                      {r.init}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: '#1A1410' }}>
                        {tl(r.name)}
                      </div>
                      <div style={{ fontSize: 12, color: '#FFB04D', letterSpacing: '1px' }}>
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: 'rgba(61,53,46,.74)',
                      margin: '14px 0 16px',
                      lineHeight: 1.6,
                    }}
                  >
                    {tl(r.txt)}
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: '#FF7A00',
                        background: '#FFF3E8',
                        padding: '4px 10px',
                        borderRadius: 999,
                      }}
                    >
                      {tl(r.svc)}
                    </span>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: 'rgba(61,53,46,.6)',
                        background: '#F4F1EC',
                        padding: '4px 10px',
                        borderRadius: 999,
                      }}
                    >
                      {tl(r.br)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal="" style={{ textAlign: 'center', marginTop: 30, padding: '0 20px' }}>
            <Link
              className="pcta"
              href="/reviews"
              style={{
                height: 50,
                padding: '0 26px',
                borderRadius: 14,
                background: '#fff',
                border: '1px solid rgba(0,0,0,.08)',
                color: '#1A1410',
                fontWeight: 700,
                fontSize: 15,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                boxShadow: '0 10px 26px -12px rgba(0,0,0,.22)',
                transition: '.2s',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#FFB04D" stroke="none">
                <path d="M12 2l2.95 6.6 7.05.62-5.3 4.7 1.55 6.98L12 17.7l-6.25 3.2L7.3 13.92 2 9.22l7.05-.62z" />
              </svg>
              {t('ดูผลลัพธ์ก่อน–หลัง', 'See before & after results')}
              {ARROW_15}
            </Link>
          </div>
        </div>

        {/* ===== BRANCHES ===== */}
        <div
          id="branches"
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '44px 20px 20px',
            scrollMarginTop: 100,
          }}
        >
          <div
            data-reveal=""
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 12,
              flexWrap: 'wrap',
              margin: '0 0 18px',
            }}
          >
            <h2
              style={{
                fontFamily: "'Outfit','Anuphan',sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(20px,2vw,24px)',
                color: '#1A1410',
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: track,
              }}
            >
              {t('ค้นหาสาขาใกล้คุณ', 'Find a branch near you')}
            </h2>
            <span style={{ fontSize: 14, color: 'rgba(61,53,46,.6)' }}>
              {t(
                '7 สาขา ทั่วกรุงเทพฯ และพัทยา เปิดบริการทุกวัน',
                '7 branches across Bangkok & Pattaya, open daily',
              )}
            </span>
          </div>

          <div
            data-reveal=""
            style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 16px' }}
          >
            <span
              style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF7A00' }}
            />
            <h3
              style={{
                fontFamily: "'Outfit','Anuphan',sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: '#1A1410',
                margin: 0,
              }}
            >
              {t('กรุงเทพมหานคร', 'Bangkok')}
            </h3>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: 18,
              marginBottom: 36,
            }}
          >
            {BRANCHES_BKK.map((b) => branchCard(b, false))}
          </div>

          <div
            data-reveal=""
            style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 16px' }}
          >
            <span
              style={{ width: 10, height: 10, borderRadius: '50%', background: '#1FA39B' }}
            />
            <h3
              style={{
                fontFamily: "'Outfit','Anuphan',sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: '#1A1410',
                margin: 0,
              }}
            >
              {t('ชลบุรี – พัทยา', 'Chonburi – Pattaya')}
            </h3>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: 18,
            }}
          >
            {BRANCHES_PTY.map((b) => branchCard(b, true))}
          </div>

          <div data-reveal="" style={{ textAlign: 'center', marginTop: 34 }}>
            <Link
              className="pcta"
              href="/branches"
              style={{
                height: 50,
                padding: '0 26px',
                borderRadius: 14,
                background: '#fff',
                border: '1px solid rgba(0,0,0,.08)',
                color: '#1A1410',
                fontWeight: 700,
                fontSize: 15,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                boxShadow: '0 10px 26px -12px rgba(0,0,0,.22)',
                transition: '.2s',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF7A00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {t('ดูทุกสาขา + แผนที่ Google Maps', 'All branches + Google Maps')}
              {ARROW_15}
            </Link>
          </div>
        </div>

        {/* ===== BLOG ===== */}
        <div
          id="blog"
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '64px 20px 20px',
            scrollMarginTop: 100,
          }}
        >
          <div
            data-reveal=""
            style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 36px' }}
          >
            <div style={sectionKicker}>{t('บทความ', 'Blog')}</div>
            <h2 style={h2Style}>{t('บทความสุขภาพฟัน', 'Dental health articles')}</h2>
            <p style={subStyle}>
              {t(
                'เคล็ดลับดูแลรอยยิ้มจากทีมทันตแพทย์',
                'Smile-care tips from our dentists',
              )}
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
              gap: 22,
            }}
          >
            {HOME_POSTS.map((p) => (
              <Link
                key={p.slug}
                className="post-card"
                href={`/articles/${p.slug}`}
                style={{
                  textDecoration: 'none',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.05)',
                  borderRadius: 22,
                  overflow: 'hidden',
                  boxShadow: '0 16px 40px -24px rgba(0,0,0,.2)',
                  display: 'block',
                }}
              >
                <div style={{ height: 184, overflow: 'hidden', background: '#F3EFEA' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(p.cover)}
                    alt={tl(p.title)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: '.45s',
                    }}
                  />
                </div>
                <div style={{ padding: '20px 22px 24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                      fontSize: 12,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: '#FF7A00',
                        background: '#FFF3E8',
                        padding: '4px 10px',
                        borderRadius: 999,
                      }}
                    >
                      {tl(p.cat)}
                    </span>
                    <span style={{ color: 'rgba(61,53,46,.5)' }}>{tl(p.date)}</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Outfit','Anuphan',sans-serif",
                      fontWeight: 700,
                      fontSize: 18.5,
                      color: '#1A1410',
                      margin: '14px 0 0',
                      lineHeight: 1.3,
                    }}
                  >
                    {tl(p.title)}
                  </h3>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      marginTop: 16,
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: '#F26C00',
                    }}
                  >
                    {t('อ่านต่อ', 'Read more')} {ARROW}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== CTA BAND ===== */}
        <div
          id="contact"
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '64px 20px 40px',
            scrollMarginTop: 100,
          }}
        >
          <div
            data-reveal=""
            style={{
              position: 'relative',
              borderRadius: 30,
              overflow: 'hidden',
              background: 'linear-gradient(135deg,#FF8A1A,#F26C00 55%,#E05F00)',
              padding: '54px 40px',
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl('assets/media/image1.webp')}
              alt=""
              style={{
                position: 'absolute',
                bottom: -30,
                right: 30,
                width: 200,
                opacity: 0.18,
                transform: 'rotate(-8deg)',
              }}
            />
            <div style={{ position: 'relative', maxWidth: 680 }}>
              <h2
                style={{
                  fontFamily: "'Outfit','Anuphan',sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(28px,3.8vw,42px)',
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.15,
                  letterSpacing: track,
                }}
              >
                {t('นัดปรึกษาฟรี ไม่มีค่าใช้จ่าย', 'Book a free consultation')}
              </h2>
              <p
                style={{
                  fontSize: 17,
                  color: 'rgba(255,255,255,.9)',
                  margin: '16px 0 28px',
                  maxWidth: 540,
                }}
              >
                {t(
                  'ทักไลน์หรือโทรหาสาขาที่สะดวก ทีมงานพร้อมดูแลคุณทุกวัน',
                  'Message or call the nearest branch — we are here every day.',
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
                    transition: '.2s',
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: '#06C755',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    {LINE_ICON(15)}
                  </span>
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
                    transition: '.2s',
                  }}
                >
                  {PHONE_ICON(18)}
                  {t('โทรเลย', 'Call now')} · {SITE.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />

        {/* ===== FLOATING CHAT DOCK ===== */}
        <div
          style={{
            position: 'fixed',
            bottom: 22,
            right: 22,
            zIndex: 55,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            alignItems: 'flex-end',
          }}
        >
          {chat && (
            <div
              style={{
                background: 'rgba(255,255,255,.96)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,.06)',
                borderRadius: 18,
                boxShadow: '0 20px 50px -16px rgba(0,0,0,.3)',
                padding: 14,
                width: 236,
              }}
            >
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#1A1410',
                  margin: '2px 4px 10px',
                }}
              >
                {t('ปรึกษาฟรีกับทีมงาน', 'Chat with our team')}
              </div>
              <a
                href={SITE.lineUrl}
                target="_blank"
                rel="noopener"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 10,
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: '#1A1410',
                  background: '#F6FBF7',
                }}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    background: '#06C755',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  {LINE_ICON(16)}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  {t('ทักไลน์ออฟฟิเชียล', 'Message us on LINE')}
                </span>
              </a>
              <a
                href={SITE.telUrl}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 10,
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: '#1A1410',
                  background: '#FFF7EF',
                  marginTop: 8,
                }}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    background: '#FF7A00',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  {PHONE_ICON(16)}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  {t('โทรหาเรา', 'Call us')}
                </span>
              </a>
            </div>
          )}

          <button
            onClick={() => setChat((c) => !c)}
            aria-label={t('ปรึกษาฟรีกับทีมงาน', 'Chat with our team')}
            style={{
              position: 'relative',
              width: 58,
              height: 58,
              borderRadius: '50%',
              border: 0,
              cursor: 'pointer',
              background: 'linear-gradient(160deg,#FF8A1A,#F26C00)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 14px 30px -8px rgba(255,122,0,.6)',
              animation: 'breathe 3.2s ease-in-out infinite',
            }}
          >
            <span
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid #FF7A00',
                animation: 'ring 2.6s ease-out infinite',
              }}
            />
            {LINE_ICON(26)}
          </button>
        </div>
      </div>
    </>
  );
}
