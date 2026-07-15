import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/lang';
import { SITE } from '@/content/site';
import { mediaUrl } from '@/lib/media';
import './globals.css';

const TITLE = 'Orange Smile Dental — คลินิกทันตกรรมครบวงจร 8 สาขา กรุงเทพฯ–พัทยา';
const DESCRIPTION =
  'กลุ่มคลินิกทันตกรรมครบวงจร ดูแลโดยทีมทันตแพทย์เฉพาะทางกว่า 100 ท่าน ใกล้บ้านคุณทั้งกรุงเทพฯ และพัทยา';

export const metadata: Metadata = {
  // Without this, canonical and og:image resolve against the deployment URL and
  // Google indexes the *.vercel.app copy instead of the real domain.
  metadataBase: new URL(SITE.url),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  // The logo lives in Supabase Storage; /media only exists on a dev machine.
  icons: { icon: mediaUrl('assets/media/image4.webp') },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'th_TH',
    url: SITE.url,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: mediaUrl('assets/hero/home-hero-cover-2x.webp'), width: 2400, height: 1015 }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        {/* Loaded as plain <link> rather than next/font: the ported inline styles
            name these families literally (e.g. font-family:'Outfit','Anuphan',…). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Anuphan:wght@500;600;700;800&family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
