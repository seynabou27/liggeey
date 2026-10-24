import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { accueil } from '@/content/fr/accueil';
import { secteurs } from '@/content/referentiels';
import { imageExiste } from '@/lib/images';
import { datePastille, heure } from '@/lib/format';
import { lienOffresSite } from '@/lib/liens';
import { Section, Source, TitreSection } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import Icone from '@/components/ui/Icone';
import PartageWhatsApp from '@/components/blocs/PartageWhatsApp';
import Compteur from '@/components/ui/Compteur';

/** Bande « trois parcours » : remplace la rangée de logos clients du modèle. */
export function BandeParcours() {
  const { parcours } = accueil;
  return (
    <section aria-labelledby="titre-parcours" className="bg-surface py-10 md:py-[50px]">
      <div className="container flex flex-col items-center gap-6 text-center">
        <h2 id="titre-parcours" className="max-w-3xl text-balance text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">
          {parcours.intro}
        </h2>
        <ul className="grid w-full max-w-5xl gap-2 lg:grid-cols-3">
          {parcours.items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="flex min-h-[56px] items-center justify-center gap-3 whitespace-nowrap rounded-lg px-4 py-3 text-lg font-semibold transition-colors hover:bg-marque-doux">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-marque-doux text-marque-fort">
                  <Icone nom={item.icone} className="h-5 w-5" />
                </span>
                {item.label}
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Secteurs : chaque carte ouvre les offres du secteur dans l’application. */
export function GrilleSecteurs() {
  const t = accueil.secteurs;
  return (
    <Section fond="gris" aria-labelledby="titre-secteurs">
      <TitreSection id="titre-secteurs" centre titre={t.titre} texte={t.texte} />
      <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {secteurs.map((s) => (
          <li key={s.id}>
            <Link href={lienOffresSite({ secteur: s.id })} scroll={false} className="flex h-full min-h-[44px] flex-col items-center gap-2 rounded-lg bg-surface p-4 text-center md:gap-3 md:p-6 shadow-[0_0_0_1px_rgb(var(--bordure-base))] transition-shadow hover:shadow-carte">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-marque-doux text-marque-fort md:h-12 md:w-12">
                <Icone nom={s.icone} />
              </span>
              <span className="text-[15px] font-medium leading-snug md:text-lg">{s.nom}</span>
              <span className="hidden rounded-full bg-doux px-4 py-0.5 text-xs font-medium md:inline">{t.lien}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/**
 * Constat (chiffres de l’enquête) : titre et texte à gauche, chiffres animés à droite.
 * Les sources restent toujours affichées sous les chiffres.
 */
export function BandeConstat() {
  const t = accueil.constat;
  return (
    <Section fond="gris" aria-labelledby="titre-constat">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col gap-4">
          <p className="surtitre">
            <span className="h-0.5 w-9 bg-marque" aria-hidden="true" />
            {t.surtitre}
          </p>
          <h2 id="titre-constat" className="text-balance text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">
            {t.titre}
          </h2>
          <p className="text-pretty text-[15px] leading-[1.7] text-secondaire">{t.texte}</p>
          <p>
            <Link href={t.lien.href} className="lien inline-flex min-h-[44px] items-center gap-1">
              {t.lien.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <dl className="grid grid-cols-2 gap-3 md:gap-4">
            {t.chiffres.map((c) => (
              <div key={c.texte} className="flex flex-col-reverse justify-end gap-2 rounded-lg bg-surface p-4 shadow-[0_0_0_1px_rgb(var(--bordure-base))] transition-shadow hover:shadow-carte md:gap-3 md:p-6">
                <dt className="text-[13px] leading-[1.5] text-secondaire md:text-[15px] md:leading-[1.6]">{c.texte}</dt>
                <dd className="text-[32px] font-light leading-none text-marque-titre md:text-5xl">
                  <Compteur valeur={c.valeur} />
                  <span className="ml-1">{c.unite}</span>
                </dd>
              </div>
            ))}
          </dl>
          <Source>{t.sources}</Source>
        </div>
      </div>
    </Section>
  );
}

/** Engagements en 3 + 2 cartes : remplace les avis clients du modèle (aucun témoignage inventé). */
export function Engagements() {
  const t = accueil.engagements;
  return (
    <Section aria-labelledby="titre-engagements">
      <TitreSection id="titre-engagements" centre titre={t.titre} texte={t.texte} />
      <ul className="grid gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-6">
        {t.items.map((item, i) => (
          <li key={item.titre} className={`grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 rounded-lg bg-surface p-5 shadow-[0_0_0_1px_rgb(var(--bordure-base))] md:flex md:flex-col md:gap-3 md:p-6 lg:col-span-2 ${i === 3 ? 'lg:col-start-2' : ''}`}>
            <span className="row-span-2 grid h-10 w-10 place-items-center rounded-full bg-marque-doux text-marque-fort md:h-12 md:w-12">
              <Icone nom={item.icone} />
            </span>
            <h3 className="self-center text-base font-semibold md:self-auto">{item.titre}</h3>
            <p className="leading-[1.6] text-secondaire md:leading-[1.7]">{item.texte}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center">
        <Link href={t.lien.href} className="lien">
          {t.lien.label}
        </Link>
      </p>
    </Section>
  );
}

/** Prochain Job Dating et rappel formations. */
export function AVenir({ evenement }) {
  const { jobDating, formations } = accueil.avenir;
  const avecPhoto = imageExiste(formations.image);
  const pastille = evenement ? datePastille(evenement.date) : null;

  return (
    <section aria-label="À venir" className="bg-surface pb-12 md:pb-20">
      <div className="container grid gap-5 md:grid-cols-2">
        <article className="flex flex-col gap-4 rounded-lg border border-base p-6 sm:flex-row sm:items-center">
          {pastille ? (
            <>
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-marque-doux text-center font-semibold leading-tight" aria-hidden="true">
                <span>
                  <span className="block text-2xl">{pastille.jour}</span>
                  <span className="block text-sm">{pastille.mois}</span>
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <h2 className="text-lg font-semibold">{jobDating.titre}</h2>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondaire">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    {heure(evenement.debut)} – {heure(evenement.fin)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {evenement.lieu}
                  </span>
                </p>
                <p>{jobDating.texte}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Bouton href={`/job-dating/${evenement.slug}#inscription`} petit>
                    {jobDating.bouton}
                  </Bouton>
                  <PartageWhatsApp evenement={evenement} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">{jobDating.titre}</h2>
              <p className="text-secondaire">{jobDating.vide}</p>
            </div>
          )}
        </article>

        <article className="flex flex-col gap-4 rounded-lg border border-base p-6 sm:flex-row sm:items-center">
          <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-marque-doux sm:w-36">
            {avecPhoto && <Image src={formations.image} alt="" fill sizes="144px" className="object-cover" />}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{formations.titre}</h2>
            <p className="text-secondaire">{formations.texte}</p>
            <Link href="/formations-mentorat" className="lien inline-flex min-h-[44px] items-center gap-1">
              {formations.lien}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
