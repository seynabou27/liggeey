'use client';

import { useState } from 'react';
import { ArrowRight, BadgeCheck, Briefcase, MapPin, Share2 } from 'lucide-react';
import { accueil } from '@/content/fr/accueil';
import { experiences } from '@/content/referentiels';
import { lienPartageWhatsApp } from '@/lib/liens';
import DetailOffre, { messagePartage, PastilleSecteur } from './DetailOffre';

/**
 * Une offre en vitrine, lisible d’un coup d’œil : secteur, poste, entreprise, puis contrat, lieu et expérience.
 * Toute la carte ouvre le détail dans une fenêtre (bouton étiré) ; le partage WhatsApp reste à part.
 */
export function CarteOffre({ offre, onVoir }) {
  const t = accueil.offres;
  const experience = experiences.find((e) => e.id === offre.experience)?.nom;

  return (
    <article className="group relative flex h-full flex-col gap-4 rounded-lg border border-base bg-surface p-5 transition-shadow hover:border-marque hover:shadow-carte">
      <div className="flex items-start gap-3">
        <PastilleSecteur offre={offre} />
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug">{offre.titre}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-[13px] text-secondaire">
            <span className="truncate">{offre.entreprise}</span>
            <BadgeCheck className="h-4 w-4 shrink-0 text-marque" aria-label={t.badge} role="img" />
          </p>
        </div>
      </div>

      <ul className="flex flex-wrap gap-2 text-xs font-medium">
        <li className="rounded-full bg-marque-doux px-2.5 py-1 font-semibold">{offre.contrat}</li>
        <li className="inline-flex items-center gap-1 rounded-full bg-doux px-2.5 py-1">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {offre.ville}
        </li>
        {experience && (
          <li className="inline-flex items-center gap-1 rounded-full bg-doux px-2.5 py-1">
            <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
            {experience}
          </li>
        )}
      </ul>

      {offre.competences?.length > 0 && <p className="text-[13px] leading-relaxed text-secondaire">{offre.competences.join(' · ')}</p>}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-base pt-3">
        <button
          type="button"
          onClick={() => onVoir?.(offre)}
          aria-haspopup="dialog"
          aria-label={`${t.voir} : ${offre.titre}`}
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-marque after:absolute after:inset-0 after:rounded-lg after:content-['']"
        >
          {t.voir}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </button>
        <a
          href={lienPartageWhatsApp(messagePartage(offre))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.partager} : ${offre.titre}`}
          className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-base hover:border-principal"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

/** Grille des offres en vitrine, avec la fenêtre de détail. */
export function GrilleOffres({ offres, offreInitiale = null }) {
  // Lien partagé (/?offre=…) : la fenêtre de l’offre s’ouvre directement
  const [ouverte, setOuverte] = useState(() => offres.find((o) => o.id === offreInitiale) ?? null);

  return (
    <>
      {/* Mobile : carrousel horizontal (une carte et demie visible) ; à partir de 768 px : grille */}
      <ul className="-mx-3 flex snap-x snap-mandatory scroll-px-3 gap-4 overflow-x-auto px-3 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden">
        {offres.map((offre) => (
          <li key={offre.id} className="w-[78%] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none">
            <CarteOffre offre={offre} onVoir={setOuverte} />
          </li>
        ))}
      </ul>
      {offres.length > 1 && <p className="mt-3 text-center text-[13px] text-secondaire md:hidden">{accueil.offres.glisser}</p>}
      <DetailOffre offre={ouverte} onFermer={() => setOuverte(null)} />
    </>
  );
}
