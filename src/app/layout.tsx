import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'LUXURY MARKET — Premium Mahsulotlar',
    template: '%s | LUXURY MARKET',
  },
  description: "Maishiy kimyo, gigiena mahsulotlari va ofis buyumlari — sifatli va hamyonbop narxlarda. Toshkent shahri ichida bepul yetkazib berish.",
  keywords: ['luxury market', 'maishiy kimyo', 'gigiena', 'ofis buyumlari', 'ulgurji', 'Toshkent', 'Ozbekiston', 'cooperation', 'xarid uzex'],
  authors: [{ name: 'LUXURY MARKET' }],
  creator: 'LUXURY MARKET',
  publisher: 'LUXURY MARKET',
  metadataBase: new URL('https://luxury-market.uz'),
  verification: {
    google: 'izfNqenMxc_YfhCb3axvr8Klx7upQ6WZvUnkZ2e1Qfs',
  },
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: 'https://luxury-market.uz',
    siteName: 'LUXURY MARKET',
    title: 'LUXURY MARKET — Premium Mahsulotlar',
    description: "Maishiy kimyo, gigiena va ofis buyumlari — sifatli, qulay narxlarda.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUXURY MARKET — Premium Mahsulotlar',
    description: "Maishiy kimyo, gigiena va ofis buyumlari — sifatli, qulay narxlarda.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="noise-bg">{children}</body>
    </html>
  );
}
