/**
 * Publicités des marques affiliées (service « Publicité pour les marques affiliées », 25 000 FCFA / campagne).
 *
 * Une bannière ne s’affiche que pendant sa campagne. Sans campagne en cours, aucun emplacement n’apparaît.
 *
 * Emplacements :
 * - 'accueil' : sous la vitrine des offres de l’accueil ;
 * - 'ressources' : en fin d’article, dans les Ressources ;
 * - 'tableau-de-bord' : en bas du tableau de bord de la plateforme (chercheur, prestataire, entreprise).
 *   Jamais dans l’espace Cap Métier (mineurs), ni chez les mentors et l’admin, ni pour les comptes de démonstration.
 *
 * Ajouter une campagne :
 * 1. déposer les deux images dans public/images/publicites/ (JPEG ou PNG, moins de 100 Ko chacune) :
 *    - mobile : 640 × 200 px (affichée en 320 × 100) ;
 *    - large : 1 456 × 180 px (affichée en 728 × 90, à partir de 768 px de large) ;
 * 2. ajouter un objet dans `campagnes`, sur ce modèle :
 *    {
 *      id: 'marque-novembre-2026',
 *      annonceur: 'Nom de la marque',
 *      lien: 'https://www.exemple.sn',
 *      alt: 'Ce que montre la bannière, en une phrase.',
 *      image: { mobile: '/images/publicites/marque-mobile.jpg', large: '/images/publicites/marque-large.jpg' },
 *      emplacements: ['accueil', 'tableau-de-bord'],
 *      espaces: ['chercheur', 'prestataire'], // facultatif : sans ce champ, les trois espaces
 *      debut: '2026-11-01', // inclus
 *      fin: '2026-11-30', // inclus
 *    }
 * Si plusieurs campagnes visent le même emplacement, une est tirée au hasard à chaque affichage.
 *
 * `exemple` : campagne de démonstration, une publicité pour LIGGEEY elle-même (aucune marque tierce), sur les trois
 * emplacements et aussi pour les comptes de démonstration. Affichée seulement si NEXT_PUBLIC_PUB_EXEMPLE=true,
 * pour les tests et les captures. Mettre cette variable à false avant la mise en ligne.
 * Les gabarits gabarit-mobile.png et gabarit-large.png (« Votre marque ici ») montrent les formats aux marques.
 */
export const publicites = {
  mention: 'Publicité',
  campagnes: [],
  exemple: {
    id: 'exemple-liggeey',
    annonceur: 'LIGGEEY',
    lien: '/a-propos',
    alt: 'LIGGEEY : rendons l’insertion plus facile et plus juste. Offres vérifiées, accompagnement humain, bureau à Dakar. Découvrir.',
    image: { mobile: '/images/publicites/liggeey-mobile.jpg', large: '/images/publicites/liggeey-large.jpg' },
    emplacements: ['accueil', 'ressources', 'tableau-de-bord'],
    debut: '2000-01-01',
    fin: '2999-12-31',
  },
};
