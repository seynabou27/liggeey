import { publicites } from '@/content/fr/publicites';

/** Espaces de la plateforme qui peuvent recevoir une bannière (jamais Cap Métier, mentor ni admin). */
export const ESPACES_PUBLICITE = ['chercheur', 'prestataire', 'entreprise'];

/** Date du jour à Dakar (UTC+0), au format AAAA-MM-JJ. */
const aujourdhui = () => new Date().toISOString().slice(0, 10);

/**
 * Campagnes en cours pour un emplacement ('accueil', 'ressources', 'tableau-de-bord').
 * - espace : pour le tableau de bord, l’espace du compte connecté
 * - date : AAAA-MM-JJ, le jour même par défaut
 */
export function campagnesActives(emplacement, { espace, date = aujourdhui(), campagnes = publicites.campagnes } = {}) {
  if (espace && !ESPACES_PUBLICITE.includes(espace)) return [];
  return campagnes.filter(
    (c) =>
      c.emplacements?.includes(emplacement) &&
      c.debut <= date &&
      date <= c.fin &&
      (!espace || !c.espaces || c.espaces.includes(espace)),
  );
}

/** Une campagne en cours, tirée au hasard, ou null. */
export function choisirCampagne(emplacement, options) {
  const liste = campagnesActives(emplacement, options);
  return liste.length > 0 ? liste[Math.floor(Math.random() * liste.length)] : null;
}
