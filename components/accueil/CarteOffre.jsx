'use client';

import { useState } from 'react';
import { BadgeCheck, MapPin, Share2 } from 'lucide-react';
import { accueil } from '@/content/fr/accueil';
import { lienPartageWhatsApp } from '@/lib/liens';
import DetailOffre, { initiales, messagePartage } from './DetailOffre';

/** Une offre en vitrine. « Voir » ouvre le détail dans une fenêtre. */
export function CarteOffre({ offre, onVoir }) {
  const t = accueil.offres;

  return (
    <article className="flex h-full flex-col items-center gap-3 rounded-lg border border-base bg-surface p-5 text-center transition-shadow hover:shadow-carte">
      <div className="flex w-full items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-marque-doux px-2.5 py-1 text-xs font-semibold">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
          {t.badge}
        </span>
        <span className="rounded-full border border-base px-2.5 py-1 text-xs font-medium">{offre.contrat}</span>
      </div>
      <div className="grid h-14 w-14 place-items-center rounded-xl bg-sombre text-lg font-semibold text-sur-sombre" aria-hidden="true">
        {initiales(offre.entreprise)}
      </div>
      <div>
        <h3 className="text-base font-medium leading-normal">{offre.titre}</h3>
        <p className="mt-1 text-[13px] text-secondaire">{offre.entreprise}</p>
      </div>
      {offre.competences?.length > 0 && <p className="text-[13px] text-secondaire">{offre.competences.join(' · ')}</p>}
      <div className="mt-auto flex w-full items-center justify-between gap-2 pt-2">
        <span className="inline-flex items-center gap-1 text-sm font-medium">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {offre.ville}
        </span>
        <div className="flex items-center gap-1.5">
          <a
            href={lienPartageWhatsApp(messagePartage(offre))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.partager} : ${offre.titre}`}
            className="grid h-11 w-11 place-items-center rounded-full border border-base hover:border-principal"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => onVoir?.(offre)}
            aria-haspopup="dialog"
            aria-label={`${t.voir} : ${offre.titre}`}
            className="inline-flex min-h-[44px] items-center rounded-full bg-marque px-5 text-sm font-semibold text-sur-marque hover:bg-marque-survol"
          >
            {t.voir}
          </button>
        </div>
      </div>
    </article>
  );
}

/** Grille des offres en vitrine, avec la fenêtre de détail. */
export function GrilleOffres({ offres, offreInitiale = null }) {
  // Lien partagé (/?offre=…) : la fenêtre de l'offre s'ouvre directement
  const [ouverte, setOuverte] = useState(() => offres.find((o) => o.id === offreInitiale) ?? null);

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {offres.map((offre) => (
          <li key={offre.id}>
            <CarteOffre offre={offre} onVoir={setOuverte} />
          </li>
        ))}
      </ul>
      <DetailOffre offre={ouverte} onFermer={() => setOuverte(null)} />
    </>
  );
}
