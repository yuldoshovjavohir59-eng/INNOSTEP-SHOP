import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://luxury-market.uz';
  return [
    { url: base + '/', changeFrequency: 'daily', priority: 1 },
    { url: base + '/lots', changeFrequency: 'daily', priority: 0.8 },
  ];
}
