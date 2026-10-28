import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ressources } from '@/content/fr/aide';
import { getArticle, getArticles } from '@/lib/articles';
import { dateLongue } from '@/lib/format';
import { lienInscription } from '@/lib/liens';
import { choisirCampagne } from '@/lib/publicites';
import Bouton from '@/components/ui/Bouton';
import BandeNewsletter from '@/components/blocs/BandeNewsletter';
import BannierePub from '@/components/blocs/BannierePub';

// Bannière publicitaire rafraîchie toutes les heures (début et fin des campagnes).
export const revalidate = 3600;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.titre,
    description: a.resume,
    alternates: { canonical: `/ressources/${a.slug}` },
    openGraph: { type: 'article', title: a.titre, description: a.resume, publishedTime: a.date },
  };
}

/** Bouton de fin d’article selon le public visé. */
function lienCta(publicVise) {
  if (publicVise === 'entreprises') return '/entreprises/demande-de-demo';
  return lienInscription(publicVise === 'independants' ? 'independant' : 'talent');
}

export default async function PageArticle({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const rubrique = ressources.filtres.find((f) => f.id === article.public)?.label ?? 'Ressources';
  const cta = ressources.cta[article.public] ?? ressources.cta.talents;
  const autres = getArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  return (
    <>
      <div className="bg-sombre pb-14 pt-[128px] text-sur-sombre md:pt-[150px]">
        <div className="container max-w-3xl">
          <nav aria-label="Fil d’Ariane" className="text-sm text-white/85">
            <Link href="/ressources" className="hover:text-marque-vif">
              Ressources
            </Link>{' '}
            › {rubrique}
          </nav>
          <h1 className="mt-4 text-balance font-serif text-4xl leading-tight md:text-5xl">{article.titre}</h1>
          <p className="mt-4 text-white/85">
            <time dateTime={article.date}>{dateLongue(article.date)}</time> · {article.minutes} {ressources.minutes} · {article.auteur}
          </p>
        </div>
      </div>

      <article className="container max-w-3xl py-12">
        {/* Contenu Markdown converti en HTML (fichiers rédigés par l’équipe) */}
        <div className="article font-serif text-principal" dangerouslySetInnerHTML={{ __html: article.html }} />

        <aside className="mt-12 flex flex-col gap-4 rounded-lg bg-sombre p-7 text-sur-sombre sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-semibold">{cta.titre}</p>
          <Bouton href={lienCta(article.public)}>{cta.bouton}</Bouton>
        </aside>

        {/* Bannière d’une marque affiliée, seulement pendant une campagne (content/fr/publicites.js) */}
        <BannierePub campagne={choisirCampagne('ressources')} className="mt-12" />

        {autres.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold">{ressources.lireAussi}</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {autres.map((a) => (
                <li key={a.slug}>
                  <Link href={`/ressources/${a.slug}`} className="block rounded-lg border border-base p-5 hover:shadow-carte">
                    <span className="font-serif text-lg">{a.titre}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <BandeNewsletter />
    </>
  );
}
