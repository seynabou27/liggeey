'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { accueil } from '@/content/fr/accueil';
import { lienConnexion, lienInscription } from '@/lib/liens';
import Bouton from '@/components/ui/Bouton';
import { GrilleOffres } from './CarteOffre';

const CLES = ['q', 'secteur', 'contrat', 'ville', 'experience', 'niveau'];

const sansAccents = (texte) =>
  String(texte ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export function filtrerOffres(offres, f) {
  return offres.filter(
    (o) =>
      (!f.q || sansAccents([o.titre, o.entreprise, ...(o.competences ?? [])].join(' ')).includes(sansAccents(f.q))) &&
      (!f.secteur || o.secteur === f.secteur) &&
      (!f.contrat || o.contrat === f.contrat) &&
      (!f.ville || o.ville === f.ville) &&
      (!f.experience || o.experience === f.experience) &&
      (!f.niveau || o.niveau === f.niveau),
  );
}

function Message({ texte, filtres }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-lg bg-orange-clair p-8 text-center" role="status">
      <p className="text-lg">{texte}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Bouton href={lienInscription('talent')}>Créer mon compte</Bouton>
        {filtres && (
          <>
            <Bouton href={lienConnexion()} variante="secondaire">
              Se connecter
            </Bouton>
            <Link href="/" scroll={false} className="lien inline-flex min-h-[44px] items-center">
              {accueil.offres.effacer}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

/** Vitrine des offres, filtrée par la carte de recherche du bandeau (paramètres d'URL). */
export default function VitrineOffres({ offres }) {
  const params = useSearchParams();
  const filtres = Object.fromEntries(CLES.map((cle) => [cle, params.get(cle) ?? '']));
  const actifs = CLES.some((cle) => filtres[cle]);

  if (offres.length === 0) return <Message texte={accueil.offres.aucune} />;
  const liste = actifs ? filtrerOffres(offres, filtres) : offres;
  if (liste.length === 0) return <Message texte={accueil.offres.sansResultat} filtres={filtres} />;
  return <GrilleOffres offres={liste} offreInitiale={params.get('offre')} />;
}
