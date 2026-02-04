import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://taylorswift.com';
  const pages = [
    { path: '/', priority: 1, changeFreq: 'daily' as const },
    { path: '/tour', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/noticias', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/discography', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/videos', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/dvds', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/historia', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/formaciones', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/miembros', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/entrevistas', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/faq', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/terminos', priority: 0.6, changeFreq: 'yearly' as const },
    { path: '/privacidad', priority: 0.6, changeFreq: 'yearly' as const },
    { path: '/contacto', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/songs', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/shows', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/bootlegs', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/discography/reviews', priority: 0.9, changeFreq: 'weekly' as const },
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Agregar páginas principales
  pages.forEach(page => {
    sitemap.push({
      url: `${base}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
    });
  });

  return sitemap;
}
