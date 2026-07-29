'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from './nav';

export function AdminNav({ counts }: { counts: Record<string, number> }) {
  const pathname = usePathname();

  // `/admin` would otherwise light up on every page, since every admin path
  // starts with it. Only the section roots get prefix matching.
  const isCurrent = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <>
      {NAV.map((group) => (
        <div key={group.title} style={{ display: 'contents' }}>
          <div className="a-navgroup">{group.title}</div>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="a-nav"
              aria-current={isCurrent(item.href) ? 'page' : undefined}
            >
              {item.label}
              {item.count !== undefined && counts[item.count] !== undefined && (
                <b>{counts[item.count]}</b>
              )}
            </Link>
          ))}
        </div>
      ))}
    </>
  );
}
