import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://innostep-shop.vercel.app';
  
  try {
    const res = await fetch(`${baseUrl}/api/lots`);
    const lots = await res.json();
    const lotUrls = lots.map((lot: any) => ({
      url: `${baseUrl}/lot/${lot.id}`,
      lastModified: new Date(lot.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
      { url: `${baseUrl}/lots`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      ...lotUrls,
    ];
  } catch {
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
      { url: `${baseUrl}/lots`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ];
  }
}
