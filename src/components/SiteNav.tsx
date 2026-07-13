'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/lang';
import { mediaUrl } from '@/lib/media';

export type NavKey = 'home' | 'services' | 'doctors' | 'branches' | 'reviews' | 'articles';

export function SiteNav({ active }: { active: NavKey }) {
  const { t, setTH, setEN, isTH } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items: { key: NavKey; href: string; label: string }[] = [
    { key: 'home', href: '/', label: t('หน้าแรก', 'Home') },
    { key: 'services', href: '/services', label: t('บริการ', 'Services') },
    { key: 'doctors', href: '/doctors', label: t('ทีมทันตแพทย์', 'Dentists') },
    { key: 'branches', href: '/branches', label: t('สาขา', 'Branches') },
    { key: 'reviews', href: '/reviews', label: t('ผลลัพธ์', 'Results') },
    { key: 'articles', href: '/articles', label: t('บทความ', 'Articles') },
  ];

  const ctaLine = t('ทักไลน์ปรึกษาฟรี', 'Free LINE consult');
  const toggleMenu = () => setMenu((m) => !m);

  return (
    <>
      <div
        className="osd-navwrap"
        style={{
          position: 'fixed',
          top: 18,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 16px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1200,
            height: scrolled ? '50px' : '58px',
            borderRadius: 18,
            pointerEvents: 'auto',
            background: scrolled ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.74)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,.7)',
            boxShadow:
              '0 8px 30px -10px rgba(255,122,0,.20),inset 0 1px 2px rgba(255,255,255,.9)',
            transition: 'height .3s ease,background .3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            padding: '0 14px 0 16px',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              flex: 'none',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl('assets/media/image4.webp')}
              alt="Orange Smile"
              style={{ width: 38, height: 38, objectFit: 'contain' }}
            />
            <span
              style={{
                fontFamily: "'Outfit','Anuphan',sans-serif",
                fontWeight: 800,
                fontSize: 20,
                color: '#1A1410',
                letterSpacing: '-.5px',
                whiteSpace: 'nowrap',
              }}
            >
              Orange Smile
            </span>
          </Link>

          <div
            className="osd-navlinks"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {items.map((it) => {
              const on = it.key === active;
              return (
                <Link
                  key={it.key}
                  className="osd-navlink"
                  href={it.href}
                  style={{
                    color: on ? '#F26C00' : 'rgba(61,53,46,.72)',
                    fontWeight: on ? 700 : 500,
                    textDecoration: 'none',
                    position: 'relative',
                    paddingBottom: 4,
                    borderBottom: `2px solid ${on ? '#FF7A00' : 'transparent'}`,
                    transition: 'color .2s',
                  }}
                >
                  {it.label}
                </Link>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,243,232,.7)',
                border: '1px solid rgba(255,122,0,.15)',
                borderRadius: 999,
                padding: 3,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <button
                onClick={() => {
                  setTH();
                  setMenu(false);
                }}
                style={{
                  border: 0,
                  cursor: 'pointer',
                  borderRadius: 999,
                  padding: '5px 11px',
                  font: 'inherit',
                  fontWeight: 700,
                  transition: '.2s',
                  background: isTH ? '#fff' : 'transparent',
                  color: isTH ? '#FF7A00' : 'rgba(61,53,46,.6)',
                }}
              >
                TH
              </button>
              <button
                onClick={() => {
                  setEN();
                  setMenu(false);
                }}
                style={{
                  border: 0,
                  cursor: 'pointer',
                  borderRadius: 999,
                  padding: '5px 11px',
                  font: 'inherit',
                  fontWeight: 700,
                  transition: '.2s',
                  background: !isTH ? '#fff' : 'transparent',
                  color: !isTH ? '#FF7A00' : 'rgba(61,53,46,.6)',
                }}
              >
                EN
              </button>
            </div>

            <a
              className="osd-cta"
              href="https://line.me"
              target="_blank"
              rel="noopener"
              style={{
                height: 38,
                padding: '0 16px',
                borderRadius: 12,
                background: 'linear-gradient(180deg,#FF8A1A,#F26C00)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                textDecoration: 'none',
                boxShadow:
                  'inset 0 2px 3px rgba(255,255,255,.35),0 8px 20px -6px rgba(255,122,0,.55)',
                transition: 'transform .2s',
                whiteSpace: 'nowrap',
              }}
            >
              {ctaLine}
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
            </a>

            <button
              className="osd-burger"
              onClick={toggleMenu}
              aria-label="Menu"
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                border: '1px solid rgba(0,0,0,.08)',
                background: '#fff',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1A1410',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className="osd-drawer"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          pointerEvents: menu ? 'auto' : 'none',
          opacity: menu ? 1 : 0,
          transition: 'opacity .3s',
        }}
      >
        <div
          onClick={toggleMenu}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(26,20,16,.35)',
            backdropFilter: 'blur(2px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: 288,
            background: 'rgba(255,255,255,.97)',
            backdropFilter: 'blur(40px)',
            borderLeft: '1px solid rgba(0,0,0,.08)',
            boxShadow: '-20px 0 60px -20px rgba(0,0,0,.25)',
            transform: `translateX(${menu ? '0' : '100%'})`,
            transition: 'transform .35s cubic-bezier(.16,1,.3,1)',
            padding: '84px 22px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {items.map((it) => {
            const on = it.key === active;
            return (
              <Link
                key={it.key}
                href={it.href}
                onClick={() => setMenu(false)}
                style={{
                  padding: '13px 12px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: on ? '#F26C00' : '#3D352E',
                  fontWeight: 600,
                  background: on ? '#FFF3E8' : 'transparent',
                }}
              >
                {it.label}
              </Link>
            );
          })}
          <a
            className="osd-cta"
            href="https://line.me"
            target="_blank"
            rel="noopener"
            style={{
              marginTop: 14,
              height: 46,
              borderRadius: 13,
              background: 'linear-gradient(180deg,#FF8A1A,#F26C00)',
              color: '#fff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              textDecoration: 'none',
            }}
          >
            {ctaLine}
          </a>
        </div>
      </div>
    </>
  );
}
