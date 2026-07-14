'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PageStyles } from '@/components/PageStyles';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { useLang } from '@/lib/lang';
import { useReveal, revealNewlyMounted } from '@/lib/reveal';
import { mediaUrl } from '@/lib/media';
import { ARTICLE_CHIPS, type ArticleCat } from '@/content/articles';
import { SITE } from '@/content/site';
import { formatDate, type Post } from '@/lib/articles';

const CAT_LABEL = Object.fromEntries(ARTICLE_CHIPS.map((c) => [c.key, c.label]));

const readTime = (minutes: number) => ({
  th: `อ่าน ${minutes} นาที`,
  en: `${minutes} min read`,
});

const CSS = `
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{margin:0;background:#fff;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
  ::selection{background:#FFD9B8;color:#1A1410}
  [data-reveal]{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
  [data-reveal][data-in]{opacity:1;transform:none}
  .post-card{transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s}
  .post-card:hover{transform:translateY(-5px);box-shadow:0 26px 54px -24px rgba(0,0,0,.26)!important}
  .post-card:hover .pc-img{transform:scale(1.06)}
  .feat:hover .feat-img{transform:scale(1.04)}
  .chip{cursor:pointer;transition:.2s;user-select:none}
  .pcta{transition:transform .2s}
  .pcta:hover{transform:translateY(-2px)}
  @media (prefers-reduced-motion:reduce){[data-reveal]{opacity:1;transform:none}}
`;

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

const ARROW_14 = (
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

type ChipKey = ArticleCat | 'all';

export function ArticlesIndex({ posts }: { posts: Post[] }) {
  const { t, tl, track } = useLang();
  const [cat, setCat] = useState<ChipKey>('all');
  useReveal(0.94, 1600);

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);
  const shown = cat === 'all' ? rest : rest.filter((p) => p.category === cat);

  const readMore = t('อ่านต่อ', 'Read more');

  const pickCat = (key: ChipKey) => () => {
    setCat(key);
    revealNewlyMounted();
  };

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
        <SiteNav active="articles" />

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
              {t('บทความสุขภาพฟัน', 'Dental health blog')}
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
              {t('ความรู้ดี ๆ เพื่อรอยยิ้มของคุณ', 'Smart tips for a healthier smile')}
            </h1>
            <p style={{ fontSize: 17.5, color: 'rgba(61,53,46,.64)', margin: '18px 0 0' }}>
              {/* The design claimed these were "written by our own dental team". They are
                  not — they are drafted by the clinic's content team and are awaiting a
                  dentist's review, so the line says what is actually true. */}
              {t(
                'เคล็ดลับดูแลสุขภาพช่องปากและความรู้เรื่องทันตกรรม เรียบเรียงโดยทีมงาน Orange Smile Dental',
                'Oral-health tips and dentistry know-how, compiled by the Orange Smile Dental team.',
              )}
            </p>
          </div>
        </div>

        {/* ===== FEATURED ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '40px 20px 0',
          }}
        >
          {featured && (
          <Link
            className="feat"
            data-reveal=""
            href={`/articles/${featured.slug}`}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))',
              gap: 0,
              background: '#fff',
              border: '1px solid rgba(0,0,0,.05)',
              borderRadius: 26,
              overflow: 'hidden',
              boxShadow: '0 22px 54px -28px rgba(0,0,0,.26)',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                position: 'relative',
                minHeight: 300,
                overflow: 'hidden',
                background: '#F3EFEA',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="feat-img"
                src={mediaUrl(featured.cover)}
                alt={tl(featured.title)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform .5s',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  background: '#FF7A00',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 14px',
                  borderRadius: 999,
                }}
              >
                {t('บทความแนะนำ', 'Featured')}
              </span>
            </div>
            <div
              style={{
                padding: '38px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  fontSize: 12.5,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    color: '#F26C00',
                    background: '#FFF3E8',
                    padding: '4px 11px',
                    borderRadius: 999,
                  }}
                >
                  {tl(CAT_LABEL[featured.category])}
                </span>
                <span style={{ color: 'rgba(61,53,46,.5)' }}>
                  {tl(formatDate(featured.publishedAt))} · {tl(readTime(featured.th.readingMinutes))}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Outfit','Anuphan',sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(22px,2.6vw,30px)',
                  color: '#1A1410',
                  margin: '16px 0 0',
                  lineHeight: 1.25,
                  letterSpacing: track,
                }}
              >
                {tl(featured.title)}
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: 'rgba(61,53,46,.66)',
                  margin: '14px 0 0',
                  lineHeight: 1.62,
                }}
              >
                {tl(featured.excerpt)}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  marginTop: 22,
                }}
              >
                {/* The design put an individual dentist's face and title here. These pieces
                    are written by the clinic's team and signed off by it, not by one named
                    dentist, so the byline is the clinic — logo and all. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl('assets/media/image4.webp')}
                  alt={featured.authorName}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    objectFit: 'contain',
                    background: '#FFF3E8',
                  }}
                />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1A1410' }}>
                    {t(`ทีมงาน ${featured.authorName}`, `The ${featured.authorName} team`)}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(61,53,46,.55)' }}>
                    {featured.medicallyReviewed
                      ? t('ตรวจทานโดยทีมทันตแพทย์', 'Reviewed by our dental team')
                      : t('ข้อมูลทั่วไป ไม่ใช่การวินิจฉัย', 'General information, not a diagnosis')}
                  </div>
                </div>
                <span
                  style={{
                    marginLeft: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#F26C00',
                  }}
                >
                  {readMore} {ARROW_15}
                </span>
              </div>
            </div>
          </Link>
          )}
        </div>

        {/* ===== FILTER ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '36px 20px 0',
          }}
        >
          <div
            data-reveal=""
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'center',
            }}
          >
            {ARTICLE_CHIPS.map((c) => {
              const on = c.key === cat;
              return (
                <button
                  key={c.key}
                  className="chip"
                  onClick={pickCat(c.key)}
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
                  {tl(c.label)}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== GRID ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '30px 20px 20px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))',
              gap: 24,
            }}
          >
            {shown.map((p) => (
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
                  boxShadow: '0 16px 42px -26px rgba(0,0,0,.22)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    height: 188,
                    overflow: 'hidden',
                    background: '#F3EFEA',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="pc-img"
                    src={mediaUrl(p.cover)}
                    alt={tl(p.title)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform .45s',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 13,
                      left: 13,
                      background: 'rgba(255,255,255,.92)',
                      backdropFilter: 'blur(8px)',
                      color: '#F26C00',
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: '5px 11px',
                      borderRadius: 999,
                    }}
                  >
                    {tl(CAT_LABEL[p.category])}
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
                  <div style={{ fontSize: 12, color: 'rgba(61,53,46,.5)' }}>
                    {tl(formatDate(p.publishedAt))} · {tl(readTime(p.th.readingMinutes))}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Outfit','Anuphan',sans-serif",
                      fontWeight: 700,
                      fontSize: 18,
                      color: '#1A1410',
                      margin: '9px 0 0',
                      lineHeight: 1.32,
                    }}
                  >
                    {tl(p.title)}
                  </h3>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: 'rgba(61,53,46,.62)',
                      margin: '11px 0 0',
                      lineHeight: 1.58,
                      flex: 1,
                    }}
                  >
                    {tl(p.excerpt)}
                  </p>
                  <span
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
                    {readMore} {ARROW_14}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== NEWSLETTER / CTA ===== */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            padding: '46px 20px 50px',
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
                {t('มีคำถามเรื่องสุขภาพฟัน?', 'Questions about your teeth?')}
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
                  'ไม่ต้องรอจนปวด ทักไลน์ปรึกษาทีมทันตแพทย์ของเราได้ฟรี ทุกวัน',
                  'Don’t wait for pain — chat with our dentists for free on LINE, any day.',
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
                  href="/doctors"
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
                  {t('พบทีมทันตแพทย์', 'Meet the team')}
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
