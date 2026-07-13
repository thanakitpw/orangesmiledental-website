import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/lang';
import './globals.css';

export const metadata: Metadata = {
  title: 'Orange Smile Dental — คลินิกทันตกรรมครบวงจร 7 สาขา กรุงเทพฯ–พัทยา',
  description:
    'กลุ่มคลินิกทันตกรรมครบวงจร ดูแลโดยทีมทันตแพทย์เฉพาะทางกว่า 20 ท่าน ใกล้บ้านคุณทั้งกรุงเทพฯ และพัทยา',
  icons: { icon: '/media/assets/media/image4.webp' },
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
