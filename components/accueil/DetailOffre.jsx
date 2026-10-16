'use client';

import { useEffect, useRef } from 'react';
import { BadgeCheck, Briefcase, GraduationCap, Layers, Lock, MapPin, Share2, TrendingUp, X } from 'lucide-react';
import { accueil } from '@/content/fr/accueil';
import { experiences, niveaux, secteurs } from '@/content/referentiels';
import { lienAbsolu, lienConnexion, lienInscription, lienOffre, lienPartageWhatsApp } from '@/lib/liens';
import Bouton from '@/components/ui/Bouton';

const nomDe = (liste, id) => liste.find((e) => e.id === id)?.nom ?? id;

export const initiales = (nom) =>
  nom
    .split(/\s+/)
    .map((mot) => mot[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export function messagePartage(offre) {
  const t = accueil.offres;
  return `${t.messagePartage.replace('{titre}', offre.titre).replace('{entreprise}', offre.entreprise).replace('{ville}', offre.ville)} ${lienAbsolu(lienOffre(offre.id))}`;
}

/**
 * Détail d'une offre en fenêtre (balise <dialog> native : Échap, focus gardé dans la fenêtre, fond inerte).
 * L'offre complète et la candidature restent dans la plateforme : la fenêtre invite à se connecter.
 * @param {{ offre: object | null, onFermer: () => void }} props
 */
export default function DetailOffre({ offre, onFermer }) {
  const ref = useRef(null);
  const t = accueil.offres;
  const d = t.detail;

  useEffect(() => {
    const dialogue = ref.current;
    if (!dialogue) return;
    if (offre && !dialogue.open) dialogue.showModal();
    if (!offre && dialogue.open) dialogue.close();
  }, [offre]);

  const infos = offre
    ? [
        { icone: MapPin, libelle: d.lieu, valeur: offre.ville },
        { icone: Briefcase, libelle: d.contrat, valeur: offre.contrat },
        { icone: Layers, libelle: d.secteur, valeur: offre.secteur && nomDe(secteurs, offre.secteur) },
        { icone: TrendingUp, libelle: d.experience, valeur: offre.experience && nomDe(experiences, offre.experience) },
        { icone: GraduationCap, libelle: d.niveau, valeur: offre.niveau && nomDe(niveaux, offre.niveau) },
      ].filter((i) => i.valeur)
    : [];

  return (
    <dialog
      ref={ref}
      aria-labelledby="detail-offre-titre"
      onClose={onFermer}
      // Un clic sur le fond assombri ferme la fenêtre
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      className="m-auto max-h-[92vh] w-[calc(100%-24px)] max-w-xl overflow-y-auto rounded-lg bg-surface p-0 text-principal shadow-carte backdrop:bg-sombre/70 backdrop:backdrop-blur-sm"
    >
      {offre && (
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-sombre text-lg font-semibold text-sur-sombre" aria-hidden="true">
                {initiales(offre.entreprise)}
              </div>
              <div>
                <h2 id="detail-offre-titre" className="text-xl font-semibold leading-snug sm:text-2xl">
                  {offre.titre}
                </h2>
                <p className="mt-0.5 text-secondaire">{offre.entreprise}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label={d.fermer}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-doux"
              autoFocus
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <p className="flex items-start gap-2 rounded-lg bg-marque-doux px-4 py-3 text-sm font-medium">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {d.verifiee}
          </p>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {infos.map(({ icone: Icone, libelle, valeur }) => (
              <div key={libelle} className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-doux text-marque">
                  <Icone className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-xs font-medium text-secondaire">{libelle}</dt>
                  <dd className="font-semibold">{valeur}</dd>
                </div>
              </div>
            ))}
          </dl>

          {offre.description && <p className="leading-[1.7] text-secondaire">{offre.description}</p>}

          {offre.competences?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold">{d.competences}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {offre.competences.map((c) => (
                  <li key={c} className="rounded-full bg-doux px-3 py-1 text-[13px] font-medium">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-4 rounded-lg border border-base p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-marque text-sur-marque">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold">{d.connexionTitre}</h3>
                <p className="mt-1 text-sm leading-[1.7] text-secondaire">{d.connexionTexte}</p>
              </div>
            </div>
            <Bouton href={lienConnexion()} pleineLargeur>
              {d.connexion}
            </Bouton>
            <p className="text-center text-sm">
              {d.pasDeCompte}{' '}
              <a href={lienInscription('talent')} className="lien inline-flex min-h-[44px] items-center">
                {d.inscription}
              </a>
            </p>
          </div>

          <a
            href={lienPartageWhatsApp(messagePartage(offre))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 text-sm font-medium text-secondaire hover:text-principal"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            {t.partager}
          </a>
        </div>
      )}
    </dialog>
  );
}
