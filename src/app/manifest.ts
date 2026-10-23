import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LUXURY MARKET',
    short_name: 'LUXURY MARKET',
    description: 'Maishiy kimyo, gigiena mahsulotlari va ofis buyumlari — sifatli narxlarda.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0c0c18',
    theme_color: '#0c0c18',
    lang: 'uz',
    icons: [
      { src: '/pwa-icon?size=192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/pwa-icon?size=512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/pwa-icon?size=512&maskable=1', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
