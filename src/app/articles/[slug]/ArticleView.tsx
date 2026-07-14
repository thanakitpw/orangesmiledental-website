'use client';

import Link from 'next/link';
import { PageStyles } from '@/components/PageStyles';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { useLang } from '@/lib/lang';
import { mediaUrl } from '@/lib/media';
import { formatDate, type Post } from '@/lib/articles';
import { ARTICLE_CHIPS } from '@/content/articles';
import { SITE } from '@/content/site';

const CAT_LABEL = Object.fromEntries(ARTICLE_CHIPS.map((c) => [c.key, c.label]));

const CSS = `
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{margin:0;background:#fff;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
  ::selection{background:#FFD9B8;color:#1A1410}
  .post-card{transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s}
  .post-card:hover{transform:translateY(-5px);box-shadow:0 26px 54px -24px rgba(0,0,0,.26)!important}
  .post-card:hover .pc-img{transform:scale(1.06)}
  .pcta{transition:transform .2s}
  .pcta:hover{transform:translateY(-2px)}

  /* The article body is the one place on this site with flowing prose rather than
     hand-placed inline styles, so it gets a stylesheet of its own. */
  .osd-prose{font-size:17px;line-height:1.78;color:#3D352E}
  .osd-prose h2{font-family:'Outfit','Anuphan',sans-serif;font-weight:800;font-size:26px;line-height:1.3;color:#1A1410;margin:44px 0 0}
  .osd-prose h3{font-family:'Outfit','Anuphan',sans-serif;font-weight:700;font-size:20px;line-height:1.35;color:#1A1410;margin:32px 0 0}
  .osd-prose p{margin:16px 0 0}
  .osd-prose ul,.osd-prose ol{margin:16px 0 0;padding-left:24px}
  .osd-prose li{margin:8px 0 0}
  .osd-prose li::marker{color:#FF7A00}
  .osd-prose strong{color:#1A1410;font-weight:700}
  .osd-prose a{color:#F26C00;font-weight:600;text-decoration:none;border-bottom:1.5px solid rgba(255,122,0,.35)}
  .osd-prose a:hover{border-bottom-color:#FF7A00}
  .osd-prose blockquote{margin:24px 0 0;padding:2px 0 2px 18px;border-left:3px solid #FFB04D;color:rgba(61,53,46,.8)}
  .osd-prose h2:first-child,.osd-prose p:first-child{margin-top:0}
  @media(max-width:640px){.osd-prose{font-size:16px}.osd-prose h2{font-size:22px}.osd-prose h3{font-size:18.5px}}
`;

export function ArticleView({ post, related }: { post: Post; related: Post[] }) {
  const { t, tl, track, isTH } = useLang();
  const body = isTH ? post.th : post.en;

  // The licence is shown when the clinic gave us one, and simply omitted when they
  // did not. Never invent one: a Thai dental licence is publicly checkable against
  // the Dental Council register, so a wrong number is a lie anyone can catch.
  const license = post.reviewer?.license ? ` (${post.reviewer.license})` : '';

  // Only one of these three lines can be true of any given article, and the reader is
  // entitled to know which. A team sign-off is not a named dentist, and neither is
  // nothing at all — so they do not get to share a sentence.
  const reviewLine = !post.reviewer
    ? t('ยังไม่ผ่านการตรวจทานโดยทันตแพทย์', 'Not yet reviewed by a dentist')
    : post.reviewer.kind === 'organization'
      ? t(
          `ตรวจทานโดยทีมทันตแพทย์ ${post.reviewer.name}`,
          `Reviewed by the ${post.reviewer.name} dental team`,
        )
      : t(
          `ตรวจทานทางการแพทย์โดย ${post.reviewer.name}${license}`,
          `Medically reviewed by ${post.reviewer.name}${license}`,
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
        <SiteNav active="articles" />

        <article style={{ maxWidth: 760, margin: '0 auto', padding: '132px 20px 0' }}>
          <Link
            href="/articles"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 13.5,
              fontWeight: 600,
              color: 'rgba(61,53,46,.6)',
              textDecoration: 'none',
            }}
          >
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
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            {t('กลับไปหน้าบทความ', 'Back to articles')}
          </Link>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12.5, marginTop: 22 }}>
            <span
              style={{
                fontWeight: 700,
                color: '#F26C00',
                background: '#FFF3E8',
                padding: '4px 11px',
                borderRadius: 999,
              }}
            >
              {tl(CAT_LABEL[post.category])}
            </span>
            <span style={{ color: 'rgba(61,53,46,.5)' }}>
              {tl(formatDate(post.publishedAt))} ·{' '}
              {t(`อ่าน ${body.readingMinutes} นาที`, `${body.readingMinutes} min read`)}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Outfit','Anuphan',sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(30px,4.2vw,46px)',
              color: '#1A1410',
              margin: '16px 0 0',
              lineHeight: 1.16,
              letterSpacing: track,
            }}
          >
            {body.title}
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(61,53,46,.64)', margin: '18px 0 0', lineHeight: 1.62 }}>
            {body.excerpt}
          </p>

          {/* Byline. The clinic is the author; a dentist has not signed this off yet and
              the page says so rather than leaving the reader to assume otherwise. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '26px 0 0',
              paddingTop: 22,
              borderTop: '1px solid rgba(0,0,0,.07)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl('assets/media/image4.webp')}
              alt={post.authorName}
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                objectFit: 'contain',
                background: '#FFF3E8',
                flex: 'none',
              }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410' }}>
                {t(`ทีมงาน ${post.authorName}`, `The ${post.authorName} team`)}
              </div>
              <div style={{ fontSize: 12.5, color: 'rgba(61,53,46,.55)' }}>{reviewLine}</div>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              aspectRatio: '1000/680',
              borderRadius: 22,
              overflow: 'hidden',
              background: '#F3EFEA',
              margin: '28px 0 0',
              boxShadow: '0 22px 54px -30px rgba(0,0,0,.3)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(post.cover)}
              alt={body.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div
            className="osd-prose"
            style={{ margin: '34px 0 0' }}
            dangerouslySetInnerHTML={{ __html: body.html }}
          />

          {body.faq.length > 0 && (
            <section style={{ margin: '52px 0 0' }}>
              <h2
                style={{
                  fontFamily: "'Outfit','Anuphan',sans-serif",
                  fontWeight: 800,
                  fontSize: 26,
                  color: '#1A1410',
                  margin: 0,
                  letterSpacing: track,
                }}
              >
                {t('คำถามที่พบบ่อย', 'Frequently asked questions')}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
                {body.faq.map((f) => (
                  <details
                    key={f.q}
                    style={{
                      background: '#FFFAF5',
                      border: '1px solid rgba(255,122,0,.14)',
                      borderRadius: 16,
                      padding: '16px 20px',
                    }}
                  >
                    <summary
                      style={{
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: 15.5,
                        color: '#1A1410',
                        listStyle: 'none',
                      }}
                    >
                      {f.q}
                    </summary>
                    <p
                      style={{
                        margin: '12px 0 0',
                        fontSize: 15,
                        lineHeight: 1.72,
                        color: 'rgba(61,53,46,.78)',
                      }}
                    >
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Medical disclaimer. Non-negotiable on health content that no clinician has
              signed off, and useful even once one has. */}
          <div
            style={{
              margin: '44px 0 0',
              padding: '18px 20px',
              background: '#F7F5F3',
              border: '1px solid rgba(0,0,0,.06)',
              borderRadius: 14,
              fontSize: 13.5,
              lineHeight: 1.68,
              color: 'rgba(61,53,46,.72)',
            }}
          >
            <strong style={{ color: '#1A1410' }}>{t('ข้อควรทราบ', 'Please note')}</strong>{' '}
            {t(
              'บทความนี้เป็นข้อมูลทั่วไปเพื่อการศึกษา ไม่ใช่การวินิจฉัยหรือคำแนะนำการรักษาเฉพาะบุคคล อาการและแนวทางรักษาของแต่ละคนแตกต่างกัน กรุณาเข้ารับการตรวจประเมินจากทันตแพทย์ก่อนตัดสินใจรักษาเสมอ',
              'This article is general educational information, not a diagnosis or personal treatment advice. Symptoms and treatment plans differ from person to person — always have a dentist examine you before deciding on treatment.',
            )}
          </div>

          <a
            className="pcta"
            href={SITE.lineUrl}
            target="_blank"
            rel="noopener"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
              margin: '30px 0 0',
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(180deg,#FF8A1A,#F26C00)',
              color: '#fff',
              fontSize: 15.5,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: 'inset 0 2px 3px rgba(255,255,255,.3),0 14px 30px -12px rgba(255,122,0,.6)',
            }}
          >
            {t('ปรึกษาทันตแพทย์ฟรีทางไลน์', 'Ask a dentist free on LINE')}
          </a>
        </article>

        {related.length > 0 && (
          <section style={{ maxWidth: 1240, margin: '0 auto', padding: '72px 20px 40px' }}>
            <h2
              style={{
                fontFamily: "'Outfit','Anuphan',sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(24px,3vw,32px)',
                color: '#1A1410',
                margin: 0,
                textAlign: 'center',
                letterSpacing: track,
              }}
            >
              {t('บทความอื่นที่น่าสนใจ', 'More to read')}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
                gap: 24,
                marginTop: 32,
              }}
            >
              {related.map((p) => (
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
                  <div style={{ position: 'relative', height: 176, overflow: 'hidden', background: '#F3EFEA' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="pc-img"
                      src={mediaUrl(p.cover)}
                      alt={tl(p.title)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .45s' }}
                    />
                  </div>
                  <div style={{ padding: '18px 20px 22px' }}>
                    <div style={{ fontSize: 12, color: 'rgba(61,53,46,.5)' }}>
                      {tl(CAT_LABEL[p.category])} · {tl(formatDate(p.publishedAt))}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Outfit','Anuphan',sans-serif",
                        fontWeight: 700,
                        fontSize: 17.5,
                        color: '#1A1410',
                        margin: '9px 0 0',
                        lineHeight: 1.32,
                      }}
                    >
                      {tl(p.title)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <SiteFooter />
      </div>
    </>
  );
}
