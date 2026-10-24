import { redirect } from 'next/navigation';
import Plateforme from '@/components/plateforme/Plateforme';
import { adressePlateforme, lireAdressePlateforme } from '@/lib/routesPlateforme';
import { compteConnecte } from '@/lib/serveur/session';
import { SCRIPT_THEME } from '@/lib/theme';

export const metadata = {
  title: 'Plateforme',
  description: 'Espace LIGGEEY : connexion, inscription, offres, candidatures et suivi.',
  robots: { index: false, follow: false },
};

const CONNEXION = '/plateforme/connexion';

/**
 * Adresses de la plateforme (lib/routesPlateforme.js), contrôlées ici, côté serveur, avec la session
 * (cookie httpOnly, lib/serveur/session.js) :
 * - /plateforme/connexion, /plateforme/inscription(?profil=…) : portes d’entrée depuis le site.
 *   Déjà connecté : on arrive sur son tableau de bord ;
 * - /plateforme/{espace}/{écran} : écrans internes, réservés au compte connecté de cet espace.
 *   Sans session : la connexion ; compte d’un autre espace : son propre tableau de bord ;
 * - /plateforme seul, ou adresse inconnue : le tableau de bord si connecté, sinon la connexion.
 */
export default async function PagePlateforme({ params, searchParams }) {
  const { ecran = [] } = await params;
  const { profil = null } = await searchParams;
  const compte = await compteConnecte();
  const tableauDeBord = compte ? adressePlateforme({ screen: 'dashboard', espace: compte.profil }) : CONNEXION;

  const demande = lireAdressePlateforme(ecran, typeof profil === 'string' ? profil : null);
  if (!demande) redirect(tableauDeBord);
  if (demande.type === 'auth' && compte && demande.screen !== 'signup-confirm') redirect(tableauDeBord);
  if (demande.type === 'app' && (!compte || demande.espace !== compte.profil)) redirect(tableauDeBord);

  return (
    <>
      {/* Thème sombre posé avant l’affichage, sans flash clair (lib/theme.js). */}
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_THEME }} />
      <Plateforme chemin={ecran} profil={typeof profil === 'string' ? profil : null} compte={compte} comptesDemo={process.env.NEXT_PUBLIC_COMPTES_DEMO === 'true'} />
    </>
  );
}
