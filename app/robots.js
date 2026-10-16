import { site } from '@/lib/site';

/** /robots.txt : tout le site est indexable, sauf l'API des formulaires et la plateforme. */
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/plateforme'] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
