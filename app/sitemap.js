import { site } from '@/lib/site';
import { getArticles } from '@/lib/articles';
import { getEvenements } from '@/lib/evenements';

const PAGES = [
  '',
  '/talents',
  '/independants',
  '/entreprises',
  '/entreprises/demande-de-demo',
  '/tarifs',
  '/formations-mentorat',
  '/job-dating',
  '/verification',
  '/a-propos',
  '/ressources',
  '/faq',
  '/contact',
  '/mentions-legales',
  '/cgu',
  '/confidentialite',
];

/** Plan du site pour les moteurs de recherche : /sitemap.xml */
export default function sitemap() {
  const maintenant = new Date();
  return [
    ...PAGES.map((chemin) => ({ url: `${site.url}${chemin}`, lastModified: maintenant, changeFrequency: chemin === '' ? 'daily' : 'monthly', priority: chemin === '' ? 1 : 0.7 })),
    ...getArticles().map((a) => ({ url: `${site.url}/ressources/${a.slug}`, lastModified: new Date(a.date), changeFrequency: 'yearly', priority: 0.6 })),
    ...getEvenements().map((e) => ({ url: `${site.url}/job-dating/${e.slug}`, lastModified: maintenant, changeFrequency: 'weekly', priority: 0.6 })),
  ];
}
