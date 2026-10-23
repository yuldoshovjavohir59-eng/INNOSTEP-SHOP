import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const size = sp.get('size') === '192' ? 192 : 512;
  const maskable = sp.get('maskable') === '1';
  const crown = Math.round(size * (maskable ? 0.5 : 0.62));
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1530, #0c0c18)' }}>
        <svg width={crown} height={crown} viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37" strokeWidth="1" strokeLinejoin="round">
          <path d="M2.5 18.5 L1.5 7 L7 11.5 L12 4 L17 11.5 L22.5 7 L21.5 18.5 Z" />
          <rect x="3" y="19.5" width="18" height="2" rx="1" />
        </svg>
      </div>
    ),
    { width: size, height: size }
  );
}
