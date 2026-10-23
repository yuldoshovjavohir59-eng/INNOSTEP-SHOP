import type { Metadata } from 'next';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const lot: any = await prisma.lot.findUnique({ where: { id: params.id } });
    if (lot === null || lot.isActive === false) return {};
    const name = String(lot.name || lot.title || 'Mahsulot');
    const title = name + ' — LUXURY MARKET';
    const nf = new Intl.NumberFormat('ru-RU');
    const price = typeof lot.price === 'number' ? nf.format(lot.price) + " so'm" : '';
    const desc = lot.description ? String(lot.description).replace(/\s+/g, ' ').slice(0, 140) : '';
    const fallback = 'LUXURY MARKET — sifatli mahsulotlar eng qulay narxda';
    const description = [price, desc].filter(Boolean).join(' · ') || fallback;
    const first = Array.isArray(lot.images) ? lot.images[0] : undefined;
    const ok = typeof first === 'string' && first.indexOf('http') === 0;
    const images = ok ? [first] : undefined;
    const url = '/lot/' + params.id;
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, url, type: 'website', siteName: 'LUXURY MARKET', images },
      twitter: { card: ok ? 'summary_large_image' : 'summary', title, description, images },
    };
  } catch (e) {
    return {};
  }
}

export default function LotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
