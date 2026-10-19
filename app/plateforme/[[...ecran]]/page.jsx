import { redirect } from 'next/navigation';
import Plateforme from '@/components/plateforme/Plateforme';

export const metadata = {
  title: 'Plateforme',
  description: 'Espace LIGGEEY : connexion, inscription, offres, candidatures et suivi.',
  robots: { index: false, follow: false },
};

const PROFILS = ['chercheur', 'prestataire', 'entreprise', 'jeune', 'mentor'];

/**
 * Adresse venant du site public (voir lib/liens.js) → écran d'ouverture du prototype.
 * Seules la connexion et l'inscription sont des portes d'entrée : aucune page interne
 * (offres, tableau de bord…) ne s'ouvre directement par son adresse.
 */
function ecranDepuis(segments, recherche) {
  const profil = PROFILS.includes(recherche?.profil) ? recherche.profil : null;
  switch (segments[0]) {
    case 'connexion':
      return { ecranInitial: 'login' };
    case 'inscription':
      return profil ? { ecranInitial: 'signup-info', profilInitial: profil } : { ecranInitial: 'signup-choice' };
    default:
      return {};
  }
}

export default async function PagePlateforme({ params, searchParams }) {
  const { ecran = [] } = await params;
  const recherche = await searchParams;
  // /plateforme seul : reprise de la session de test, ou connexion s'il n'y en a pas
  if (ecran.length > 0 && !['connexion', 'inscription'].includes(ecran[0])) redirect('/plateforme/connexion');
  return <Plateforme {...ecranDepuis(ecran, recherche)} />;
}
