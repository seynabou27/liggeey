import offresDemo from '@/content/offres-demo.json';

/**
 * Offres affichées en vitrine sur l’accueil (8 au maximum).
 *
 * - Si APP_API_URL est défini : on lit l’API de l’application, mise en cache 1 h.
 *   Format attendu : [{ id, titre, entreprise, ville, contrat, secteur, experience, niveau, competences }]
 * - Sinon, si NEXT_PUBLIC_DEMO_OFFRES=true : offres d’exemple (entreprises fictives).
 * - Sinon : liste vide, la vitrine affiche un message et invite à s’inscrire.
 */
export async function getOffresVitrine() {
  const api = process.env.APP_API_URL;
  if (api) {
    try {
      const reponse = await fetch(`${api}/offres/vitrine`, { next: { revalidate: 3600 } });
      if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
      const donnees = await reponse.json();
      return Array.isArray(donnees) ? donnees.slice(0, 8) : [];
    } catch (erreur) {
      console.error('[offres] API indisponible :', erreur);
      return [];
    }
  }
  return process.env.NEXT_PUBLIC_DEMO_OFFRES === 'true' ? offresDemo.slice(0, 8) : [];
}
