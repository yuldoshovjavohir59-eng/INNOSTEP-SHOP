import { ImageResponse } from 'next/og';

export const alt = 'LUXURY MARKET';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b0b17 0%, #1b1840 100%)', color: '#ffffff',
        }}
      >
        <svg width="150" height="124" viewBox="0 0 150 124">
          <path d="M10 100 L0 30 L40 62 L75 8 L110 62 L150 30 L140 100 Z" fill="#f5c842" />
          <rect x="10" y="106" width="130" height="14" rx="5" fill="#f5c842" />
        </svg>
        <div style={{ display: 'flex', fontSize: 92, fontWeight: 800, letterSpacing: 4, marginTop: 28 }}>LUXURY MARKET</div>
        <div style={{ display: 'flex', fontSize: 34, color: '#b7b4d9', marginTop: 18 }}>Sifatli mahsulotlar eng qulay narxda</div>
        <div style={{ display: 'flex', fontSize: 26, color: '#f5c842', marginTop: 44 }}>luxury-market.uz</div>
      </div>
    ),
    { width: size.width, height: size.height }
  );
}
