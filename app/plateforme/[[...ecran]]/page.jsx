import { redirect } from 'next/navigation';
import Plateforme from '@/components/plateforme/Plateforme';
import { premierSegmentValide } from '@/lib/routesPlateforme';
import { SCRIPT_THEME } from '@/lib/theme';

export const metadata = {
  title: 'Plateforme',
  description: 'Espace LIGGEEY : connexion, inscription, offres, candidatures et suivi.',
  robots: { index: false, follow: false },
};

/**
 * Adresses de la plateforme (lib/routesPlateforme.js) :
 * - /plateforme : reprise de la session de test, ou connexion s'il n'y en a pas ;
 * - /plateforme/connexion, /plateforme/inscription(?profil=…) : portes d'entrée depuis le site ;
 * - /plateforme/{espace}/{écran} : écrans internes. Ils ne s'ouvrent que si une session est ouverte
 *   pour cet espace dans le navigateur ; sinon le prototype affiche la connexion.
 * Toute autre adresse renvoie vers la connexion.
 */
export default async function PagePlateforme({ params, searchParams }) {
  const { ecran = [] } = await params;
  const { profil = null } = await searchParams;
  if (ecran.length > 0 && !premierSegmentValide(ecran[0])) redirect('/plateforme/connexion');
  return (
    <>
      {/* Thème sombre posé avant l'affichage, sans flash clair (lib/theme.js). */}
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_THEME }} />
      <Plateforme chemin={ecran} profil={typeof profil === 'string' ? profil : null} />
    </>
  );
}
