import type { MetadataRoute } from 'next';
import { prisma } from '../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://luxury-market.uz';
  const items: MetadataRoute.Sitemap = [
    { url: base + '/', changeFrequency: 'daily', priority: 1 },
    { url: base + '/lots', changeFrequency: 'daily', priority: 0.8 },
  ];
  try {
    const lots = await prisma.lot.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    });
    for (const l of lots) {
      items.push({
        url: base + '/lot/' + l.id,
        lastModified: l.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  } catch (e) {
    // baza ishlamasa ham asosiy sahifalar qaytadi
  }
  return items;
}
