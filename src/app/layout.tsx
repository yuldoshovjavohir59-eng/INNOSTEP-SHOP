import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'INNOSTEP Shop — Premium Mahsulotlar',
    template: '%s | INNOSTEP Shop',
  },
  description: "O'zbekistondagi eng sifatli mahsulotlar katalogi. Elektronika, maishiy texnika, va boshqa tovarlar eng qulay narxlarda.",
  keywords: ['innostep', 'shop', 'mahsulot', 'lot', 'elektron', 'smartphone', 'uzbekistan', 'online shop'],
  authors: [{ name: 'INNOSTEP' }],
  creator: 'INNOSTEP',
  publisher: 'INNOSTEP',
  metadataBase: new URL('https://innostep-shop.vercel.app'),
  verification: {
    google: 'izfNqenMxc_YfhCb3axvr8Klx7upQ6WZvUnkZ2e1Qfs',
  },
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: 'https://innostep-shop.vercel.app',
    siteName: 'INNOSTEP Shop',
    title: 'INNOSTEP Shop — Premium Mahsulotlar',
    description: "O'zbekistondagi eng sifatli mahsulotlar katalogi.",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'INNOSTEP Shop' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INNOSTEP Shop — Premium Mahsulotlar',
    description: "O'zbekistondagi eng sifatli mahsulotlar katalogi.",
    images: ['/og-image.png'],
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
